import React, {
  useState, useRef, useCallback, useEffect, useMemo,
} from "react";
import {
  View, Text, StyleSheet, Dimensions, FlatList, Pressable,
  Animated, ViewToken,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Reanimated, {
  useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming,
  cancelAnimation, Easing,
} from "react-native-reanimated";
import { Audio } from "expo-av";
import { useColors } from "@/hooks/useColors";
import {
  SAMPLE_ARTWORKS, formatUGX, type Artwork,
} from "@/constants/sampleData";
import { getArtworkImage } from "@/constants/artworkImages";

const { width: SW, height: SH } = Dimensions.get("window");
const GOLD = "#D4AF37";
const BRONZE = "#C08A2E";

// ─── Seeded deterministic pseudo-random ──────────────────────────────────────
function seeded(seed: number, i: number): number {
  return ((seed * 9301 + i * 49297 + 233) % 1000) / 1000;
}
function artSeed(id: string): number {
  return id.split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) & 0xffff, 0);
}

// ─── Sound URLs (public domain, Wikipedia Commons) ───────────────────────────
const SFX: Record<string, string> = {
  lion:     "https://upload.wikimedia.org/wikipedia/commons/e/e4/Lionalert.ogg",
  elephant: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Elephant_Namibia.ogg",
  chimp:    "https://upload.wikimedia.org/wikipedia/commons/8/87/Chimpanzee_greeting.ogg",
  ambient:  "https://upload.wikimedia.org/wikipedia/commons/a/a1/African_grassland_ambience.ogg",
};

// ─── Per-artwork living metadata ─────────────────────────────────────────────
type ParticleKind = "butterfly" | "smoke" | "spark" | "petal";
interface LMeta {
  arType: "animal" | "face";
  particles: ParticleKind[];
  effectLabel: string;
  soundLabel?: string;
  soundUrl?: string;
  hasTear?: boolean;
}

const META: Record<string, LMeta> = {
  w1:  { arType: "face",   particles: ["butterfly","spark"],         effectLabel: "Eyes blink softly" },
  w2:  { arType: "animal", particles: ["butterfly","smoke"],         effectLabel: "Neck sways with grace",    soundLabel: "Savanna ambience",  soundUrl: SFX.ambient   },
  w3:  { arType: "face",   particles: ["butterfly","spark"],         effectLabel: "Children smile" },
  w4:  { arType: "animal", particles: ["smoke"],                     effectLabel: "Ears fan gently",          soundLabel: "Elephant rumbles",  soundUrl: SFX.elephant  },
  w5:  { arType: "animal", particles: ["spark"],                     effectLabel: "Moves with the beat",      soundLabel: "Chimp calls",       soundUrl: SFX.chimp     },
  w6:  { arType: "animal", particles: ["smoke","spark"],             effectLabel: "Power radiates",           soundLabel: "Elephant trumpets", soundUrl: SFX.elephant  },
  w7:  { arType: "face",   particles: ["butterfly","petal"],         effectLabel: "Joy radiates outward" },
  w8:  { arType: "animal", particles: ["butterfly"],                 effectLabel: "Strides the golden plain", soundLabel: "Savanna wind",      soundUrl: SFX.ambient   },
  w9:  { arType: "animal", particles: ["spark"],                     effectLabel: "Chimps chatter and play",  soundLabel: "Chimp calls",       soundUrl: SFX.chimp     },
  w10: { arType: "face",   particles: ["spark"], hasTear: true,      effectLabel: "A tear falls silently" },
  w11: { arType: "face",   particles: ["smoke","spark"],             effectLabel: "Gaze shifts within" },
  w12: { arType: "face",   particles: ["butterfly","spark"],         effectLabel: "Gentle smile blooms" },
  w13: { arType: "face",   particles: ["petal","butterfly"],         effectLabel: "Petals drift past her" },
  w14: { arType: "animal", particles: ["smoke","spark"],             effectLabel: "Power charges the air",    soundLabel: "Elephant rumbles",  soundUrl: SFX.elephant  },
  w15: { arType: "animal", particles: ["smoke"],                     effectLabel: "Water ripples below",      soundLabel: "Elephant calls",    soundUrl: SFX.elephant  },
  w16: { arType: "animal", particles: ["spark"],                     effectLabel: "Fins shimmer and dance" },
  w17: { arType: "animal", particles: ["smoke","spark"],             effectLabel: "Mane ripples in the wind", soundLabel: "Lion roars",        soundUrl: SFX.lion      },
  w18: { arType: "face",   particles: ["smoke","petal"],             effectLabel: "Eyes hold the light" },
  w19: { arType: "animal", particles: ["butterfly","smoke"],         effectLabel: "Family walks as one",      soundLabel: "Elephant family",   soundUrl: SFX.elephant  },
  w20: { arType: "animal", particles: ["smoke","spark"],             effectLabel: "Lion of Judah rises",      soundLabel: "Lion roars",        soundUrl: SFX.lion      },
};

