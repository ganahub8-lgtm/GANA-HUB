import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArtistCard } from "@/components/ArtistCard";
import { ArtworkCard } from "@/components/ArtworkCard";
import { EventCard } from "@/components/EventCard";
import { SectionHeader } from "@/components/SectionHeader";
import {
  SAMPLE_ARTISTS,
  SAMPLE_ARTWORKS,
  SAMPLE_EVENTS,
} from "@/constants/sampleData";
import { useColors } from "@/hooks/useColors";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const featuredArtists = SAMPLE_ARTISTS.filter((a) => a.featured);
  const featuredArtworks = SAMPLE_ARTWORKS.slice(0, 6);

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section */}
      <View style={[styles.hero, { paddingTop: topPad + 16 }]}>
        <Image
          source={require("@/assets/images/hero_gallery.png")}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
        <LinearGradient
          colors={["rgba(10,10,10,0.2)", "rgba(10,10,10,0.7)", colors.background]}
          style={StyleSheet.absoluteFill}
          locations={[0, 0.6, 1]}
        />
        <View style={styles.heroContent}>
          {/* Nav */}
          <View style={styles.heroNav}>
            <View>
              <Text style={styles.logoSub}>WELCOME TO</Text>
              <Text style={[styles.logoTitle, { color: colors.gold }]}>GANA HUB</Text>
            </View>
            <View style={styles.navRight}>
              <Pressable onPress={() => router.push("/register-artist" as never)} style={styles.navBtn}>
                <Feather name="user-plus" size={20} color={colors.foreground} />
              </Pressable>
              <Pressable onPress={() => router.push("/admin" as never)} style={styles.navBtn}>
                <Feather name="settings" size={20} color={colors.foreground} />
              </Pressable>
            </View>
          </View>

          {/* Tagline */}
          <View style={styles.heroText}>
            <Text style={[styles.heroTitle, { color: colors.foreground }]}>
              African Creative{"\n"}Ecosystem
            </Text>
            <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>
              Discover art. Support African artists.{"\n"}Experience culture in a new dimension.
            </Text>
            <View style={styles.heroCtas}>
              <Pressable
                style={[styles.ctaPrimary, { backgroundColor: colors.gold, borderRadius: colors.radius }]}
                onPress={() => router.push("/(tabs)/gallery" as never)}
              >
                <Text style={[styles.ctaPrimaryText, { color: colors.primaryForeground }]}>
                  Explore Gallery
                </Text>
              </Pressable>
              <Pressable
                style={[styles.ctaSecondary, { borderColor: colors.gold, borderRadius: colors.radius }]}
                onPress={() => router.push("/register-artist" as never)}
              >
                <Text style={[styles.ctaSecondaryText, { color: colors.gold }]}>Join as Artist</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* Stats Bar */}
      <View style={[styles.statsBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {[
          { label: "Artists", val: "200+" },
          { label: "Artworks", val: "1.2K" },
          { label: "Countries", val: "12" },
          { label: "Collectors", val: "3.4K" },
        ].map((s, i, arr) => (
          <React.Fragment key={s.label}>
            <View style={styles.stat}>
              <Text style={[styles.statVal, { color: colors.gold }]}>{s.val}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
            {i < arr.length - 1 && <View style={[styles.statDivider, { backgroundColor: colors.border }]} />}
          </React.Fragment>
        ))}
      </View>

      {/* Featured Artists */}
      <View style={{ marginTop: 32 }}>
        <SectionHeader
          title="Featured Artists"
          subtitle="Pan-African creative voices"
          seeAllRoute="/(tabs)/artists"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}
        >
          {featuredArtists.map((a) => (
            <ArtistCard key={a.id} artist={a} compact />
          ))}
        </ScrollView>
      </View>

      {/* Featured Artworks */}
      <View style={{ marginTop: 32 }}>
        <SectionHeader
          title="New Arrivals"
          subtitle="Original works available now"
          seeAllRoute="/(tabs)/gallery"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}
        >
          {featuredArtworks.map((aw) => (
            <ArtworkCard key={aw.id} artwork={aw} width={180} />
          ))}
        </ScrollView>
      </View>

      {/* Upcoming Events */}
      <View style={{ marginTop: 32 }}>
        <SectionHeader
          title="Events & Festivals"
          subtitle="Experiences worth attending"
          seeAllRoute="/festival"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}
        >
          {SAMPLE_EVENTS.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </ScrollView>
      </View>

      {/* GANA Platforms */}
      <View style={{ marginTop: 32, paddingHorizontal: 20 }}>
        <SectionHeader title="GANA Platforms" />
        <View style={styles.platformsGrid}>
          {[
            { icon: "image", label: "GANA Gallery", route: "/(tabs)/gallery", desc: "Marketplace" },
            { icon: "camera", label: "Living Art", route: "/living-art", desc: "WebAR" },
            { icon: "box", label: "Virtual Gallery", route: "/(tabs)/gallery", desc: "Immersive" },
            { icon: "music", label: "Media Player", route: "/(tabs)/media", desc: "Stories" },
            { icon: "calendar", label: "Festival Hub", route: "/festival", desc: "Events" },
            { icon: "cpu", label: "AI Features", route: "/(tabs)/more", desc: "Coming Soon" },
          ].map((p) => (
            <Pressable
              key={p.label}
              onPress={() => router.push(p.route as never)}
              style={[
                styles.platformCard,
                { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
              ]}
            >
              <View style={[styles.platformIcon, { backgroundColor: colors.muted, borderRadius: 12 }]}>
                <Feather name={p.icon as never} size={22} color={colors.gold} />
              </View>
              <Text style={[styles.platformLabel, { color: colors.foreground }]}>{p.label}</Text>
              <Text style={[styles.platformDesc, { color: colors.mutedForeground }]}>{p.desc}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  hero: { height: 600, justifyContent: "flex-end" },
  heroContent: { flex: 1, justifyContent: "space-between" },
  heroNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  logoSub: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    color: "#aaa",
    letterSpacing: 3,
  },
  logoTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    letterSpacing: 4,
  },
  navRight: { flexDirection: "row", gap: 16, paddingTop: 4 },
  navBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  heroText: { padding: 24, gap: 12 },
  heroTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 38,
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  heroSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 21,
  },
  heroCtas: { flexDirection: "row", gap: 12, marginTop: 8 },
  ctaPrimary: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    alignItems: "center",
  },
  ctaPrimaryText: { fontFamily: "Inter_700Bold", fontSize: 14, letterSpacing: 0.5 },
  ctaSecondary: {
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderWidth: 1.5,
    alignItems: "center",
  },
  ctaSecondaryText: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  statsBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginTop: -20,
  },
  stat: { alignItems: "center", gap: 2 },
  statVal: { fontFamily: "Inter_700Bold", fontSize: 20 },
  statLabel: { fontFamily: "Inter_400Regular", fontSize: 11, letterSpacing: 0.5 },
  statDivider: { width: 1, height: 32 },
  platformsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 0,
    paddingHorizontal: 0,
  },
  platformCard: {
    width: "30%",
    flexGrow: 1,
    padding: 14,
    borderWidth: 1,
    alignItems: "center",
    gap: 6,
  },
  platformIcon: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  platformLabel: { fontFamily: "Inter_600SemiBold", fontSize: 12, textAlign: "center" },
  platformDesc: { fontFamily: "Inter_400Regular", fontSize: 10, textAlign: "center" },
});
