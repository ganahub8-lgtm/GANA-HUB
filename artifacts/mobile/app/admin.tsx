import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SAMPLE_ARTISTS, SAMPLE_TRANSACTIONS, formatUGX } from "@/constants/sampleData";
import { useColors } from "@/hooks/useColors";

type Tab = "overview" | "transactions" | "artists";

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  const colors = useColors();
  return (
    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <Feather name={icon as never} size={18} color={color} />
      </View>
      <Text style={[styles.statVal, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

export default function AdminScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const totalRevenue = SAMPLE_TRANSACTIONS.filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);
  const failedCount = SAMPLE_TRANSACTIONS.filter((t) => t.status === "failed").length;

  const statusColor = (status: string) => {
    if (status === "completed") return colors.success ?? "#22C55E";
    if (status === "failed") return colors.destructive;
    return colors.gold;
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Admin Dashboard</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>GANA HUB Control Panel</Text>
        </View>
        <View style={[styles.adminBadge, { backgroundColor: `${colors.gold}20` }]}>
          <Text style={[styles.adminBadgeText, { color: colors.gold }]}>ADMIN</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
        {(["overview", "transactions", "artists"] as Tab[]).map((tab) => {
          const active = activeTab === tab;
          const labels: Record<Tab, string> = { overview: "Overview", transactions: "Payments", artists: "Artists" };
          return (
            <Pressable key={tab} onPress={() => setActiveTab(tab)} style={styles.tab}>
              <Text style={[styles.tabText, { color: active ? colors.gold : colors.mutedForeground }]}>
                {labels[tab]}
              </Text>
              {active && <View style={[styles.tabIndicator, { backgroundColor: colors.gold }]} />}
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {activeTab === "overview" && (
          <View style={styles.section}>
            {/* Stats */}
            <View style={styles.statsGrid}>
              <StatCard label="Total Revenue" value={formatUGX(totalRevenue)} icon="dollar-sign" color={colors.gold} />
              <StatCard label="Artists" value={String(SAMPLE_ARTISTS.length)} icon="users" color="#60A5FA" />
              <StatCard label="Transactions" value={String(SAMPLE_TRANSACTIONS.length)} icon="credit-card" color="#34D399" />
              <StatCard label="Failed Pays" value={String(failedCount)} icon="alert-circle" color={colors.destructive} />
            </View>

            {/* Recent Activity */}
            <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>RECENT ACTIVITY</Text>
            {SAMPLE_TRANSACTIONS.slice(0, 3).map((txn) => (
              <View
                key={txn.id}
                style={[styles.activityRow, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: 8 }]}
              >
                <View style={[styles.activityDot, { backgroundColor: statusColor(txn.status) }]} />
                <View style={styles.activityInfo}>
                  <Text style={[styles.activityDesc, { color: colors.foreground }]} numberOfLines={1}>{txn.description}</Text>
                  <Text style={[styles.activityMeta, { color: colors.mutedForeground }]}>
                    {txn.network} · {new Date(txn.createdAt).toLocaleDateString("en-UG")}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.activityAmount, { color: colors.foreground }]}>{formatUGX(txn.amount)}</Text>
                  <Text style={[styles.activityStatus, { color: statusColor(txn.status) }]}>
                    {txn.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            ))}

            {/* Payment Split */}
            <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>PAYMENT NETWORKS</Text>
            <View style={[styles.splitCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
              {[
                { label: "MTN Mobile Money", count: SAMPLE_TRANSACTIONS.filter((t) => t.paymentMethod === "mtn_momo").length, color: "#FFCC00" },
                { label: "Airtel Money", count: SAMPLE_TRANSACTIONS.filter((t) => t.paymentMethod === "airtel_money").length, color: "#FF0000" },
              ].map((net) => (
                <View key={net.label} style={[styles.splitRow, { borderBottomColor: colors.border }]}>
                  <View style={[styles.netDot, { backgroundColor: net.color }]} />
                  <Text style={[styles.splitLabel, { color: colors.foreground }]}>{net.label}</Text>
                  <Text style={[styles.splitCount, { color: colors.mutedForeground }]}>{net.count} txns</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "transactions" && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>ALL TRANSACTIONS</Text>
            {SAMPLE_TRANSACTIONS.map((txn) => (
              <View
                key={txn.id}
                style={[styles.txnCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
              >
                <View style={styles.txnHeader}>
                  <Text style={[styles.txnRef, { color: colors.gold }]}>{txn.reference}</Text>
                  <View style={[styles.txnStatus, { backgroundColor: `${statusColor(txn.status)}20` }]}>
                    <Text style={[styles.txnStatusText, { color: statusColor(txn.status) }]}>
                      {txn.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.txnDesc, { color: colors.foreground }]}>{txn.description}</Text>
                {[
                  { label: "Amount", val: formatUGX(txn.amount) },
                  { label: "Network", val: txn.network },
                  { label: "Phone", val: txn.phoneNumber },
                  { label: "Date", val: new Date(txn.createdAt).toLocaleString("en-UG") },
                ].map((row) => (
                  <View key={row.label} style={styles.txnRow}>
                    <Text style={[styles.txnLabel, { color: colors.mutedForeground }]}>{row.label}</Text>
                    <Text style={[styles.txnVal, { color: colors.foreground }]}>{row.val}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {activeTab === "artists" && (
          <View style={styles.section}>
            <View style={styles.artistsHeader}>
              <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>REGISTERED ARTISTS</Text>
              <Text style={[styles.artistCount, { color: colors.gold }]}>{SAMPLE_ARTISTS.length} total</Text>
            </View>
            {SAMPLE_ARTISTS.map((artist) => (
              <View
                key={artist.id}
                style={[styles.artistRow, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
              >
                <View style={styles.artistInfo}>
                  <View style={styles.artistNameRow}>
                    <Text style={[styles.artistName, { color: colors.foreground }]}>{artist.stageName}</Text>
                    {artist.featured && (
                      <View style={[styles.featuredBadge, { backgroundColor: colors.gold }]}>
                        <Text style={[styles.featuredText, { color: colors.primaryForeground }]}>Featured</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.artistMeta, { color: colors.mutedForeground }]}>
                    {artist.city}, {artist.country} · {artist.categories[0]}
                  </Text>
                  <Text style={[styles.artistMeta, { color: colors.mutedForeground }]}>{artist.email}</Text>
                </View>
                <View style={styles.artistActions}>
                  <Pressable style={[styles.actionBtn, { backgroundColor: colors.muted }]} onPress={() => router.push(`/artist/${artist.id}` as never)}>
                    <Feather name="eye" size={14} color={colors.foreground} />
                  </Pressable>
                  <Pressable style={[styles.actionBtn, { backgroundColor: colors.muted }]}>
                    <Feather name="star" size={14} color={artist.featured ? colors.gold : colors.mutedForeground} />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 18 },
  headerSub: { fontFamily: "Inter_400Regular", fontSize: 11, marginTop: 2 },
  adminBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  adminBadgeText: { fontFamily: "Inter_700Bold", fontSize: 10, letterSpacing: 1.5 },
  tabs: { flexDirection: "row", borderBottomWidth: 1, marginHorizontal: 20 },
  tab: { flex: 1, paddingVertical: 14, alignItems: "center", position: "relative" },
  tabText: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  tabIndicator: { position: "absolute", bottom: 0, left: "25%", right: "25%", height: 2, borderRadius: 1 },
  section: { paddingHorizontal: 20, paddingTop: 20, gap: 12 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statCard: { width: "47%", flexGrow: 1, padding: 14, borderWidth: 1, gap: 6, alignItems: "flex-start" },
  statIcon: { width: 36, height: 36, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  statVal: { fontFamily: "Inter_700Bold", fontSize: 18 },
  statLabel: { fontFamily: "Inter_400Regular", fontSize: 11 },
  sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 2, marginTop: 8 },
  activityRow: { flexDirection: "row", alignItems: "center", padding: 12, borderWidth: 1, gap: 10 },
  activityDot: { width: 8, height: 8, borderRadius: 4 },
  activityInfo: { flex: 1 },
  activityDesc: { fontFamily: "Inter_500Medium", fontSize: 13 },
  activityMeta: { fontFamily: "Inter_400Regular", fontSize: 11, marginTop: 2 },
  activityAmount: { fontFamily: "Inter_600SemiBold", fontSize: 13, textAlign: "right" },
  activityStatus: { fontFamily: "Inter_700Bold", fontSize: 9, letterSpacing: 1, textAlign: "right" },
  splitCard: { borderWidth: 1, overflow: "hidden" },
  splitRow: { flexDirection: "row", alignItems: "center", padding: 12, borderBottomWidth: 1, gap: 10 },
  netDot: { width: 10, height: 10, borderRadius: 5 },
  splitLabel: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 13 },
  splitCount: { fontFamily: "Inter_400Regular", fontSize: 13 },
  txnCard: { padding: 14, borderWidth: 1, gap: 8 },
  txnHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  txnRef: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  txnStatus: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  txnStatusText: { fontFamily: "Inter_700Bold", fontSize: 9, letterSpacing: 1 },
  txnDesc: { fontFamily: "Inter_500Medium", fontSize: 14 },
  txnRow: { flexDirection: "row", justifyContent: "space-between" },
  txnLabel: { fontFamily: "Inter_400Regular", fontSize: 12 },
  txnVal: { fontFamily: "Inter_500Medium", fontSize: 12 },
  artistsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  artistCount: { fontFamily: "Inter_700Bold", fontSize: 16 },
  artistRow: { flexDirection: "row", alignItems: "center", padding: 12, borderWidth: 1, gap: 10 },
  artistInfo: { flex: 1, gap: 3 },
  artistNameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  artistName: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  featuredBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 3 },
  featuredText: { fontFamily: "Inter_700Bold", fontSize: 8, letterSpacing: 0.5 },
  artistMeta: { fontFamily: "Inter_400Regular", fontSize: 11 },
  artistActions: { flexDirection: "row", gap: 6 },
  actionBtn: { width: 34, height: 34, borderRadius: 6, alignItems: "center", justifyContent: "center" },
});
