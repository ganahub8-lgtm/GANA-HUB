import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GoldButton } from "@/components/GoldButton";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";

export default function AuthScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setLoading(true);
    setError("");
    try {
      if (mode === "signin") await signIn(email, password);
      else await signUp(name, email, password);
      router.replace("/(tabs)/index" as never);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LinearGradient
        colors={[`${colors.gold}15`, colors.background, colors.background]}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.4, 1]}
      />

      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 20 }]}>
        <Pressable onPress={() => router.back()}>
          <Feather name="x" size={22} color={colors.mutedForeground} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.logoBlock}>
          <Text style={[styles.logoSub, { color: colors.mutedForeground }]}>WELCOME TO</Text>
          <Text style={[styles.logoTitle, { color: colors.gold }]}>GANA HUB</Text>
          <Text style={[styles.logoTagline, { color: colors.mutedForeground }]}>
            African Creative Ecosystem
          </Text>
        </View>

        {/* Mode Toggle */}
        <View style={[styles.modeToggle, { backgroundColor: colors.muted, borderRadius: 10 }]}>
          {(["signin", "signup"] as const).map((m) => (
            <Pressable
              key={m}
              onPress={() => { setMode(m); setError(""); }}
              style={[
                styles.modeBtn,
                {
                  backgroundColor: mode === m ? colors.gold : "transparent",
                  borderRadius: 8,
                },
              ]}
            >
              <Text style={[styles.modeBtnText, { color: mode === m ? colors.primaryForeground : colors.mutedForeground }]}>
                {m === "signin" ? "Sign In" : "Create Account"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Form */}
        <View style={styles.form}>
          {mode === "signup" && (
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Full name"
              placeholderTextColor={colors.mutedForeground}
              style={[styles.input, { backgroundColor: colors.muted, borderColor: colors.border, color: colors.foreground, borderRadius: colors.radius }]}
            />
          )}
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.input, { backgroundColor: colors.muted, borderColor: colors.border, color: colors.foreground, borderRadius: colors.radius }]}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={colors.mutedForeground}
            secureTextEntry
            style={[styles.input, { backgroundColor: colors.muted, borderColor: colors.border, color: colors.foreground, borderRadius: colors.radius }]}
          />
          {error ? <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text> : null}
        </View>

        <GoldButton
          label={mode === "signin" ? "Sign In" : "Create Account"}
          onPress={handleSubmit}
          loading={loading}
          fullWidth
          size="lg"
        />

        <View style={styles.orRow}>
          <View style={[styles.orLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.orText, { color: colors.mutedForeground }]}>or</Text>
          <View style={[styles.orLine, { backgroundColor: colors.border }]} />
        </View>

        <Pressable
          style={[styles.googleBtn, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
          onPress={() => {}}
        >
          <Text style={[styles.googleBtnText, { color: colors.foreground }]}>Continue with Google</Text>
        </Pressable>

        <Pressable onPress={() => router.replace("/(tabs)/index" as never)}>
          <Text style={[styles.skipText, { color: colors.mutedForeground }]}>Continue without account</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  content: { flex: 1, paddingHorizontal: 24, gap: 20, justifyContent: "center", paddingBottom: 40 },
  logoBlock: { alignItems: "center", gap: 4, marginBottom: 8 },
  logoSub: { fontFamily: "Inter_500Medium", fontSize: 10, letterSpacing: 3 },
  logoTitle: { fontFamily: "Inter_700Bold", fontSize: 36, letterSpacing: 5 },
  logoTagline: { fontFamily: "Inter_400Regular", fontSize: 13 },
  modeToggle: { flexDirection: "row", padding: 4 },
  modeBtn: { flex: 1, paddingVertical: 10, alignItems: "center" },
  modeBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  form: { gap: 12 },
  input: { height: 52, paddingHorizontal: 16, borderWidth: 1, fontFamily: "Inter_400Regular", fontSize: 14 },
  errorText: { fontFamily: "Inter_400Regular", fontSize: 13 },
  orRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  orLine: { flex: 1, height: 1 },
  orText: { fontFamily: "Inter_400Regular", fontSize: 13 },
  googleBtn: { height: 52, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  googleBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  skipText: { fontFamily: "Inter_400Regular", fontSize: 13, textAlign: "center" },
});
