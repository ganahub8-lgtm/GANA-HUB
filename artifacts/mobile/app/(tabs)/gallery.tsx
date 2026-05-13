import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArtworkCard } from "@/components/ArtworkCard";
import { ARTWORK_CATEGORIES, SAMPLE_ARTWORKS } from "@/constants/sampleData";
import { useColors } from "@/hooks/useColors";

export default function GalleryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = SAMPLE_ARTWORKS.filter((a) => {
    const matchCat = selectedCategory === "All" || a.category === selectedCategory;
    const matchSearch =
      search === "" ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.artistName.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View style={styles.headerRow}>
          <Image
            source={require("@/assets/images/logo-gana-gallery.jpg")}
            style={styles.galleryLogo}
            contentFit="contain"
          />
          <Pressable
            onPress={() => setViewMode((m) => (m === "grid" ? "list" : "grid"))}
            style={[styles.viewToggle, { backgroundColor: colors.muted, borderRadius: 8 }]}
          >
            <Feather
              name={viewMode === "grid" ? "list" : "grid"}
              size={18}
              color={colors.foreground}
            />
          </Pressable>
        </View>

        {/* Search */}
        <View style={[styles.searchBox, { backgroundColor: colors.muted, borderRadius: colors.radius }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search artworks, artists..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {ARTWORK_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.catChip,
                  {
                    backgroundColor: active ? colors.gold : colors.muted,
                    borderRadius: 20,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.catText,
                    { color: active ? colors.primaryForeground : colors.mutedForeground },
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Living Gallery Banner */}
      <Pressable
        onPress={() => router.push("/living-gallery" as never)}
        style={styles.livingBanner}
      >
        <LinearGradient
          colors={["#1a1200", "#2a1e00", "#1a1200"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.livingBannerGradient}
        >
          <View style={styles.livingBannerLeft}>
            <View style={styles.livingDot} />
            <Text style={styles.livingBannerLabel}>LIVING GALLERY</Text>
          </View>
          <Text style={styles.livingBannerSub}>Paintings come alive</Text>
          <Feather name="chevron-right" size={16} color="#D4AF37" />
        </LinearGradient>
      </Pressable>

      {/* Results Count */}
      <View style={styles.countRow}>
        <Text style={[styles.countText, { color: colors.mutedForeground }]}>
          {filtered.length} work{filtered.length !== 1 ? "s" : ""} found
        </Text>
      </View>

      {/* Artworks Grid / List */}
      {viewMode === "grid" ? (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ArtworkCard artwork={item} width={170} />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="image" size={40} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No artworks found
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ArtworkCard artwork={item} horizontal />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="image" size={40} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No artworks found
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12, gap: 12 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  galleryLogo: { width: 180, height: 56 },
  viewToggle: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 44,
    gap: 10,
  },
  searchInput: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 14 },
  categories: { paddingRight: 8, gap: 8 },
  catChip: { paddingHorizontal: 16, paddingVertical: 7 },
  catText: { fontFamily: "Inter_500Medium", fontSize: 12 },
  countRow: { paddingHorizontal: 20, paddingVertical: 8 },
  countText: { fontFamily: "Inter_400Regular", fontSize: 12 },
  grid: { paddingHorizontal: 20, paddingBottom: 120, paddingTop: 4 },
  row: { justifyContent: "space-between", marginBottom: 16 },
  empty: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontFamily: "Inter_400Regular", fontSize: 14 },
  livingBanner: { marginHorizontal: 20, marginBottom: 8, borderRadius: 10, overflow: "hidden", borderWidth: 1, borderColor: "#D4AF3740" },
  livingBannerGradient: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 11, gap: 10 },
  livingBannerLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  livingDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#D4AF37" },
  livingBannerLabel: { fontFamily: "Inter_700Bold", fontSize: 11, color: "#D4AF37", letterSpacing: 2 },
  livingBannerSub: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 12, color: "rgba(255,255,255,0.55)", textAlign: "right", marginRight: 4 },
});
