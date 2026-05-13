import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatUGX } from "@/constants/sampleData";
import { useColors } from "@/hooks/useColors";
import { verifyPayment } from "@/services/paymentService";
import type { PaymentNetwork } from "@/services/paymentService";

export default function PaymentProcessingScreen() {
  const params = useLocalSearchParams<{
    reference: string;
    network: PaymentNetwork;
    amount: string;
    currency: string;
  }>();
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [statusMsg, setStatusMsg] = useState("Sending request to your phone...");
  const pollCount = useRef(0);

  // Pulse animation
  const pulse = useSharedValue(1);
  const ring1 = useSharedValue(0);
  const ring2 = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(withTiming(1.12, { duration: 800 }), withTiming(1, { duration: 800 })),
      -1
    );
    ring1.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.out(Easing.ease) }), -1);
    ring2.value = withRepeat(
      withSequence(withTiming(0, { duration: 0 }), withTiming(1, { duration: 1600, easing: Easing.out(Easing.ease) })),
      -1,
      false,
      () => { ring2.value = 0; }
    );
  }, []);

  useEffect(() => {
    const messages = [
      "Sending request to your phone...",
      "Waiting for your approval...",
      "Confirming with " + (params.network === "mtn_momo" ? "MTN" : "Airtel") + "...",
      "Almost done...",
    ];

    const interval = setInterval(async () => {
      pollCount.current += 1;
      setStatusMsg(messages[Math.min(pollCount.current - 1, messages.length - 1)]);

      const result = await verifyPayment(params.reference ?? "", params.network ?? "mtn_momo");

      if (result.status === "completed") {
        clearInterval(interval);
        router.replace({
          pathname: "/payment-success",
          params: { reference: params.reference, amount: params.amount, network: params.network },
        } as never);
      } else if (result.status === "failed") {
        clearInterval(interval);
        router.replace({ pathname: "/payment-failed", params: { message: result.message } } as never);
      }

      // Timeout after ~45 seconds (15 polls × 3s)
      if (pollCount.current >= 15) {
        clearInterval(interval);
        router.replace({ pathname: "/payment-failed", params: { message: "Payment timed out. Please try again." } } as never);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const ring1Style = useAnimatedStyle(() => ({
    opacity: 1 - ring1.value,
    transform: [{ scale: 1 + ring1.value * 0.8 }],
  }));

  const ring2Style = useAnimatedStyle(() => ({
    opacity: 1 - ring2.value,
    transform: [{ scale: 1 + ring2.value * 0.8 }],
  }));

  const networkName = params.network === "mtn_momo" ? "MTN Mobile Money" : "Airtel Money";
  const networkColor = params.network === "mtn_momo" ? "#FFCC00" : "#FF0000";

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
          paddingTop: Platform.OS === "web" ? 67 : insets.top,
          paddingBottom: Platform.OS === "web" ? 34 : insets.bottom,
        },
      ]}
    >
      <View style={styles.center}>
        {/* Animated rings */}
        <View style={styles.ringContainer}>
          <Animated.View style={[styles.ring, { borderColor: networkColor + "30" }, ring1Style]} />
          <Animated.View style={[styles.ring, { borderColor: networkColor + "20" }, ring2Style]} />
          <Animated.View
            style={[
              pulseStyle,
              styles.circle,
              { backgroundColor: networkColor + "20", borderColor: networkColor },
            ]}
          >
            <Text style={[styles.circleIcon, { color: networkColor }]}>
              {params.network === "mtn_momo" ? "M" : "A"}
            </Text>
          </Animated.View>
        </View>

        <Text style={[styles.network, { color: networkColor }]}>{networkName}</Text>
        <Text style={[styles.amount, { color: colors.foreground }]}>
          {formatUGX(Number(params.amount ?? 0))}
        </Text>
        <Text style={[styles.statusMsg, { color: colors.mutedForeground }]}>{statusMsg}</Text>

        <View style={[styles.instructionBox, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <Text style={[styles.instructionTitle, { color: colors.foreground }]}>What to do now:</Text>
          {[
            "Check your phone for a USSD prompt",
            `Dial ${params.network === "mtn_momo" ? "*165*3#" : "*185#"} if no prompt appears`,
            "Enter your Mobile Money PIN to confirm",
            "Wait for the confirmation SMS",
          ].map((step, i) => (
            <View key={step} style={styles.step}>
              <View style={[styles.stepNum, { backgroundColor: colors.muted }]}>
                <Text style={[styles.stepNumText, { color: colors.mutedForeground }]}>{i + 1}</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.mutedForeground }]}>{step}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.ref, { color: colors.mutedForeground }]}>Ref: {params.reference}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24, gap: 16 },
  ringContainer: { width: 160, height: 160, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  ring: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  circleIcon: { fontFamily: "Inter_700Bold", fontSize: 40 },
  network: { fontFamily: "Inter_700Bold", fontSize: 20, letterSpacing: 1 },
  amount: { fontFamily: "Inter_700Bold", fontSize: 32 },
  statusMsg: { fontFamily: "Inter_400Regular", fontSize: 14, textAlign: "center" },
  instructionBox: { width: "100%", padding: 16, borderWidth: 1, gap: 12 },
  instructionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 13, marginBottom: 4 },
  step: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  stepNum: { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center", marginTop: 1 },
  stepNumText: { fontFamily: "Inter_700Bold", fontSize: 11 },
  stepText: { fontFamily: "Inter_400Regular", fontSize: 13, flex: 1, lineHeight: 18 },
  ref: { fontFamily: "Inter_400Regular", fontSize: 11, letterSpacing: 0.5 },
});