// ─── Butterfly ────────────────────────────────────────────────────────────────
function ButterflyParticle({ x, baseY, delay, color = GOLD }: {
  x: number; baseY: number; delay: number; color?: string;
}) {
  const ty    = useRef(new Animated.Value(0)).current;
  const tx    = useRef(new Animated.Value(0)).current;
  const op    = useRef(new Animated.Value(0)).current;
  const wingS = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const dur   = 4000 + seeded(x * 13, 1) * 2000;
    const drift = (seeded(x * 7, 2) - 0.5) * 90;

    Animated.loop(Animated.sequence([
      Animated.timing(wingS, { toValue: 0.12, duration: 160, useNativeDriver: true }),
      Animated.timing(wingS, { toValue: 1,    duration: 160, useNativeDriver: true }),
    ])).start();

    Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(op, { toValue: 0.88, duration: 400, useNativeDriver: true }),
        Animated.timing(ty, { toValue: -260, duration: dur,  useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(tx, { toValue: drift,        duration: dur / 2, useNativeDriver: true }),
          Animated.timing(tx, { toValue: -drift * 0.4, duration: dur / 2, useNativeDriver: true }),
        ]),
      ]),
      Animated.timing(op, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(ty, { toValue: 0, duration: 0, useNativeDriver: true }),
        Animated.timing(tx, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
      Animated.delay(400 + seeded(baseY * 3, 3) * 1200),
    ])).start();
  }, []);

  return (
    <Animated.View style={[S.abs, { left: x, bottom: baseY, opacity: op, transform: [{ translateY: ty }, { translateX: tx }] }]}>
      <View style={{ flexDirection: "row", gap: 2 }}>
        <Animated.View style={{ width: 11, height: 8, borderRadius: 4, backgroundColor: color, transform: [{ scaleX: wingS }] }} />
        <Animated.View style={{ width: 11, height: 8, borderRadius: 4, backgroundColor: color, transform: [{ scaleX: wingS }] }} />
      </View>
    </Animated.View>
  );
}

// ─── Smoke wisp ───────────────────────────────────────────────────────────────
function SmokeWisp({ x, baseY, delay }: { x: number; baseY: number; delay: number }) {
  const ty = useRef(new Animated.Value(0)).current;
  const sc = useRef(new Animated.Value(0.35)).current;
  const op = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(op, { toValue: 0.25, duration: 700,  useNativeDriver: true }),
        Animated.timing(ty, { toValue: -140, duration: 3500, useNativeDriver: true }),
        Animated.timing(sc, { toValue: 2.4,  duration: 3500, useNativeDriver: true }),
      ]),
      Animated.timing(op, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(ty, { toValue: 0,    duration: 0, useNativeDriver: true }),
        Animated.timing(sc, { toValue: 0.35, duration: 0, useNativeDriver: true }),
      ]),
      Animated.delay(300 + seeded(baseY * 11, 4) * 900),
    ])).start();
  }, []);

  return (
    <Animated.View style={[S.abs, {
      left: x, bottom: baseY, width: 24, height: 24, borderRadius: 12,
      backgroundColor: "rgba(220,220,220,0.5)",
      opacity: op, transform: [{ translateY: ty }, { scale: sc }],
    }]} />
  );
}

// ─── Spark ────────────────────────────────────────────────────────────────────
function SparkParticle({ x, y, delay }: { x: number; y: number; delay: number }) {
  const op = useRef(new Animated.Value(0)).current;
  const sc = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(op, { toValue: 1,   duration: 220, useNativeDriver: true }),
        Animated.timing(sc, { toValue: 1.8, duration: 220, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(op, { toValue: 0,   duration: 700, useNativeDriver: true }),
        Animated.timing(sc, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ]),
      Animated.delay(seeded(x + y * 7, 5) * 2800 + 600),
    ])).start();
  }, []);

  return (
    <Animated.View style={[S.abs, {
      left: x, top: y, width: 5, height: 5, borderRadius: 2.5,
      backgroundColor: GOLD, opacity: op, transform: [{ scale: sc }],
    }]} />
  );
}

