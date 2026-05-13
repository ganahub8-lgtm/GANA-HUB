import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { ArtworkCard } from "@/components/ArtworkCard";
import { GoldButton } from "@/components/GoldButton";
import { SAMPLE_ARTISTS, SAMPLE_ARTWORKS } from "@/constants/sampleData";
import { getArtistImage } from "@/constants/artistImages";
import { useColors } from "@/hooks/useColors";

export default function ArtistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [following, setFollowing] = useState(false);

  const artist = SAMPLE_ARTISTS.find((a) => a.id === id);
  const artworks = SAMPLE_ARTWORKS.filter((w) => w.artistId === id);

  if (!artist) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFound, { color: colors.mutedForeground }]}>Artist not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero */}
        <View style={styles.hero}>
          <Image source={getArtistImage(artist.id)} style={styles.heroImage} contentFit="cover" />
          <LinearGradient
            colors={["transparent", "rgba(10,10,10,0.9)", colors.background]}
            style={StyleSheet.absoluteFill}
            locations={[0.3, 0.7, 1]}
          />
          {/* Back */}
          <Pressable
            onPress={() => router.back()}
            style={[
              styles.backBtn,
              { top: Platform.OS === "web" ? 67 : insets.top + 8, backgroundColor: "rgba(0,0,0,0.5)" },
            ]}
          >
            <Feather name="arrow-left" size={20} color="#fff" />
          </Pressable>

          {/* Profile Info */}
          <View style={styles.profileInfo}>
            {artist.featured && (
              <View style={[styles.featuredBadge, { backgroundColor: colors.gold }]}>
                <Text style={[styles.featuredText, { color: colors.primaryForeground }]}>
                  FEATURED ARTIST
                </Text>
              </View>
            )}
            <Text style={[styles.stageName, { color: colors.foreground }]}>{artist.stageName}</Text>
            <Text style={[styles.fullName, { color: colors.mutedForeground }]}>{artist.fullName}</Text>
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={13} color={colors.gold} />
              <Text style={[styles.location, { color: colors.mutedForeground }]}>
                {artist.city}, {artist.country}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={[styles.statsBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { label: "Works", val: String(artist.artworkCount) },
            { label: "Followers", val: artist.followerCount >= 1000 ? `${(artist.followerCount / 1000).toFixed(1)}K` : String(artist.followerCount) },
            { label: "Disciplines", val: String(artist.categories.length) },
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

        <View style={styles.content}>
          {/* Follow / Contact */}
          <View style={styles.actions}>
            <GoldButton
              label={following ? "Following" : "Follow"}
              onPress={() => setFollowing((v) => !v)}
              variant={following ? "outline" : "primary"}
              fullWidth
            />
            <Pressable
              style={[styles.whatsappBtn, { backgroundColor: "#25D366", borderRadius: colors.radius }]}
              onPress={() => {}}
            >
              <Feather name="message-circle" size={18} color="#fff" />
              <Text style={styles.whatsappText}>WhatsApp</Text>
            </Pressable>
          </View>

          {/* Bio */}
          <View>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>ABOUT</Text>
            <Text style={[styles.bio, { color: colors.foreground }]}>{artist.bio}</Text>
          </View>

          {/* Categories */}
          <View>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>DISCIPLINES</Text>
            <View style={styles.tags}>
              {artist.categories.map((cat) => (
                <View key={cat} style={[styles.tag, { backgroundColor: colors.muted, borderRadius: 4 }]}>
                  <Text style={[styles.tagText, { color: colors.foreground }]}>{cat}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Interests */}
          <View>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>OPEN TO</Text>
            <View style={styles.tags}>
              {artist.interests.map((interest) => (
                <View key={interest} style={[styles.interestTag, { borderColor: colors.gold + "60", borderRadius: 4 }]}>
                  <Text style={[styles.interestText, { color: colors.gold }]}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Social Links */}
          <View style={styles.socialRow}>
            {artist.socialLinks.instagram && (
              <Pressable style={[styles.socialBtn, { backgroundColor: colors.muted, borderRadius: 8 }]}>
                <Feather name="instagram" size={18} color={colors.foreground} />
              </Pressable>
            )}
            {artist.socialLinks.facebook && (
              <Pressable style={[styles.socialBtn, { backgroundColor: colors.muted, borderRadius: 8 }]}>
                <Feather name="facebook" size={18} color={colors.foreground} />
              </Pressable>
            )}
            {artist.website && (
              <Pressable style={[styles.socialBtn, { backgroundColor: colors.muted, borderRadius: 8 }]}>
                <Feather name="globe" size={18} color={colors.foreground} />
              </Pressable>
            )}
          </View>

          {/* Artworks */}
          {artworks.length > 0 && (
            <View>
              <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
                ARTWORKS ({artworks.length})
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {artworks.map((aw) => (
                  <ArtworkCard key={aw.id} artwork={aw} width={170} />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  notFound: { textAlign: "center", marginTop: 100, fontFamily: "Inter_400Regular", fontSize: 16 },
  hero: { height: 420, justifyContent: "flex-end" },
  heroImage: { width: "100%", height: 420, position: "absolute", backgroundColor: "#1A1A1A" },
  backBtn: {
    position: "absolute",
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: { padding: 20, gap: 6 },
  featuredBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  featuredText: { fontFamily: "Inter_700Bold", fontSize: 9, letterSpacing: 2 },
  stageName: { fontFamily: "Inter_700Bold", fontSize: 32 },
  fullName: { fontFamily: "Inter_400Regular", fontSize: 14 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  location: { fontFamily: "Inter_400Regular", fontSize: 13 },
  statsBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: -20,
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  stat: { alignItems: "center", gap: 3 },
  statVal: { fontFamily: "Inter_700Bold", fontSize: 22 },
  statLabel: { fontFamily: "Inter_400Regular", fontSize: 11 },
  statDivider: { width: 1, height: 32 },
  content: { padding: 20, gap: 24 },
  actions: { flexDirection: "row", gap: 12 },
  whatsappBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  whatsappText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 13 },
  sectionLabel: { fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 2, marginBottom: 10 },
  bio: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 22 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { paddingHorizontal: 12, paddingVertical: 5 },
  tagText: { fontFamily: "Inter_500Medium", fontSize: 12 },
  interestTag: { paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1 },
  interestText: { fontFamily: "Inter_500Medium", fontSize: 12 },
  socialRow: { flexDirection: "row", gap: 10 },
  socialBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
});
