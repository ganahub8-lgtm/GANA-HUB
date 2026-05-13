import { Feather } from "@expo/vector-icons";
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
          <View>
            <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>GANA</Text>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>Gallery</Text>
          </View>
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
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  headerSub: { fontFamily: "Inter_500Medium", fontSize: 10, letterSpacing: 3 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 28 },
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
});
