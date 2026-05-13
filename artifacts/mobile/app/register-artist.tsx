import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GoldButton } from "@/components/GoldButton";
import { ARTIST_CATEGORIES } from "@/constants/sampleData";
import { useColors } from "@/hooks/useColors";

const COUNTRIES = ["Uganda", "Kenya", "Tanzania", "Nigeria", "Ghana", "Senegal", "Ethiopia", "Rwanda", "South Africa", "Other"];

const INTERESTS = [
  "Physical exhibitions", "Virtual exhibitions", "Festivals", "Workshops",
  "Collaborations", "Marketplace selling", "International opportunities", "AR/immersive exhibitions",
];

interface FormData {
  fullName: string;
  stageName: string;
  country: string;
  city: string;
  bio: string;
  email: string;
  whatsapp: string;
  website: string;
  instagram: string;
  categories: string[];
  interests: string[];
  profileImage: string | null;
}

export default function RegisterArtistScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    fullName: "", stageName: "", country: "Uganda", city: "",
    bio: "", email: "", whatsapp: "", website: "", instagram: "",
    categories: [], interests: [], profileImage: null,
  });

  const update = (key: keyof FormData, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const toggleArr = (key: "categories" | "interests", val: string) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter((v) => v !== val) : [...f[key], val],
    }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setForm((f) => ({ ...f, profileImage: result.assets[0]!.uri }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    // TODO: Save to Firestore
    // const docRef = await addDoc(collection(db, "artists"), { ...form, createdAt: new Date().toISOString() });
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    router.replace("/(tabs)/artists" as never);
  };

  const InputField = ({ label, value, key, placeholder, multiline = false, keyboard = "default" }: {
    label: string; value: string; key: keyof FormData; placeholder: string; multiline?: boolean; keyboard?: string;
  }) => (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={(v) => update(key, v)}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        multiline={multiline}
        keyboardType={keyboard as never}
        style={[
          styles.input,
          { color: colors.foreground, backgroundColor: colors.muted, borderColor: colors.border, borderRadius: colors.radius },
          multiline && { height: 100, textAlignVertical: "top", paddingTop: 12 },
        ]}
      />
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12 }]}>
        <Pressable onPress={() => (step > 1 ? setStep((s) => s - 1) : router.back())}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Join GANA Network</Text>
          <Text style={[styles.headerStep, { color: colors.mutedForeground }]}>Step {step} of 3</Text>
        </View>
        <View style={{ width: 20 }} />
      </View>

      {/* Progress */}
      <View style={[styles.progress, { backgroundColor: colors.muted }]}>
        <View style={[styles.progressFill, { width: `${(step / 3) * 100}%`, backgroundColor: colors.gold }]} />
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          {step === 1 && (
            <>
              <Text style={[styles.stepTitle, { color: colors.foreground }]}>Your Profile</Text>
              {/* Profile Photo */}
              <Pressable onPress={pickImage} style={styles.photoPicker}>
                {form.profileImage ? (
                  <Image source={{ uri: form.profileImage }} style={styles.photoPreview} contentFit="cover" />
                ) : (
                  <View style={[styles.photoPlaceholder, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                    <Feather name="camera" size={28} color={colors.mutedForeground} />
                    <Text style={[styles.photoHint, { color: colors.mutedForeground }]}>Add photo</Text>
                  </View>
                )}
              </Pressable>

              <InputField label="Full Name" value={form.fullName} key="fullName" placeholder="Your legal name" />
              <InputField label="Artist / Stage Name" value={form.stageName} key="stageName" placeholder="How you're known publicly" />
              <InputField label="Email" value={form.email} key="email" placeholder="artist@email.com" keyboard="email-address" />
              <InputField label="WhatsApp Number" value={form.whatsapp} key="whatsapp" placeholder="+256 7XX XXX XXX" keyboard="phone-pad" />

              {/* Country */}
              <View style={styles.field}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Country</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 4 }}>
                  <View style={styles.chipRow}>
                    {COUNTRIES.map((c) => (
                      <Pressable
                        key={c}
                        onPress={() => update("country", c)}
                        style={[
                          styles.chip,
                          { backgroundColor: form.country === c ? colors.gold : colors.muted, borderRadius: 20 },
                        ]}
                      >
                        <Text style={[styles.chipText, { color: form.country === c ? colors.primaryForeground : colors.mutedForeground }]}>
                          {c}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>
              <InputField label="City" value={form.city} key="city" placeholder="Your city" />
            </>
          )}

          {step === 2 && (
            <>
              <Text style={[styles.stepTitle, { color: colors.foreground }]}>Your Practice</Text>
              <InputField label="Bio / Story" value={form.bio} key="bio" placeholder="Tell the world who you are as an artist..." multiline />

              <View style={styles.field}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Artistic Category (select all that apply)</Text>
                <View style={styles.checkGrid}>
                  {ARTIST_CATEGORIES.slice(1).map((cat) => {
                    const sel = form.categories.includes(cat);
                    return (
                      <Pressable
                        key={cat}
                        onPress={() => toggleArr("categories", cat)}
                        style={[
                          styles.checkItem,
                          {
                            backgroundColor: sel ? `${colors.gold}20` : colors.muted,
                            borderColor: sel ? colors.gold : colors.border,
                            borderRadius: 8,
                          },
                        ]}
                      >
                        {sel && <Feather name="check" size={12} color={colors.gold} />}
                        <Text style={[styles.checkText, { color: sel ? colors.gold : colors.mutedForeground }]}>{cat}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.field}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>I am interested in...</Text>
                <View style={styles.checkGrid}>
                  {INTERESTS.map((interest) => {
                    const sel = form.interests.includes(interest);
                    return (
                      <Pressable
                        key={interest}
                        onPress={() => toggleArr("interests", interest)}
                        style={[
                          styles.checkItem,
                          {
                            backgroundColor: sel ? `${colors.gold}20` : colors.muted,
                            borderColor: sel ? colors.gold : colors.border,
                            borderRadius: 8,
                          },
                        ]}
                      >
                        {sel && <Feather name="check" size={12} color={colors.gold} />}
                        <Text style={[styles.checkText, { color: sel ? colors.gold : colors.mutedForeground }]}>{interest}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={[styles.stepTitle, { color: colors.foreground }]}>Your Presence</Text>
              <InputField label="Instagram" value={form.instagram} key="instagram" placeholder="@yourusername" />
              <InputField label="Website (optional)" value={form.website} key="website" placeholder="https://yourwebsite.com" keyboard="url" />

              {/* Summary */}
              <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
                <Text style={[styles.summaryTitle, { color: colors.gold }]}>Summary</Text>
                {[
                  { label: "Name", val: form.stageName || form.fullName },
                  { label: "Location", val: `${form.city}, ${form.country}` },
                  { label: "Disciplines", val: form.categories.join(", ") || "Not selected" },
                  { label: "Interests", val: `${form.interests.length} selected` },
                ].map((row) => (
                  <View key={row.label} style={[styles.summaryRow, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>{row.label}</Text>
                    <Text style={[styles.summaryVal, { color: colors.foreground }]} numberOfLines={1}>{row.val}</Text>
                  </View>
                ))}
              </View>

              <Text style={[styles.termsText, { color: colors.mutedForeground }]}>
                By joining, you agree to the GANA HUB artist terms and allow your profile to be visible in the creative directory.
              </Text>
            </>
          )}
        </View>
      </KeyboardAwareScrollView>

      {/* Footer */}
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
        {step < 3 ? (
          <GoldButton label="Continue" onPress={() => setStep((s) => s + 1)} fullWidth size="lg" />
        ) : (
          <GoldButton label="Join GANA Network" onPress={handleSubmit} loading={loading} fullWidth size="lg" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerCenter: { alignItems: "center" },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 16 },
  headerStep: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
  progress: { height: 3, marginHorizontal: 20, borderRadius: 2, marginBottom: 4 },
  progressFill: { height: 3, borderRadius: 2 },
  form: { paddingHorizontal: 20, paddingTop: 16, gap: 20 },
  stepTitle: { fontFamily: "Inter_700Bold", fontSize: 22, marginBottom: 4 },
  photoPicker: { alignSelf: "center" },
  photoPreview: { width: 100, height: 100, borderRadius: 50 },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  photoHint: { fontFamily: "Inter_400Regular", fontSize: 11 },
  field: { gap: 6 },
  fieldLabel: { fontFamily: "Inter_500Medium", fontSize: 12, letterSpacing: 0.5 },
  input: { paddingHorizontal: 14, height: 48, borderWidth: 1, fontFamily: "Inter_400Regular", fontSize: 14 },
  chipRow: { flexDirection: "row", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7 },
  chipText: { fontFamily: "Inter_500Medium", fontSize: 12 },
  checkGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
  },
  checkText: { fontFamily: "Inter_400Regular", fontSize: 12 },
  summaryCard: { padding: 16, borderWidth: 1, gap: 0 },
  summaryTitle: { fontFamily: "Inter_700Bold", fontSize: 16, marginBottom: 12 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1 },
  summaryLabel: { fontFamily: "Inter_400Regular", fontSize: 13 },
  summaryVal: { fontFamily: "Inter_500Medium", fontSize: 13, flex: 1, textAlign: "right" },
  termsText: { fontFamily: "Inter_400Regular", fontSize: 11, lineHeight: 16 },
  footer: { borderTopWidth: 1, paddingTop: 12, paddingHorizontal: 20 },
});
