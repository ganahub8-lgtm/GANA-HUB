import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GoldButton } from "@/components/GoldButton";
import { formatUGX } from "@/constants/sampleData";
import { useColors } from "@/hooks/useColors";

export default function PaymentSuccessScreen() {
  const params = useLocalSearchParams<{ reference: string; amount: string; network: string }>();
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const checkScale = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);

  useEffect(() => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    checkScale.value = withSpring(1, { damping: 12, stiffness: 150 });
    contentOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    contentTranslateY.value = withDelay(400, withSpring(0, { damping: 15 }));
  }, []);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const networkLabel = params.network === "mtn_momo" ? "MTN Mobile Money" : "Airtel Money";

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
        {/* Check animation */}
        <Animated.View style={[checkStyle, styles.checkCircle, { backgroundColor: `${colors.success}20`, borderColor: colors.success }]}>
          <Feather name="check" size={52} color={colors.success} />
        </Animated.View>

        <Animated.View style={[contentStyle, styles.textBlock]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Payment Confirmed!</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Your transaction was completed successfully via {networkLabel}.
          </Text>
        </Animated.View>

        {/* Receipt card */}
        <Animated.View
          style={[
            contentStyle,
            styles.receiptCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <Text style={[styles.receiptTitle, { color: colors.mutedForeground }]}>RECEIPT</Text>
          {[
            { label: "Amount Paid", val: formatUGX(Number(params.amount ?? 0)), highlight: true },
            { label: "Payment Method", val: networkLabel, highlight: false },
            { label: "Reference", val: params.reference ?? "-", highlight: false },
            { label: "Status", val: "CONFIRMED", highlight: true },
            { label: "Date", val: new Date().toLocaleDateString("en-UG", { day: "2-digit", month: "short", year: "numeric" }), highlight: false },
          ].map((row) => (
            <View key={row.label} style={[styles.receiptRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.receiptLabel, { color: colors.mutedForeground }]}>{row.label}</Text>
              <Text style={[styles.receiptVal, { color: row.highlight ? colors.gold : colors.foreground }]}>
                {row.val}
              </Text>
            </View>
          ))}
        </Animated.View>

        {/* Share / Download */}
        <Animated.View style={[contentStyle, styles.shareRow]}>
          <Pressable
            style={[styles.shareBtn, { backgroundColor: colors.muted, borderRadius: colors.radius }]}
            onPress={() => {}}
          >
            <Feather name="share-2" size={16} color={colors.foreground} />
            <Text style={[styles.shareBtnText, { color: colors.foreground }]}>Share Receipt</Text>
          </Pressable>
          <Pressable
            style={[styles.shareBtn, { backgroundColor: colors.muted, borderRadius: colors.radius }]}
            onPress={() => {}}
          >
            <Feather name="download" size={16} color={colors.foreground} />
            <Text style={[styles.shareBtnText, { color: colors.foreground }]}>Download</Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <GoldButton
          label="Back to Gallery"
          onPress={() => router.replace("/(tabs)/gallery" as never)}
          fullWidth
          size="lg"
        />
        <Pressable onPress={() => router.replace("/(tabs)/index" as never)} style={styles.homeLink}>
          <Text style={[styles.homeLinkText, { color: colors.mutedForeground }]}>Return to home</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24, gap: 20 },
  checkCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: { alignItems: "center", gap: 8 },
  title: { fontFamily: "Inter_700Bold", fontSize: 28, textAlign: "center" },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 14, textAlign: "center", lineHeight: 20 },
  receiptCard: { width: "100%", borderWidth: 1, overflow: "hidden" },
  receiptTitle: { fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 2, padding: 14, paddingBottom: 8 },
  receiptRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1 },
  receiptLabel: { fontFamily: "Inter_400Regular", fontSize: 13 },
  receiptVal: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  shareRow: { flexDirection: "row", gap: 12, width: "100%" },
  shareBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12 },
  shareBtnText: { fontFamily: "Inter_500Medium", fontSize: 13 },
  footer: { paddingHorizontal: 24, gap: 12 },
  homeLink: { alignItems: "center" },
  homeLinkText: { fontFamily: "Inter_400Regular", fontSize: 13 },
});
