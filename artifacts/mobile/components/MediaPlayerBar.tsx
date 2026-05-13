import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { usePlayer } from "@/context/PlayerContext";

export function MediaPlayerBar() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentTrack, isPlaying, progress, duration, togglePlay, next, stop } = usePlayer();

  if (!currentTrack) return null;

  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutDown.duration(200)}
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          bottom: Platform.OS === "web" ? 34 : insets.bottom + 60,
          marginHorizontal: 12,
          borderRadius: colors.radius,
        },
      ]}
    >
      <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.progressFill,
            { backgroundColor: colors.gold, width: `${progressPct}%` },
          ]}
        />
      </View>

      <Pressable
        style={styles.content}
        onPress={() => router.push("/(tabs)/media" as never)}
      >
        <Image
          source={{ uri: currentTrack.coverImage }}
          style={[styles.cover, { borderRadius: 6, backgroundColor: colors.muted }]}
          contentFit="cover"
        />
        <View style={styles.info}>
          <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={[styles.artist, { color: colors.mutedForeground }]} numberOfLines={1}>
            {currentTrack.artist}
          </Text>
        </View>

        <View style={styles.controls}>
          <Pressable onPress={togglePlay} style={styles.playBtn}>
            <Feather
              name={isPlaying ? "pause" : "play"}
              size={20}
              color={colors.foreground}
            />
          </Pressable>
          <Pressable onPress={next} style={styles.controlBtn}>
            <Feather name="skip-forward" size={18} color={colors.mutedForeground} />
          </Pressable>
          <Pressable onPress={stop} style={styles.controlBtn}>
            <Feather name="x" size={16} color={colors.mutedForeground} />
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 100,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  progressBar: {
    height: 2,
    width: "100%",
  },
  progressFill: {
    height: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  cover: {
    width: 44,
    height: 44,
  },
  info: {
    flex: 1,
  },
  title: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  artist: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    marginTop: 2,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  controlBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
