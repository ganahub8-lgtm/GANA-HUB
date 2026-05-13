import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
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
import { GoldButton } from "@/components/GoldButton";
import { SAMPLE_ARTWORKS, SAMPLE_ARTISTS, formatUGX } from "@/constants/sampleData";
import { getArtworkImage } from "@/constants/artworkImages";
import { useColors } from "@/hooks/useColors";

export default function ArtworkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [liked, setLiked] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const artwork = SAMPLE_ARTWORKS.find((a) => a.id === id);
  const artist = artwork ? SAMPLE_ARTISTS.find((a) => a.id === artwork.artistId) : null;

  if (!artwork) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFound, { color: colors.mutedForeground }]}>Artwork not found</Text>
      </View>
    );
  }

  const handleLike = () => {
    setLiked((v) => !v);
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleBuy = () => {
    router.push({
      pathname: "/checkout",
      params: {
        artworkId: artwork.id,
        title: artwork.title,
        amount: artwork.price,
        currency: artwork.currency,
        artistName: artwork.artistName,
      },
    } as never);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={getArtworkImage(artwork.id)}
            style={styles.image}
            contentFit="cover"
          />
          {/* Nav overlay */}
          <View style={[styles.navOverlay, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 8 }]}>
            <Pressable
              onPress={() => router.back()}
              style={[styles.navBtn, { backgroundColor: "rgba(0,0,0,0.5)" }]}
            >
              <Feather name="arrow-left" size={20} color="#fff" />
            </Pressable>
            <View style={styles.navRight}>
              <Pressable
                onPress={handleLike}
                style={[styles.navBtn, { backgroundColor: "rgba(0,0,0,0.5)" }]}
              >
                <Feather name="heart" size={18} color={liked ? colors.gold : "#fff"} />
              </Pressable>
              <Pressable style={[styles.navBtn, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
                <Feather name="share-2" size={18} color="#fff" />
              </Pressable>
            </View>
          </View>
          {artwork.sold && (
            <View style={[styles.soldBanner, { backgroundColor: colors.background }]}>
              <Text style={[styles.soldBannerText, { color: colors.mutedForeground }]}>SOLD</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title + Price */}
          <View style={styles.titleRow}>
            <View style={styles.titleCol}>
              <Text style={[styles.title, { color: colors.foreground }]}>{artwork.title}</Text>
              <Text style={[styles.category, { color: colors.mutedForeground }]}>
                {artwork.category} • {artwork.year}
              </Text>
            </View>
            <Text style={[styles.price, { color: colors.gold }]}>{formatUGX(artwork.price)}</Text>
          </View>

          {/* Artist */}
          {artist && (
            <Pressable
              onPress={() => router.push(`/artist/${artist.id}` as never)}
              style={[styles.artistRow, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: 10 }]}
            >
              <Image source={{ uri: artist.profileImage }} style={styles.artistAvatar} contentFit="cover" />
              <View style={styles.artistInfo}>
                <Text style={[styles.artistName, { color: colors.foreground }]}>{artist.stageName}</Text>
                <Text style={[styles.artistLoc, { color: colors.mutedForeground }]}>
                  {artist.city}, {artist.country}
                </Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}

          {/* Details */}
          <View style={[styles.detailsCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: 10 }]}>
            {[
              { label: "Medium", val: artwork.category },
              { label: "Dimensions", val: artwork.dimensions },
              { label: "Year", val: String(artwork.year) },
            ].map((d) => (
              <View key={d.label} style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>{d.label}</Text>
                <Text style={[styles.detailVal, { color: colors.foreground }]}>{d.val}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <View>
            <Text style={[styles.descLabel, { color: colors.mutedForeground }]}>ABOUT THIS WORK</Text>
            <Text
              style={[styles.desc, { color: colors.foreground }]}
              numberOfLines={showFullDesc ? undefined : 4}
            >
              {artwork.description}
            </Text>
            <Pressable onPress={() => setShowFullDesc((v) => !v)}>
              <Text style={[styles.readMore, { color: colors.gold }]}>
                {showFullDesc ? "Show less" : "Read more"}
              </Text>
            </Pressable>
          </View>

          {/* Tags */}
          <View style={styles.tags}>
            {artwork.tags.map((tag) => (
              <View key={tag} style={[styles.tag, { backgroundColor: colors.muted, borderRadius: 4 }]}>
                <Text style={[styles.tagText, { color: colors.mutedForeground }]}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Buy Button */}
      {!artwork.sold && (
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
          <View style={styles.footerContent}>
            <View>
              <Text style={[styles.footerPriceLabel, { color: colors.mutedForeground }]}>Price</Text>
              <Text style={[styles.footerPrice, { color: colors.gold }]}>{formatUGX(artwork.price)}</Text>
            </View>
            <GoldButton label="Buy Now — Mobile Money" onPress={handleBuy} size="lg" />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  notFound: { textAlign: "center", marginTop: 100, fontFamily: "Inter_400Regular", fontSize: 16 },
  imageWrapper: { position: "relative" },
  image: { width: "100%", height: 400, backgroundColor: "#1A1A1A" },
  navOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  navBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  navRight: { flexDirection: "row", gap: 8 },
  soldBanner: {
    position: "absolute",
    top: 16,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  soldBannerText: { fontFamily: "Inter_700Bold", fontSize: 11, letterSpacing: 2 },
  content: { padding: 20, gap: 20 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  titleCol: { flex: 1, paddingRight: 12 },
  title: { fontFamily: "Inter_700Bold", fontSize: 22, lineHeight: 28 },
  category: { fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 4 },
  price: { fontFamily: "Inter_700Bold", fontSize: 22 },
  artistRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    gap: 12,
  },
  artistAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#1A1A1A" },
  artistInfo: { flex: 1 },
  artistName: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  artistLoc: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
  detailsCard: { borderWidth: 1, overflow: "hidden" },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
  },
  detailLabel: { fontFamily: "Inter_400Regular", fontSize: 13 },
  detailVal: { fontFamily: "Inter_500Medium", fontSize: 13 },
  descLabel: { fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  desc: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 22 },
  readMore: { fontFamily: "Inter_500Medium", fontSize: 13, marginTop: 8 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontFamily: "Inter_400Regular", fontSize: 11 },
  footer: {
    borderTopWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  footerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footerPriceLabel: { fontFamily: "Inter_400Regular", fontSize: 11 },
  footerPrice: { fontFamily: "Inter_700Bold", fontSize: 20 },
});
