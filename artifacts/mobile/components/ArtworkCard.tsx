import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { Artwork } from "@/constants/sampleData";
import { formatUGX } from "@/constants/sampleData";

interface ArtworkCardProps {
  artwork: Artwork;
  width?: number;
  horizontal?: boolean;
}

export function ArtworkCard({ artwork, width = 200, horizontal = false }: ArtworkCardProps) {
  const colors = useColors();
  const router = useRouter();
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked((v) => !v);
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (horizontal) {
    return (
      <Pressable
        onPress={() => router.push(`/artwork/${artwork.id}` as never)}
        style={[
          styles.hCard,
          { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
        ]}
      >
        <Image source={{ uri: artwork.imageUrl }} style={styles.hImage} contentFit="cover" />
        <View style={styles.hInfo}>
          <Text style={[styles.hTitle, { color: colors.foreground }]} numberOfLines={2}>
            {artwork.title}
          </Text>
          <Text style={[styles.hArtist, { color: colors.mutedForeground }]}>{artwork.artistName}</Text>
          <Text style={[styles.hPrice, { color: colors.gold }]}>{formatUGX(artwork.price)}</Text>
          {artwork.sold && (
            <View style={[styles.soldBadge, { backgroundColor: colors.muted }]}>
              <Text style={[styles.soldText, { color: colors.mutedForeground }]}>SOLD</Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => router.push(`/artwork/${artwork.id}` as never)}
      style={[styles.card, { width, backgroundColor: colors.card, borderRadius: colors.radius }]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: artwork.imageUrl }}
          style={[styles.image, { width, height: width * 1.1 }]}
          contentFit="cover"
        />
        {artwork.sold && (
          <View style={[styles.soldOverlay, { backgroundColor: colors.background }]}>
            <Text style={[styles.soldOverlayText, { color: colors.mutedForeground }]}>SOLD</Text>
          </View>
        )}
        <Pressable onPress={handleLike} style={styles.likeBtn}>
          <Feather name="heart" size={16} color={liked ? colors.gold : "#fff"} />
        </Pressable>
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
          {artwork.title}
        </Text>
        <Text style={[styles.artist, { color: colors.mutedForeground }]} numberOfLines={1}>
          {artwork.artistName}
        </Text>
        <Text style={[styles.price, { color: colors.gold }]}>{formatUGX(artwork.price)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    marginRight: 12,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    backgroundColor: "#1A1A1A",
  },
  soldOverlay: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    opacity: 0.9,
  },
  soldOverlayText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 1.5,
  },
  likeBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    padding: 10,
    gap: 3,
  },
  title: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  artist: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
  price: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    marginTop: 2,
  },
  // Horizontal styles
  hCard: {
    flexDirection: "row",
    borderWidth: 1,
    overflow: "hidden",
    marginHorizontal: 20,
    marginBottom: 12,
  },
  hImage: {
    width: 90,
    height: 90,
    backgroundColor: "#1A1A1A",
  },
  hInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
    gap: 4,
  },
  hTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    lineHeight: 18,
  },
  hArtist: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  hPrice: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    marginTop: 2,
  },
  soldBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  soldText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    letterSpacing: 1.5,
  },
});
