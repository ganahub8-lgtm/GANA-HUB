import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SAMPLE_MEDIA } from "@/constants/sampleData";
import { useColors } from "@/hooks/useColors";
import { usePlayer } from "@/context/PlayerContext";

const MEDIA_CATEGORIES = ["All", "Artist Story", "Exhibition", "Panel", "Festival"];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function VinylSpinner({ isPlaying, coverUrl }: { isPlaying: boolean; coverUrl: string }) {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    if (isPlaying) {
      rotation.value = withRepeat(withTiming(360, { duration: 4000 }), -1, false);
    } else {
      rotation.value = rotation.value;
    }
  }, [isPlaying]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.vinyl, animStyle]}>
      <Image source={{ uri: coverUrl }} style={styles.vinylImage} contentFit="cover" />
      <View style={styles.vinylHole} />
    </Animated.View>
  );
}

export default function MediaScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { currentTrack, isPlaying, progress, duration, play, togglePlay, next, previous, setQueue } = usePlayer();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = SAMPLE_MEDIA.filter(
    (m) => selectedCategory === "All" || m.category === selectedCategory
  );

  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;

  const handlePlay = (track: typeof SAMPLE_MEDIA[0]) => {
    setQueue(filtered);
    play(track);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: topPad + 8 }]}>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>GANA</Text>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Media</Text>
        </View>

        {/* Now Playing Card */}
        {currentTrack ? (
          <View style={[styles.nowPlaying, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <VinylSpinner isPlaying={isPlaying} coverUrl={currentTrack.coverImage} />

            <View style={styles.npMeta}>
              <View style={[styles.liveTag, { backgroundColor: isPlaying ? "#22C55E22" : colors.muted }]}>
                {isPlaying && <View style={[styles.liveDot, { backgroundColor: colors.success }]} />}
                <Text style={[styles.liveTagText, { color: isPlaying ? colors.success : colors.mutedForeground }]}>
                  {isPlaying ? "NOW PLAYING" : "PAUSED"}
                </Text>
              </View>
              <Text style={[styles.npTitle, { color: colors.foreground }]} numberOfLines={2}>
                {currentTrack.title}
              </Text>
              <Text style={[styles.npArtist, { color: colors.mutedForeground }]}>{currentTrack.artist}</Text>

              {/* Progress */}
              <View style={styles.progressRow}>
                <Text style={[styles.progressTime, { color: colors.mutedForeground }]}>
                  {formatTime(progress)}
                </Text>
                <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                  <View
                    style={[
                      styles.progressFill,
                      { backgroundColor: colors.gold, width: `${progressPct}%` as never },
                    ]}
                  />
                </View>
                <Text style={[styles.progressTime, { color: colors.mutedForeground }]}>
                  {currentTrack.duration}
                </Text>
              </View>

              {/* Controls */}
              <View style={styles.controls}>
                <Pressable onPress={previous} style={styles.controlBtn}>
                  <Feather name="skip-back" size={22} color={colors.mutedForeground} />
                </Pressable>
                <Pressable
                  onPress={togglePlay}
                  style={[styles.playBtn, { backgroundColor: colors.gold, borderRadius: 32 }]}
                >
                  <Feather name={isPlaying ? "pause" : "play"} size={26} color={colors.primaryForeground} />
                </Pressable>
                <Pressable onPress={next} style={styles.controlBtn}>
                  <Feather name="skip-forward" size={22} color={colors.mutedForeground} />
                </Pressable>
              </View>
            </View>
          </View>
        ) : (
          <View style={[styles.emptyPlayer, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <Feather name="music" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyPlayerText, { color: colors.mutedForeground }]}>
              Select a track below to play
            </Text>
          </View>
        )}

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
          style={{ marginTop: 24 }}
        >
          {MEDIA_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.chip,
                  { backgroundColor: active ? colors.gold : colors.muted, borderRadius: 20 },
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

        {/* Track List */}
        <View style={styles.trackList}>
          {filtered.map((track) => {
            const isActive = currentTrack?.id === track.id;
            return (
              <Pressable
                key={track.id}
                onPress={() => handlePlay(track)}
                style={[
                  styles.trackRow,
                  {
                    backgroundColor: isActive ? colors.muted : "transparent",
                    borderRadius: colors.radius,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <Image source={{ uri: track.coverImage }} style={styles.trackCover} contentFit="cover" />
                <View style={styles.trackInfo}>
                  <Text style={[styles.trackTitle, { color: isActive ? colors.gold : colors.foreground }]} numberOfLines={1}>
                    {track.title}
                  </Text>
                  <Text style={[styles.trackArtist, { color: colors.mutedForeground }]} numberOfLines={1}>
                    {track.artist}
                  </Text>
                  <View style={styles.trackMeta}>
                    <View style={[styles.typeTag, { backgroundColor: colors.muted }]}>
                      <Feather
                        name={track.type === "audio" ? "headphones" : "video"}
                        size={10}
                        color={colors.mutedForeground}
                      />
                      <Text style={[styles.typeText, { color: colors.mutedForeground }]}>
                        {track.type}
                      </Text>
                    </View>
                    <Text style={[styles.trackDuration, { color: colors.mutedForeground }]}>
                      {track.duration}
                    </Text>
                  </View>
                </View>
                {isActive && isPlaying ? (
                  <Pressable onPress={togglePlay}>
                    <Feather name="pause-circle" size={28} color={colors.gold} />
                  </Pressable>
                ) : (
                  <Feather name="play-circle" size={28} color={isActive ? colors.gold : colors.mutedForeground} />
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerSub: { fontFamily: "Inter_500Medium", fontSize: 10, letterSpacing: 3 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 28 },
  nowPlaying: {
    marginHorizontal: 20,
    padding: 20,
    borderWidth: 1,
    flexDirection: "row",
    gap: 16,
    alignItems: "flex-start",
  },
  vinyl: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  vinylImage: { width: 100, height: 100, position: "absolute" },
  vinylHole: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#0A0A0A",
    borderWidth: 2,
    borderColor: "#333",
  },
  npMeta: { flex: 1, gap: 8 },
  liveTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  liveTagText: { fontFamily: "Inter_700Bold", fontSize: 9, letterSpacing: 1.5 },
  npTitle: { fontFamily: "Inter_700Bold", fontSize: 15, lineHeight: 20 },
  npArtist: { fontFamily: "Inter_400Regular", fontSize: 12 },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  progressTime: { fontFamily: "Inter_400Regular", fontSize: 10, width: 30 },
  progressTrack: { flex: 1, height: 3, borderRadius: 2 },
  progressFill: { height: 3, borderRadius: 2 },
  controls: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 4 },
  playBtn: { width: 52, height: 52, alignItems: "center", justifyContent: "center" },
  controlBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  emptyPlayer: {
    marginHorizontal: 20,
    padding: 32,
    borderWidth: 1,
    alignItems: "center",
    gap: 12,
  },
  emptyPlayerText: { fontFamily: "Inter_400Regular", fontSize: 14, textAlign: "center" },
  categories: { paddingHorizontal: 20, paddingRight: 8, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 6 },
  chipText: { fontFamily: "Inter_500Medium", fontSize: 12 },
  trackList: { paddingHorizontal: 20, marginTop: 16, gap: 4 },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 12,
    borderBottomWidth: 0,
  },
  trackCover: { width: 54, height: 54, borderRadius: 8, backgroundColor: "#1A1A1A" },
  trackInfo: { flex: 1, gap: 3 },
  trackTitle: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  trackArtist: { fontFamily: "Inter_400Regular", fontSize: 11 },
  trackMeta: { flexDirection: "row", gap: 8, alignItems: "center" },
  typeTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: { fontFamily: "Inter_400Regular", fontSize: 9, letterSpacing: 0.5 },
  trackDuration: { fontFamily: "Inter_400Regular", fontSize: 10 },
});