// ─── Petal ────────────────────────────────────────────────────────────────────
function PetalParticle({ x, baseY, delay }: { x: number; baseY: number; delay: number }) {
  const ty  = useRef(new Animated.Value(0)).current;
  const tx  = useRef(new Animated.Value(0)).current;
  const op  = useRef(new Animated.Value(0)).current;
  const rot = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const dur   = 5500 + seeded(x * 3, 6) * 2000;
    const drift = 55 + seeded(baseY * 5, 7) * 90;

    Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(op,  { toValue: 0.8, duration: 500, useNativeDriver: true }),
        Animated.timing(ty,  { toValue: 110,  duration: dur, useNativeDriver: true }),
        Animated.timing(tx,  { toValue: drift, duration: dur, useNativeDriver: true }),
        Animated.timing(rot, { toValue: 1,    duration: dur, useNativeDriver: true }),
      ]),
      Animated.timing(op, { toValue: 0, duration: 400, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(ty,  { toValue: 0, duration: 0, useNativeDriver: true }),
        Animated.timing(tx,  { toValue: 0, duration: 0, useNativeDriver: true }),
        Animated.timing(rot, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
      Animated.delay(300 + seeded(x + baseY, 8) * 1100),
    ])).start();
  }, []);

  const spin = rot.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <Animated.View style={[S.abs, {
      left: x, bottom: baseY, width: 15, height: 9, borderRadius: 7,
      backgroundColor: BRONZE, opacity: op,
      transform: [{ translateY: ty }, { translateX: tx }, { rotate: spin }],
    }]} />
  );
}

// ─── Animal ripple (two expanding rings) ─────────────────────────────────────
function AnimalRipple({ cx, cy }: { cx: number; cy: number }) {
  const sc1 = useRef(new Animated.Value(0.07)).current;
  const op1 = useRef(new Animated.Value(0)).current;
  const sc2 = useRef(new Animated.Value(0.07)).current;
  const op2 = useRef(new Animated.Value(0)).current;

  const makeRipple = (sc: Animated.Value, op: Animated.Value, offset: number) =>
    Animated.loop(Animated.sequence([
      Animated.delay(offset),
      Animated.timing(op, { toValue: 0.8, duration: 80, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(sc, { toValue: 1,   duration: 2400, useNativeDriver: true }),
        Animated.timing(op, { toValue: 0,   duration: 2400, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(sc, { toValue: 0.07, duration: 0, useNativeDriver: true }),
      ]),
      Animated.delay(100),
    ]));

  useEffect(() => {
    const a1 = makeRipple(sc1, op1, 0);
    const a2 = makeRipple(sc2, op2, 1200);
    a1.start();
    a2.start();
    return () => { a1.stop(); a2.stop(); };
  }, []);

  return (
    <View style={[S.abs, { left: cx - 55, top: cy - 55 }]}>
      <Animated.View style={[S.rippleRing, { opacity: op1, transform: [{ scale: sc1 }] }]} />
      <Animated.View style={[S.rippleRing, { opacity: op2, transform: [{ scale: sc2 }] }]} />
    </View>
  );
}

// ─── Eye blink ────────────────────────────────────────────────────────────────
function EyeBlink({ cx, cy }: { cx: number; cy: number }) {
  const scY = useRef(new Animated.Value(0)).current;
  const op  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const blink = () => {
      Animated.sequence([
        Animated.delay(2800 + seeded(cx + cy, 9) * 4000),
        Animated.parallel([
          Animated.timing(op,  { toValue: 1, duration: 65, useNativeDriver: true }),
          Animated.timing(scY, { toValue: 1, duration: 65, useNativeDriver: true }),
        ]),
        Animated.delay(110),
        Animated.parallel([
          Animated.timing(scY, { toValue: 0, duration: 65, useNativeDriver: true }),
          Animated.timing(op,  { toValue: 0, duration: 65, useNativeDriver: true }),
        ]),
      ]).start(() => blink());
    };
    blink();
  }, []);

  return (
    <Animated.View style={[S.abs, {
      left: cx - 24, top: cy,
      width: 48, height: 7, borderRadius: 3.5,
      backgroundColor: "#0e0500",
      opacity: op, transform: [{ scaleY: scY }],
    }]} />
  );
}

