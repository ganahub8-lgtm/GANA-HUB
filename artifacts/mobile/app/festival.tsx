import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GoldButton } from "@/components/GoldButton";
import { SAMPLE_EVENTS, formatUGX } from "@/constants/sampleData";
import { useColors } from "@/hooks/useColors";

export default function FestivalScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [activeTab, setActiveTab] = useState<"upcoming" | "workshops" | "apply">("upcoming");

  const mainEvent = SAMPLE_EVENTS[0]!;
  const workshops = SAMPLE_EVENTS.filter((e) => e.type === "Workshop");
  const exhibitions = SAMPLE_EVENTS.filter((e) => e.type === "Exhibition");

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={[styles.hero, { paddingTop: topPad }]}>
        <Image source={{ uri: mainEvent.imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
        <LinearGradient
          colors={["rgba(10,10,10,0.2)", "rgba(10,10,10,0.85)", colors.background]}
          style={StyleSheet.absoluteFill}
          locations={[0.1, 0.6, 1]}
        />
        <View style={styles.heroNav}>
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color="#fff" />
          </Pressable>
          <Text style={[styles.heroNavTitle, { color: colors.gold }]}>Festival Hub</Text>
          <View style={{ width: 20 }} />
        </View>
        <View style={styles.heroContent}>
          <View style={[styles.heroBadge, { backgroundColor: colors.gold }]}>
            <Text style={[styles.heroBadgeText, { color: colors.primaryForeground }]}>FLAGSHIP EVENT</Text>
          </View>
          <Text style={[styles.heroTitle, { color: colors.foreground }]}>{mainEvent.title}</Text>
          <View style={styles.heroMeta}>
            <View style={styles.metaItem}>
              <Feather name="calendar" size={13} color={colors.gold} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {new Date(mainEvent.startDate).toLocaleDateString("en-UG", { day: "2-digit", month: "long", year: "numeric" })}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="map-pin" size={13} color={colors.gold} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{mainEvent.city}</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="users" size={13} color={colors.gold} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{mainEvent.artistCount} artists</Text>
            </View>
          </View>
          <GoldButton
            label={`Get Tickets — ${formatUGX(mainEvent.price)}`}
            onPress={() =>
              router.push({
                pathname: "/checkout",
                params: {
                  title: mainEvent.title,
                  amount: mainEvent.price,
                  currency: mainEvent.currency,
                  artistName: "GANA HUB",
                },
              } as never)
            }
            size="md"
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
        {(["upcoming", "workshops", "apply"] as const).map((tab) => {
          const labels = { upcoming: "Events", workshops: "Workshops", apply: "Apply" };
          const active = activeTab === tab;
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

      {activeTab === "upcoming" && (
        <View style={styles.section}>
          {[...workshops, ...exhibitions, ...SAMPLE_EVENTS].slice(0, 5).map((event) => (
            <Pressable
              key={event.id}
              style={[styles.eventRow, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
              onPress={() =>
                router.push({
                  pathname: "/checkout",
                  params: { title: event.title, amount: event.price, currency: event.currency, artistName: "GANA HUB" },
                } as never)
              }
            >
              <Image source={{ uri: event.imageUrl }} style={styles.eventThumb} contentFit="cover" />
              <View style={styles.eventInfo}>
                <View style={[styles.eventType, { backgroundColor: colors.muted }]}>
                  <Text style={[styles.eventTypeText, { color: colors.mutedForeground }]}>{event.type.toUpperCase()}</Text>
                </View>
                <Text style={[styles.eventTitle, { color: colors.foreground }]} numberOfLines={2}>{event.title}</Text>
                <Text style={[styles.eventDate, { color: colors.mutedForeground }]}>
                  {new Date(event.startDate).toLocaleDateString("en-UG", { day: "2-digit", month: "short" })} · {event.city}
                </Text>
                <Text style={[styles.eventPrice, { color: colors.gold }]}>
                  {event.price === 0 ? "Free" : formatUGX(event.price)}
                </Text>
              </View>
              <View style={[styles.spotsTag, { backgroundColor: event.spotsLeft < 50 ? `${colors.destructive}20` : colors.muted }]}>
                <Text style={[styles.spotsText, { color: event.spotsLeft < 50 ? colors.destructive : colors.mutedForeground }]}>
                  {event.spotsLeft}
                </Text>
                <Text style={[styles.spotsLabel, { color: colors.mutedForeground }]}>left</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}

      {activeTab === "workshops" && (
        <View style={styles.section}>
          <Text style={[styles.sectionDesc, { color: colors.mutedForeground }]}>
            Hands-on workshops led by African masters. Develop your craft, build your network.
          </Text>
          {workshops.map((w) => (
            <View
              key={w.id}
              style={[styles.workshopCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
            >
              <Image source={{ uri: w.imageUrl }} style={styles.workshopImage} contentFit="cover" />
              <View style={styles.workshopContent}>
                <Text style={[styles.workshopTitle, { color: colors.foreground }]}>{w.title}</Text>
                <Text style={[styles.workshopDesc, { color: colors.mutedForeground }]} numberOfLines={3}>{w.description}</Text>
                <View style={styles.workshopMeta}>
                  <Text style={[styles.workshopPrice, { color: colors.gold }]}>{formatUGX(w.price)}</Text>
                  <Text style={[styles.workshopDate, { color: colors.mutedForeground }]}>
                    {new Date(w.startDate).toLocaleDateString("en-UG", { month: "short", day: "2-digit" })}
                  </Text>
                </View>
                <GoldButton label="Register Now" onPress={() => {}} size="sm" />
              </View>
            </View>
          ))}
        </View>
      )}

      {activeTab === "apply" && (
        <View style={styles.section}>
          <Text style={[styles.applyTitle, { color: colors.foreground }]}>Apply as Artist</Text>
          <Text style={[styles.applyDesc, { color: colors.mutedForeground }]}>
            GANA HUB selects artists for each festival, exhibition, and workshop. First register your profile, then apply for specific events.
          </Text>
          {[
            { icon: "user-plus", title: "Register Profile", desc: "Create your artist profile in the GANA database", action: () => router.push("/register-artist" as never) },
            { icon: "send", title: "Apply for Festival", desc: "Submit to GANA ArtFest 2025 — applications open", action: () => {} },
            { icon: "monitor", title: "Apply for Exhibition", desc: "Living Art AR Exhibition — apply now", action: () => {} },
            { icon: "book-open", title: "Lead a Workshop", desc: "Share your expertise with emerging African artists", action: () => {} },
          ].map((item) => (
            <Pressable
              key={item.title}
              onPress={item.action}
              style={[styles.applyCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
            >
              <View style={[styles.applyIcon, { backgroundColor: `${colors.gold}20` }]}>
                <Feather name={item.icon as never} size={20} color={colors.gold} />
              </View>
              <View style={styles.applyInfo}>
                <Text style={[styles.applyCardTitle, { color: colors.foreground }]}>{item.title}</Text>
                <Text style={[styles.applyCardDesc, { color: colors.mutedForeground }]}>{item.desc}</Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  hero: { height: 500, justifyContent: "space-between" },
  heroNav: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 12 },
  heroNavTitle: { fontFamily: "Inter_700Bold", fontSize: 16, letterSpacing: 2 },
  heroContent: { padding: 24, gap: 12 },
  heroBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  heroBadgeText: { fontFamily: "Inter_700Bold", fontSize: 9, letterSpacing: 2 },
  heroTitle: { fontFamily: "Inter_700Bold", fontSize: 28, lineHeight: 34 },
  heroMeta: { gap: 6 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  metaText: { fontFamily: "Inter_400Regular", fontSize: 13 },
  tabs: { flexDirection: "row", borderBottomWidth: 1, marginHorizontal: 20 },
  tab: { flex: 1, paddingVertical: 14, alignItems: "center", position: "relative" },
  tabText: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  tabIndicator: { position: "absolute", bottom: 0, left: "25%", right: "25%", height: 2, borderRadius: 1 },
  section: { paddingHorizontal: 20, paddingTop: 20, gap: 12 },
  sectionDesc: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 21, marginBottom: 4 },
  eventRow: { flexDirection: "row", borderWidth: 1, overflow: "hidden", alignItems: "center" },
  eventThumb: { width: 80, height: 80, backgroundColor: "#1A1A1A" },
  eventInfo: { flex: 1, padding: 12, gap: 4 },
  eventType: { alignSelf: "flex-start", paddingHorizontal: 7, paddingVertical: 2, borderRadius: 3 },
  eventTypeText: { fontFamily: "Inter_700Bold", fontSize: 8, letterSpacing: 1.5 },
  eventTitle: { fontFamily: "Inter_600SemiBold", fontSize: 13, lineHeight: 18 },
  eventDate: { fontFamily: "Inter_400Regular", fontSize: 11 },
  eventPrice: { fontFamily: "Inter_700Bold", fontSize: 13 },
  spotsTag: { padding: 10, alignItems: "center" },
  spotsText: { fontFamily: "Inter_700Bold", fontSize: 16 },
  spotsLabel: { fontFamily: "Inter_400Regular", fontSize: 9 },
  workshopCard: { borderWidth: 1, overflow: "hidden" },
  workshopImage: { width: "100%", height: 160, backgroundColor: "#1A1A1A" },
  workshopContent: { padding: 16, gap: 10 },
  workshopTitle: { fontFamily: "Inter_700Bold", fontSize: 16 },
  workshopDesc: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 19 },
  workshopMeta: { flexDirection: "row", justifyContent: "space-between" },
  workshopPrice: { fontFamily: "Inter_700Bold", fontSize: 16 },
  workshopDate: { fontFamily: "Inter_400Regular", fontSize: 13 },
  applyTitle: { fontFamily: "Inter_700Bold", fontSize: 22, marginBottom: 4 },
  applyDesc: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 21, marginBottom: 8 },
  applyCard: { flexDirection: "row", alignItems: "center", padding: 14, borderWidth: 1, gap: 12 },
  applyIcon: { width: 44, height: 44, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  applyInfo: { flex: 1 },
  applyCardTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  applyCardDesc: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
});
