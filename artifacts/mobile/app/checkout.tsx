import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GoldButton } from "@/components/GoldButton";
import { formatUGX } from "@/constants/sampleData";
import { useColors } from "@/hooks/useColors";
import type { PaymentNetwork } from "@/services/paymentService";
import { initiatePayment } from "@/services/paymentService";

interface NetworkOption {
  id: PaymentNetwork;
  name: string;
  shortName: string;
  color: string;
  prefix: string;
  icon: string;
}

const NETWORKS: NetworkOption[] = [
  {
    id: "mtn_momo",
    name: "MTN Mobile Money",
    shortName: "MTN MoMo",
    color: "#FFCC00",
    prefix: "077, 076, 039, 031",
    icon: "smartphone",
  },
  {
    id: "airtel_money",
    name: "Airtel Money",
    shortName: "Airtel Money",
    color: "#FF0000",
    prefix: "070, 074, 075",
    icon: "smartphone",
  },
];

export default function CheckoutScreen() {
  const params = useLocalSearchParams<{
    artworkId: string;
    title: string;
    amount: string;
    currency: string;
    artistName: string;
  }>();
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const amount = Number(params.amount ?? 0);
  const [phone, setPhone] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<PaymentNetwork | null>(null);
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const ganaFee = Math.round(amount * 0.02);
  const total = amount + ganaFee;

  const validatePhone = (val: string) => {
    const cleaned = val.replace(/\D/g, "");
    if (cleaned.length < 9) return "Enter a valid Ugandan number";
    return "";
  };

  const handlePay = async () => {
    const err = validatePhone(phone);
    if (err) { setPhoneError(err); return; }
    if (!selectedNetwork) return;

    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    const result = await initiatePayment({
      amount: total,
      currency: params.currency ?? "UGX",
      phoneNumber: phone.startsWith("+256") ? phone : `+256${phone.replace(/^0/, "")}`,
      network: selectedNetwork,
      description: `GANA HUB: ${params.title ?? "Artwork purchase"}`,
      orderId: `order_${Date.now()}`,
      userId: "user_demo",
      artworkId: params.artworkId,
    });

    setLoading(false);

    if (result.success) {
      router.replace({
        pathname: "/payment-processing",
        params: { reference: result.reference, network: selectedNetwork, amount: total, currency: params.currency },
      } as never);
    } else {
      router.replace({
        pathname: "/payment-failed",
        params: { message: result.message },
      } as never);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12 }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Checkout</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.content}>
          {/* Order Summary */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <Text style={[styles.cardTitle, { color: colors.mutedForeground }]}>ORDER SUMMARY</Text>
            <View style={styles.orderItem}>
              <View style={styles.orderLeft}>
                <Text style={[styles.orderArtwork, { color: colors.foreground }]} numberOfLines={2}>
                  {params.title ?? "Artwork"}
                </Text>
                <Text style={[styles.orderArtist, { color: colors.mutedForeground }]}>
                  by {params.artistName ?? "Artist"}
                </Text>
              </View>
              <Text style={[styles.orderPrice, { color: colors.foreground }]}>{formatUGX(amount)}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.feeRow}>
              <Text style={[styles.feeLabel, { color: colors.mutedForeground }]}>Platform fee (2%)</Text>
              <Text style={[styles.feeVal, { color: colors.mutedForeground }]}>{formatUGX(ganaFee)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.foreground }]}>Total</Text>
              <Text style={[styles.totalVal, { color: colors.gold }]}>{formatUGX(total)}</Text>
            </View>
          </View>

          {/* Network Selection */}
          <View>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>SELECT PAYMENT NETWORK</Text>
            <View style={styles.networkList}>
              {NETWORKS.map((net) => {
                const active = selectedNetwork === net.id;
                return (
                  <Pressable
                    key={net.id}
                    onPress={() => setSelectedNetwork(net.id)}
                    style={[
                      styles.networkCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: active ? net.color : colors.border,
                        borderRadius: colors.radius,
                        borderWidth: active ? 2 : 1,
                      },
                    ]}
                  >
                    <View style={[styles.networkColorDot, { backgroundColor: net.color }]} />
                    <View style={styles.networkInfo}>
                      <Text style={[styles.networkName, { color: colors.foreground }]}>{net.name}</Text>
                      <Text style={[styles.networkPrefixes, { color: colors.mutedForeground }]}>
                        Prefixes: {net.prefix}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.networkRadio,
                        {
                          borderColor: active ? net.color : colors.border,
                          backgroundColor: active ? net.color : "transparent",
                        },
                      ]}
                    >
                      {active && <Feather name="check" size={10} color="#000" />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Phone Number */}
          <View>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>MOBILE NUMBER</Text>
            <View
              style={[
                styles.phoneInput,
                {
                  backgroundColor: colors.muted,
                  borderColor: phoneError ? colors.destructive : colors.border,
                  borderRadius: colors.radius,
                },
              ]}
            >
              <View style={[styles.prefix, { borderRightColor: colors.border }]}>
                <Text style={[styles.prefixText, { color: colors.foreground }]}>🇺🇬 +256</Text>
              </View>
              <TextInput
                value={phone}
                onChangeText={(t) => { setPhone(t); setPhoneError(""); }}
                placeholder="7XX XXX XXX"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="phone-pad"
                style={[styles.phoneTextInput, { color: colors.foreground }]}
                maxLength={12}
              />
            </View>
            {phoneError ? (
              <Text style={[styles.errorText, { color: colors.destructive }]}>{phoneError}</Text>
            ) : (
              <Text style={[styles.phoneHint, { color: colors.mutedForeground }]}>
                You will receive a USSD push notification to approve payment
              </Text>
            )}
          </View>

          {/* Security Note */}
          <View style={[styles.securityNote, { backgroundColor: colors.muted, borderRadius: 8 }]}>
            <Feather name="shield" size={14} color={colors.gold} />
            <Text style={[styles.securityText, { color: colors.mutedForeground }]}>
              Your payment is secured. We never store your PIN or mobile money credentials.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer CTA */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 12,
          },
        ]}
      >
        <GoldButton
          label={`Pay ${formatUGX(total)} via ${selectedNetwork ? NETWORKS.find((n) => n.id === selectedNetwork)?.shortName : "Mobile Money"}`}
          onPress={handlePay}
          loading={loading}
          disabled={!selectedNetwork || phone.length < 9}
          fullWidth
          size="lg"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 18 },
  content: { paddingHorizontal: 20, gap: 24 },
  card: { padding: 16, borderWidth: 1, gap: 12 },
  cardTitle: { fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 2 },
  orderItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  orderLeft: { flex: 1, paddingRight: 12 },
  orderArtwork: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  orderArtist: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 3 },
  orderPrice: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  divider: { height: 1 },
  feeRow: { flexDirection: "row", justifyContent: "space-between" },
  feeLabel: { fontFamily: "Inter_400Regular", fontSize: 13 },
  feeVal: { fontFamily: "Inter_400Regular", fontSize: 13 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontFamily: "Inter_700Bold", fontSize: 16 },
  totalVal: { fontFamily: "Inter_700Bold", fontSize: 22 },
  sectionLabel: { fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 2, marginBottom: 10 },
  networkList: { gap: 10 },
  networkCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  networkColorDot: { width: 14, height: 14, borderRadius: 7 },
  networkInfo: { flex: 1 },
  networkName: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  networkPrefixes: { fontFamily: "Inter_400Regular", fontSize: 11, marginTop: 2 },
  networkRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  phoneInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    height: 52,
  },
  prefix: {
    paddingHorizontal: 14,
    height: "100%",
    justifyContent: "center",
    borderRightWidth: 1,
  },
  prefixText: { fontFamily: "Inter_500Medium", fontSize: 14 },
  phoneTextInput: { flex: 1, paddingHorizontal: 14, fontFamily: "Inter_400Regular", fontSize: 16 },
  errorText: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 4 },
  phoneHint: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 6, lineHeight: 17 },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
  },
  securityText: { fontFamily: "Inter_400Regular", fontSize: 12, flex: 1, lineHeight: 17 },
  footer: {
    borderTopWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 20,
  },
});
