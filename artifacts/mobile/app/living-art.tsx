import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

function ScanRing({ delay }: { delay: number }) {
  const colors = useColors();
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    const t = setTimeout(() => {
      scale.value = withRepeat(withSequence(withTiming(1.8, { duration: 2000 }), withTiming(0.6, { duration: 0 })), -1);
      opacity.value = withRepeat(withSequence(withTiming(0.6, { duration: 200 }), withTiming(0, { duration: 1800 })), -1);
    }, delay);
    return () => clearTimeout(t);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        style,
        styles.ring,
        { borderColor: colors.gold },
      ]}
    />
  );
}

export default function LivingArtScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const [mode, setMode] = useState<"intro" | "scanning" | "detected">("intro");

  const handleScan = () => {
    setMode("scanning");
    // TODO: Initialize MindAR
    // import * as MindAR from "mind-ar";
    // const arController = new MindAR.ARController(...);
    // arController.start(videoRef.current);
    setTimeout(() => setMode("detected"), 4000);
  };

  return (
    <View style={[styles.screen, { backgroundColor: "#000" }]}>
      {/* Simulated camera view */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={["#0a0a14", "#0a140a", "#140a0a"]}
          style={StyleSheet.absoluteFill}
        />
        {/* Grid lines for AR feel */}
        {Array.from({ length: 6 }).map((_, i) => (
          <View
            key={`h${i}`}
            style={[styles.gridLine, { top: `${(i + 1) * 14}%`, backgroundColor: `${colors.gold}15` }]}
          />
        ))}
        {Array.from({ length: 4 }).map((_, i) => (
          <View
            key={`v${i}`}
            style={[styles.gridLineV, { left: `${(i + 1) * 20}%`, backgroundColor: `${colors.gold}15` }]}
          />
        ))}
      </View>

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.gold }]}>GANA Living Art</Text>
          <View style={[styles.betaBadge, { backgroundColor: `${colors.gold}30` }]}>
            <Text style={[styles.betaText, { color: colors.gold }]}>BETA</Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      {mode === "intro" && (
        <View style={styles.intro}>
          <View style={styles.scanFrame}>
            <ScanRing delay={0} />
            <ScanRing delay={700} />
            <ScanRing delay={1400} />
            <View style={[styles.scanIcon, { borderColor: colors.gold }]}>
              <Feather name="eye" size={36} color={colors.gold} />
            </View>
          </View>

          <View style={styles.introText}>
            <Text style={[styles.introTitle, { color: "#fff" }]}>Artworks Come Alive</Text>
            <Text style={[styles.introDesc, { color: "rgba(255,255,255,0.6)" }]}>
              Point your camera at a GANA artwork to unlock animated stories, artist interviews, hidden layers, and immersive audio experiences.
            </Text>
          </View>

          <View style={styles.features}>
            {[
              { icon: "play-circle", label: "Animated overlays" },
              { icon: "headphones", label: "Audio storytelling" },
              { icon: "layers", label: "Hidden art layers" },
              { icon: "user", label: "Artist interviews" },
            ].map((f) => (
              <View key={f.label} style={[styles.featureItem, { backgroundColor: "rgba(212,175,55,0.1)", borderColor: `${colors.gold}40` }]}>
                <Feather name={f.icon as never} size={16} color={colors.gold} />
                <Text style={[styles.featureText, { color: "rgba(255,255,255,0.8)" }]}>{f.label}</Text>
              </View>
            ))}
          </View>

          <Pressable
            onPress={handleScan}
            style={[styles.scanBtn, { backgroundColor: colors.gold, borderRadius: 50 }]}
          >
            <Feather name="camera" size={24} color={colors.primaryForeground} />
            <Text style={[styles.scanBtnText, { color: colors.primaryForeground }]}>Start Scanning</Text>
          </Pressable>

          <Text style={[styles.techNote, { color: "rgba(255,255,255,0.3)" }]}>
            Powered by MindAR · WebAR Architecture Ready
          </Text>
        </View>
      )}

      {mode === "scanning" && (
        <View style={styles.scanning}>
          <View style={styles.scanTarget}>
            {/* Corner brackets */}
            {["tl", "tr", "bl", "br"].map((pos) => (
              <View
                key={pos}
                style={[
                  styles.bracket,
                  { borderColor: colors.gold },
                  pos === "tl" && styles.bracketTL,
                  pos === "tr" && styles.bracketTR,
                  pos === "bl" && styles.bracketBL,
                  pos === "br" && styles.bracketBR,
                ]}
              />
            ))}
          </View>
          <Text style={[styles.scanningText, { color: "#fff" }]}>Scanning for GANA artwork...</Text>
          <Text style={[styles.scanningHint, { color: "rgba(255,255,255,0.5)" }]}>
            Hold steady · Ensure good lighting
          </Text>
        </View>
      )}

      {mode === "detected" && (
        <View style={[styles.detected, { backgroundColor: "rgba(10,10,10,0.9)" }]}>
          <View style={[styles.detectedBadge, { backgroundColor: `${colors.gold}20`, borderColor: colors.gold }]}>
            <Feather name="check-circle" size={24} color={colors.gold} />
            <Text style={[styles.detectedLabel, { color: colors.gold }]}>Artwork Detected</Text>
          </View>
          <Text style={[styles.detectedTitle, { color: "#fff" }]}>Nyange wa Kupenda</Text>
          <Text style={[styles.detectedArtist, { color: "rgba(255,255,255,0.6)" }]}>by AmaraNaki</Text>

          <View style={styles.arActions}>
            {[
              { icon: "play", label: "Play Story" },
              { icon: "headphones", label: "Audio" },
              { icon: "info", label: "Artwork Info" },
              { icon: "shopping-bag", label: "Buy" },
            ].map((action) => (
              <Pressable
                key={action.label}
                style={[styles.arAction, { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 12 }]}
                onPress={() => action.label === "Buy" && router.push("/artwork/w1" as never)}
              >
                <Feather name={action.icon as never} size={20} color={colors.gold} />
                <Text style={[styles.arActionLabel, { color: "#fff" }]}>{action.label}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable onPress={() => setMode("scanning")} style={styles.rescanBtn}>
            <Text style={[styles.rescanText, { color: "rgba(255,255,255,0.5)" }]}>Scan another artwork</Text>
          </Pressable>
        </View>
      )}

      <View style={[styles.bottomBar, { paddingBottom: bottomPad + 8 }]}>
        {mode !== "intro" && (
          <Pressable onPress={() => setMode("intro")} style={[styles.closeBtn, { backgroundColor: "rgba(0,0,0,0.5)", borderColor: "rgba(255,255,255,0.2)" }]}>
            <Feather name="x" size={20} color="#fff" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  gridLine: { position: "absolute", left: 0, right: 0, height: 1 },
  gridLineV: { position: "absolute", top: 0, bottom: 0, width: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    zIndex: 10,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)" },
  headerCenter: { alignItems: "center", gap: 4 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 16, letterSpacing: 2 },
  betaBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  betaText: { fontFamily: "Inter_700Bold", fontSize: 9, letterSpacing: 1.5 },
  intro: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, gap: 24 },
  scanFrame: { width: 140, height: 140, alignItems: "center", justifyContent: "center" },
  ring: { position: "absolute", width: 140, height: 140, borderRadius: 70, borderWidth: 1.5 },
  scanIcon: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(212,175,55,0.1)" },
  introText: { alignItems: "center", gap: 10 },
  introTitle: { fontFamily: "Inter_700Bold", fontSize: 26, textAlign: "center" },
  introDesc: { fontFamily: "Inter_400Regular", fontSize: 14, textAlign: "center", lineHeight: 21 },
  features: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center" },
  featureItem: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  featureText: { fontFamily: "Inter_400Regular", fontSize: 12 },
  scanBtn: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 32, paddingVertical: 16 },
  scanBtnText: { fontFamily: "Inter_700Bold", fontSize: 16 },
  techNote: { fontFamily: "Inter_400Regular", fontSize: 10, letterSpacing: 0.5 },
  scanning: { flex: 1, alignItems: "center", justifyContent: "center", gap: 24 },
  scanTarget: { width: 240, height: 240, position: "relative" },
  bracket: { position: "absolute", width: 32, height: 32, borderWidth: 3 },
  bracketTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  bracketTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bracketBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bracketBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  scanningText: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
  scanningHint: { fontFamily: "Inter_400Regular", fontSize: 13 },
  detected: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 24, paddingBottom: 40, gap: 12 },
  detectedBadge: { flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "center", paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  detectedLabel: { fontFamily: "Inter_700Bold", fontSize: 13 },
  detectedTitle: { fontFamily: "Inter_700Bold", fontSize: 24, textAlign: "center" },
  detectedArtist: { fontFamily: "Inter_400Regular", fontSize: 14, textAlign: "center" },
  arActions: { flexDirection: "row", justifyContent: "space-around", marginVertical: 8 },
  arAction: { alignItems: "center", gap: 8, padding: 16, width: 80 },
  arActionLabel: { fontFamily: "Inter_400Regular", fontSize: 11, textAlign: "center" },
  rescanBtn: { alignItems: "center" },
  rescanText: { fontFamily: "Inter_400Regular", fontSize: 13 },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, alignItems: "center", padding: 16 },
  closeBtn: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, alignItems: "center", justifyContent: "center" },
});
