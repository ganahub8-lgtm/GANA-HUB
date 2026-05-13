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
import { ArtistCard } from "@/components/ArtistCard";
import { ARTIST_CATEGORIES, SAMPLE_ARTISTS } from "@/constants/sampleData";
import { useColors } from "@/hooks/useColors";
import { useRouter } from "expo-router";

const COUNTRIES = ["All", "Uganda", "Ghana", "Nigeria", "Kenya", "Senegal", "South Africa"];

export default function ArtistsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");

  const filtered = SAMPLE_ARTISTS.filter((a) => {
    const matchCat = selectedCategory === "All" || a.categories.includes(selectedCategory);
    const matchCountry = selectedCountry === "All" || a.country === selectedCountry;
    const matchSearch =
      search === "" ||
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.stageName.toLowerCase().includes(search.toLowerCase()) ||
      a.city.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchCountry && matchSearch;
  });

  const featured = filtered.filter((a) => a.featured);
  const rest = filtered.filter((a) => !a.featured);
  const ordered = [...featured, ...rest];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>CREATIVE</Text>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>Artists</Text>
          </View>
          <Pressable
            onPress={() => router.push("/register-artist" as never)}
            style={[styles.joinBtn, { backgroundColor: colors.gold, borderRadius: 20 }]}
          >
            <Feather name="user-plus" size={14} color={colors.primaryForeground} />
            <Text style={[styles.joinText, { color: colors.primaryForeground }]}>Join</Text>
          </Pressable>
        </View>

        {/* Search */}
        <View style={[styles.searchBox, { backgroundColor: colors.muted, borderRadius: colors.radius }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search artists, cities..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>

        {/* Country Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {COUNTRIES.map((c) => {
            const active = selectedCountry === c;
            return (
              <Pressable
                key={c}
                onPress={() => setSelectedCountry(c)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.accent : colors.muted,
                    borderRadius: 20,
                  },
                ]}
              >
                <Text style={[styles.chipText, { color: active ? "#fff" : colors.mutedForeground }]}>
                  {c}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {ARTIST_CATEGORIES.slice(0, 7).map((cat) => {
            const active = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.gold : colors.muted,
                    borderRadius: 20,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
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

      {/* Count */}
      <View style={styles.countRow}>
        <Text style={[styles.countText, { color: colors.mutedForeground }]}>
          {ordered.length} artist{ordered.length !== 1 ? "s" : ""} in the network
        </Text>
      </View>

      <FlatList
        data={ordered}
        keyExtractor={(a) => a.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ArtistCard artist={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="users" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No artists found
            </Text>
            <Pressable onPress={() => router.push("/register-artist" as never)}>
              <Text style={[styles.emptyAction, { color: colors.gold }]}>Be the first to join</Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 8, gap: 12 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  headerSub: { fontFamily: "Inter_500Medium", fontSize: 10, letterSpacing: 3 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 28 },
  joinBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16, paddingVertical: 9 },
  joinText: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 44,
    gap: 10,
  },
  searchInput: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 14 },
  filters: { paddingRight: 8, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 6 },
  chipText: { fontFamily: "Inter_500Medium", fontSize: 12 },
  countRow: { paddingHorizontal: 20, paddingVertical: 8 },
  countText: { fontFamily: "Inter_400Regular", fontSize: 12 },
  empty: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontFamily: "Inter_400Regular", fontSize: 14 },
  emptyAction: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
});