// ─── Tear drop ────────────────────────────────────────────────────────────────
function TearDrop({ cx, cy }: { cx: number; cy: number }) {
  const ty = useRef(new Animated.Value(0)).current;
  const op = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.delay(6000 + seeded(cx * cy, 10) * 5000),
      Animated.timing(op, { toValue: 0.9, duration: 300, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(ty, { toValue: 75,  duration: 3200, useNativeDriver: true }),
        Animated.timing(op, { toValue: 0,   duration: 3200, useNativeDriver: true }),
      ]),
      Animated.timing(ty, { toValue: 0, duration: 0, useNativeDriver: true }),
    ])).start();
  }, []);

  return (
    <Animated.View style={[S.abs, {
      left: cx - 4, top: cy,
      width: 7, height: 12, borderRadius: 4,
      backgroundColor: "rgba(135,195,255,0.9)",
      opacity: op, transform: [{ translateY: ty }],
    }]} />
  );
}

// ─── Particle overlay ─────────────────────────────────────────────────────────
function ParticleOverlay({ meta, seed }: { meta: LMeta; seed: number }) {
  const { particles, arType, hasTear } = meta;

  const butterflies = useMemo(() =>
    particles.includes("butterfly")
      ? Array.from({ length: 5 }, (_, i) => ({
          id: i,
          x:     seeded(seed, i * 11 + 1) * (SW - 60) + 20,
          baseY: seeded(seed, i * 11 + 2) * 160 + 40,
          delay: seeded(seed, i * 11 + 3) * 2000,
          color: i % 2 === 0 ? GOLD : BRONZE,
        }))
      : [], [seed]);

  const smokes = useMemo(() =>
    particles.includes("smoke")
      ? Array.from({ length: 4 }, (_, i) => ({
          id: i,
          x:     seeded(seed, i * 13 + 4) * (SW - 40) + 20,
          baseY: seeded(seed, i * 13 + 5) * 120 + 20,
          delay: seeded(seed, i * 13 + 6) * 2500,
        }))
      : [], [seed]);

  const sparks = useMemo(() =>
    particles.includes("spark")
      ? Array.from({ length: 8 }, (_, i) => ({
          id: i,
          x:     seeded(seed, i * 7 + 7) * (SW - 20),
          y:     seeded(seed, i * 7 + 8) * (SH * 0.6),
          delay: seeded(seed, i * 7 + 9) * 3000,
        }))
      : [], [seed]);

  const petals = useMemo(() =>
    particles.includes("petal")
      ? Array.from({ length: 5 }, (_, i) => ({
          id: i,
          x:     seeded(seed, i * 9 + 10) * (SW - 50) + 10,
          baseY: seeded(seed, i * 9 + 11) * (SH * 0.4) + SH * 0.3,
          delay: seeded(seed, i * 9 + 12) * 2200,
        }))
      : [], [seed]);

  return (
    <>
      {butterflies.map(b => <ButterflyParticle key={`b${b.id}`} x={b.x} baseY={b.baseY} delay={b.delay} color={b.color} />)}
      {smokes.map(s => <SmokeWisp key={`s${s.id}`} x={s.x} baseY={s.baseY} delay={s.delay} />)}
      {sparks.map(p => <SparkParticle key={`sp${p.id}`} x={p.x} y={p.y} delay={p.delay} />)}
      {petals.map(p => <PetalParticle key={`p${p.id}`} x={p.x} baseY={p.baseY} delay={p.delay} />)}

      {arType === "animal" && (
        <AnimalRipple cx={SW * 0.5} cy={SH * 0.38} />
      )}

      {arType === "face" && (
        <>
          <EyeBlink cx={SW * 0.37} cy={SH * 0.32} />
          <EyeBlink cx={SW * 0.63} cy={SH * 0.32} />
          {hasTear && <TearDrop cx={SW * 0.37} cy={SH * 0.355} />}
        </>
      )}
    </>
  );
}

