import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GoldButton } from "@/components/GoldButton";
import { useColors } from "@/hooks/useColors";

export default function PaymentFailedScreen() {
  const { message } = useLocalSearchParams<{ message: string }>();
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const iconScale = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    iconScale.value = withSpring(1, { damping: 12 });
    contentOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const commonReasons = [
    "Insufficient funds in your mobile money wallet",
    "You did not approve the payment in time",
    "Incorrect Mobile Money PIN entered",
    "Network connectivity issues",
    "Transaction declined by your mobile network",
  ];

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
          paddingTop: Platform.OS === "web" ? 67 : insets.top,
          paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20,
        },
      ]}
    >
      <View style={styles.content}>
        <Animated.View
          style={[
            iconStyle,
            styles.iconCircle,
            { backgroundColor: `${colors.destructive}15`, borderColor: colors.destructive },
          ]}
        >
          <Feather name="x" size={52} color={colors.destructive} />
        </Animated.View>

        <Animated.View style={[contentStyle, styles.textBlock]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Payment Failed</Text>
          {message ? (
            <Text style={[styles.errorMsg, { color: colors.destructive }]}>{message}</Text>
          ) : null}
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Your payment could not be completed. No money has been deducted from your account.
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            contentStyle,
            styles.reasonsCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <Text style={[styles.reasonsTitle, { color: colors.mutedForeground }]}>COMMON REASONS</Text>
          {commonReasons.map((reason) => (
            <View key={reason} style={styles.reasonRow}>
              <View style={[styles.bullet, { backgroundColor: colors.muted }]} />
              <Text style={[styles.reasonText, { color: colors.mutedForeground }]}>{reason}</Text>
            </View>
          ))}
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <GoldButton
          label="Try Again"
          onPress={() => router.back()}
          fullWidth
          size="lg"
        />
        <Pressable onPress={() => router.replace("/(tabs)/gallery" as never)} style={styles.cancelLink}>
          <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>Return to Gallery</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24, gap: 24 },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: { alignItems: "center", gap: 8 },
  title: { fontFamily: "Inter_700Bold", fontSize: 28 },
  errorMsg: { fontFamily: "Inter_500Medium", fontSize: 14, textAlign: "center" },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 14, textAlign: "center", lineHeight: 21 },
  reasonsCard: { width: "100%", padding: 16, borderWidth: 1, gap: 10 },
  reasonsTitle: { fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 2, marginBottom: 4 },
  reasonRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  bullet: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
  reasonText: { fontFamily: "Inter_400Regular", fontSize: 12, flex: 1, lineHeight: 18 },
  footer: { paddingHorizontal: 24, gap: 12 },
  cancelLink: { alignItems: "center" },
  cancelText: { fontFamily: "Inter_400Regular", fontSize: 13 },
});
