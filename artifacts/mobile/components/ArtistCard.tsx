import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { Artist } from "@/constants/sampleData";

interface ArtistCardProps {
  artist: Artist;
  compact?: boolean;
}

export function ArtistCard({ artist, compact = false }: ArtistCardProps) {
  const colors = useColors();
  const router = useRouter();

  if (compact) {
    return (
      <Pressable
        onPress={() => router.push(`/artist/${artist.id}` as never)}
        style={[styles.compactCard, { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border }]}
      >
        <Image
          source={{ uri: artist.profileImage }}
          style={[styles.compactImage, { borderRadius: 40, borderColor: colors.gold }]}
          contentFit="cover"
        />
        {artist.featured && (
          <View style={[styles.featuredDot, { backgroundColor: colors.gold }]} />
        )}
        <Text style={[styles.compactName, { color: colors.foreground }]} numberOfLines={1}>
          {artist.stageName}
        </Text>
        <Text style={[styles.compactCountry, { color: colors.mutedForeground }]} numberOfLines={1}>
          {artist.city}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => router.push(`/artist/${artist.id}` as never)}
      style={[
        styles.card,
        { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border },
      ]}
    >
      <View style={styles.header}>
        <Image
          source={{ uri: artist.profileImage }}
          style={[styles.avatar, { borderColor: artist.featured ? colors.gold : colors.border }]}
          contentFit="cover"
        />
        <View style={styles.meta}>
          <View style={styles.nameRow}>
            <Text style={[styles.stageName, { color: colors.foreground }]}>{artist.stageName}</Text>
            {artist.featured && (
              <View style={[styles.featuredBadge, { backgroundColor: colors.gold }]}>
                <Text style={[styles.featuredText, { color: colors.primaryForeground }]}>Featured</Text>
              </View>
            )}
          </View>
          <Text style={[styles.location, { color: colors.mutedForeground }]}>
            {artist.city}, {artist.country}
          </Text>
          <View style={styles.categories}>
            {artist.categories.slice(0, 2).map((cat) => (
              <View key={cat} style={[styles.tag, { backgroundColor: colors.muted }]}>
                <Text style={[styles.tagText, { color: colors.mutedForeground }]}>{cat}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      <Text style={[styles.bio, { color: colors.mutedForeground }]} numberOfLines={2}>
        {artist.bio}
      </Text>
      <View style={[styles.stats, { borderTopColor: colors.border }]}>
        <View style={styles.stat}>
          <Text style={[styles.statVal, { color: colors.gold }]}>{artist.artworkCount}</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Works</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.stat}>
          <Text style={[styles.statVal, { color: colors.gold }]}>
            {artist.followerCount >= 1000
              ? `${(artist.followerCount / 1000).toFixed(1)}K`
              : artist.followerCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Followers</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.stat}>
          <Text style={[styles.statVal, { color: colors.gold }]}>{artist.categories.length}</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Disciplines</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    backgroundColor: "#1A1A1A",
  },
  meta: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stageName: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  featuredBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  featuredText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    letterSpacing: 0.5,
  },
  location: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  categories: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  tagText: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
  },
  bio: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  stats: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 12,
    justifyContent: "space-around",
  },
  stat: {
    alignItems: "center",
    gap: 2,
  },
  statVal: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  statLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    height: 30,
  },
  // Compact styles
  compactCard: {
    width: 90,
    alignItems: "center",
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    position: "relative",
  },
  compactImage: {
    width: 56,
    height: 56,
    borderWidth: 1.5,
    backgroundColor: "#1A1A1A",
    marginBottom: 6,
  },
  featuredDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  compactName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    textAlign: "center",
  },
  compactCountry: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    textAlign: "center",
    marginTop: 2,
  },
});