// ─── Living slide (one artwork page) ─────────────────────────────────────────
function LivingSlide({
  artwork, isActive, onSoundPress, soundPlaying,
}: {
  artwork: Artwork;
  isActive: boolean;
  onSoundPress: (url: string, label: string) => void;
  soundPlaying: boolean;
}) {
  const meta = META[artwork.id] ?? { arType: "face", particles: ["spark"], effectLabel: "Alive" } as LMeta;
  const seed = artSeed(artwork.id);

  const breathe = useSharedValue(1);
  const breatheStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathe.value }],
  }));

  useEffect(() => {
    if (!isActive) {
      cancelAnimation(breathe);
      breathe.value = withTiming(1, { duration: 800 });
      return;
    }
    breathe.value = withRepeat(
      withSequence(
        withTiming(1.055, { duration: 5500, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.0,   { duration: 5500, easing: Easing.inOut(Easing.sin) }),
      ),
      -1, false,
    );
  }, [isActive]);

  return (
    <View style={[S.slide, { backgroundColor: "#000" }]}>
      {/* Artwork image — breathing scale */}
      <Reanimated.View style={[StyleSheet.absoluteFill, breatheStyle]}>
        <Image
          source={getArtworkImage(artwork.id)}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
      </Reanimated.View>

      {/* Gradient vignette */}
      <LinearGradient
        colors={["rgba(0,0,0,0.15)", "transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.92)"]}
        locations={[0, 0.35, 0.72, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Particle & effect overlays — only render when visible */}
      {isActive && <ParticleOverlay meta={meta} seed={seed} />}

      {/* Living badge (top-right) */}
      <View style={S.liveBadge}>
        <View style={S.liveDot} />
        <Text style={S.liveBadgeText}>LIVING</Text>
      </View>

      {/* Bottom info panel */}
      <View style={S.bottomPanel}>
        <Text style={S.effectLabel}>{meta.effectLabel.toUpperCase()}</Text>
        <Text style={S.artTitle} numberOfLines={2}>{artwork.title}</Text>
        <Text style={S.artArtist}>{artwork.artistName}</Text>

        <View style={S.bottomRow}>
          <Text style={S.priceTag}>{formatUGX(artwork.price)}</Text>

          {meta.soundLabel && meta.soundUrl ? (
            <Pressable
              style={[S.soundBtn, soundPlaying && S.soundBtnActive]}
              onPress={() => onSoundPress(meta.soundUrl!, meta.soundLabel!)}
            >
              <Feather name={soundPlaying ? "volume-2" : "volume-1"} size={14} color="#000" />
              <Text style={S.soundBtnText}>
                {soundPlaying ? "Playing..." : meta.soundLabel}
              </Text>
            </Pressable>
          ) : (
            <View style={S.soundBtnPlaceholder} />
          )}
        </View>
      </View>
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function LivingGalleryScreen() {
  const router   = useRouter();
  const insets   = useSafeAreaInsets();
  const colors   = useColors();
  const artworks = useMemo(() => SAMPLE_ARTWORKS.filter(a => a.category === "Painting" || a.category === "Mixed Media"), []);

  const [activeIdx,   setActiveIdx]   = useState(0);
  const [soundActive, setSoundActive] = useState<string | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 60 });
  const onViewableChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setActiveIdx(viewableItems[0].index!);
    }
  });

  const handleSound = useCallback(async (url: string, label: string) => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setSoundActive(null);
      }

      if (soundActive === label) return;

      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const { sound } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: true });
      soundRef.current = sound;
      setSoundActive(label);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setSoundActive(null);
        }
      });
    } catch {
      setSoundActive(null);
    }
  }, [soundActive]);

  useEffect(() => {
    setSoundActive(null);
    return () => {
      soundRef.current?.stopAsync().then(() => soundRef.current?.unloadAsync());
    };
  }, [activeIdx]);

  useEffect(() => {
    return () => {
      soundRef.current?.stopAsync().then(() => soundRef.current?.unloadAsync());
    };
  }, []);

  const renderItem = useCallback(({ item, index }: { item: Artwork; index: number }) => (
    <LivingSlide
      artwork={item}
      isActive={index === activeIdx}
      onSoundPress={handleSound}
      soundPlaying={!!(META[item.id]?.soundLabel && soundActive === META[item.id]?.soundLabel)}
    />
  ), [activeIdx, soundActive, handleSound]);

  const keyExtractor = useCallback((item: Artwork) => item.id, []);

  const topPad = insets.top;
  const current = artworks[activeIdx];

  return (
    <View style={[S.screen, { backgroundColor: "#000" }]}>
      <FlatList
        data={artworks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        viewabilityConfig={viewConfig.current}
        onViewableItemsChanged={onViewableChanged.current}
        initialNumToRender={2}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews
      />

      {/* Header overlay */}
      <View style={[S.header, { paddingTop: topPad + 8 }]} pointerEvents="box-none">
        <Pressable onPress={() => router.back()} style={[S.headerBtn, { backgroundColor: "rgba(0,0,0,0.55)" }]}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </Pressable>

        <View style={S.headerCenter}>
          <Text style={[S.headerTitle, { color: colors.gold }]}>LIVING GALLERY</Text>
          <Text style={[S.headerCounter, { color: "rgba(255,255,255,0.55)" }]}>
            {activeIdx + 1} / {artworks.length}
          </Text>
        </View>

        <Pressable
          onPress={() => current && router.push(`/artwork/${current.id}` as never)}
          style={[S.headerBtn, { backgroundColor: `${colors.gold}22`, borderColor: `${colors.gold}55`, borderWidth: 1 }]}
        >
          <Feather name="shopping-bag" size={18} color={colors.gold} />
        </Pressable>
      </View>

      {/* Dot indicators */}
      <View style={[S.dots, { bottom: insets.bottom + 16 }]} pointerEvents="none">
        {artworks.map((_, i) => (
          <View
            key={i}
            style={[
              S.dot,
              { backgroundColor: i === activeIdx ? GOLD : "rgba(255,255,255,0.3)" },
              i === activeIdx && S.dotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  screen:   { flex: 1 },
  slide:    { width: SW, height: SH },
  abs:      { position: "absolute" },

  // Header
  header: {
    position: "absolute", top: 0, left: 0, right: 0,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingBottom: 12, zIndex: 20,
  },
  headerBtn: {
    width: 42, height: 42, borderRadius: 21,
    alignItems: "center", justifyContent: "center",
  },
  headerCenter: { alignItems: "center", gap: 2 },
  headerTitle:  { fontFamily: "Inter_700Bold", fontSize: 13, letterSpacing: 2.5 },
  headerCounter:{ fontFamily: "Inter_400Regular", fontSize: 11 },

  // Living badge
  liveBadge: {
    position: "absolute", top: 100, right: 16,
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: `${GOLD}55`,
  },
  liveDot:      { width: 6, height: 6, borderRadius: 3, backgroundColor: GOLD },
  liveBadgeText:{ fontFamily: "Inter_700Bold", fontSize: 9, color: GOLD, letterSpacing: 2 },

  // Ripple ring
  rippleRing: {
    position: "absolute",
    width: 110, height: 110, borderRadius: 55,
    borderWidth: 2, borderColor: GOLD,
  },

  // Bottom panel
  bottomPanel: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    padding: 24, paddingBottom: 80, gap: 6,
  },
  effectLabel: {
    fontFamily: "Inter_600SemiBold", fontSize: 10,
    color: GOLD, letterSpacing: 2.5, marginBottom: 4,
  },
  artTitle:  { fontFamily: "Inter_700Bold", fontSize: 22, color: "#fff", lineHeight: 28 },
  artArtist: { fontFamily: "Inter_400Regular", fontSize: 13, color: "rgba(255,255,255,0.6)" },
  bottomRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 },
  priceTag:  { fontFamily: "Inter_700Bold", fontSize: 18, color: GOLD },
  soundBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: GOLD, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  soundBtnActive:    { backgroundColor: BRONZE },
  soundBtnText:      { fontFamily: "Inter_600SemiBold", fontSize: 12, color: "#000" },
  soundBtnPlaceholder: { width: 80 },

  // Dots
  dots: {
    position: "absolute", left: 0, right: 0,
    flexDirection: "row", justifyContent: "center", gap: 5, flexWrap: "wrap",
    paddingHorizontal: 40,
  },
  dot:       { width: 5, height: 5, borderRadius: 2.5, backgroundColor: "rgba(255,255,255,0.3)" },
  dotActive: { width: 14, backgroundColor: GOLD },
});
