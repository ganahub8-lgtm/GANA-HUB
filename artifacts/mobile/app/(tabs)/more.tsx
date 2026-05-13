import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";

interface MenuItemProps {
  icon: string;
  label: string;
  desc: string;
  onPress: () => void;
  badge?: string;
  badgeColor?: string;
  accent?: boolean;
}

function MenuItem({ icon, label, desc, onPress, badge, badgeColor, accent }: MenuItemProps) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.menuItem,
        {
          backgroundColor: accent ? `${colors.gold}15` : colors.card,
          borderColor: accent ? `${colors.gold}40` : colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      <View style={[styles.menuIcon, { backgroundColor: accent ? `${colors.gold}25` : colors.muted, borderRadius: 10 }]}>
        <Feather name={icon as never} size={20} color={accent ? colors.gold : colors.foreground} />
      </View>
      <View style={styles.menuText}>
        <Text style={[styles.menuLabel, { color: accent ? colors.gold : colors.foreground }]}>{label}</Text>
        <Text style={[styles.menuDesc, { color: colors.mutedForeground }]}>{desc}</Text>
      </View>
      {badge && (
        <View style={[styles.badge, { backgroundColor: badgeColor ?? colors.muted }]}>
          <Text style={[styles.badgeText, { color: badgeColor ? "#000" : colors.mutedForeground }]}>
            {badge}
          </Text>
        </View>
      )}
      <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
    </Pressable>
  );
}

export default function MoreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, isAuthenticated, signOut } = useAuth();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with gradient */}
      <LinearGradient
        colors={[`${colors.gold}25`, colors.background]}
        style={[styles.headerGrad, { paddingTop: topPad + 16 }]}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>GANA HUB</Text>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>Explore</Text>
          </View>
          {isAuthenticated ? (
            <View style={[styles.userBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="user" size={16} color={colors.gold} />
              <Text style={[styles.userName, { color: colors.foreground }]}>{user?.name ?? "User"}</Text>
            </View>
          ) : (
            <Pressable
              style={[styles.signInBtn, { borderColor: colors.gold, borderRadius: 20 }]}
              onPress={() => router.push("/auth" as never)}
            >
              <Text style={[styles.signInText, { color: colors.gold }]}>Sign in</Text>
            </Pressable>
          )}
        </View>
      </LinearGradient>

      <View style={styles.sections}>
        {/* GANA Platforms */}
        <View>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>PLATFORMS</Text>
          <View style={styles.menuList}>
            <MenuItem
              icon="calendar"
              label="Festival Hub"
              desc="Events, exhibitions & workshops"
              onPress={() => router.push("/festival" as never)}
              badge="3 Events"
              badgeColor={colors.gold}
              accent
            />
            <MenuItem
              icon="camera"
              label="GANA Living Art"
              desc="WebAR artwork scanning"
              onPress={() => router.push("/living-art" as never)}
              badge="BETA"
            />
            <MenuItem
              icon="cpu"
              label="AI Features"
              desc="Artwork descriptions & discovery"
              onPress={() => {}}
              badge="SOON"
            />
          </View>
        </View>

        {/* Artist Tools */}
        <View>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>ARTISTS</Text>
          <View style={styles.menuList}>
            <MenuItem
              icon="user-plus"
              label="Join as Artist"
              desc="Register in the GANA database"
              onPress={() => router.push("/register-artist" as never)}
              accent
            />
            <MenuItem
              icon="briefcase"
              label="Artist Dashboard"
              desc="Manage your profile & artworks"
              onPress={() => {}}
            />
            <MenuItem
              icon="send"
              label="Apply for Exhibition"
              desc="Submit to upcoming shows"
              onPress={() => router.push("/festival" as never)}
            />
          </View>
        </View>

        {/* Payments */}
        <View>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>PAYMENTS</Text>
          <View style={styles.menuList}>
            <MenuItem
              icon="smartphone"
              label="Mobile Money"
              desc="MTN MoMo & Airtel Money"
              onPress={() => {}}
            />
            <MenuItem
              icon="credit-card"
              label="Transaction History"
              desc="View your payment records"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Admin */}
        <View>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>ADMIN</Text>
          <View style={styles.menuList}>
            <MenuItem
              icon="bar-chart-2"
              label="Admin Dashboard"
              desc="Transactions, artists & analytics"
              onPress={() => router.push("/admin" as never)}
            />
          </View>
        </View>

        {/* Account */}
        <View>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>ACCOUNT</Text>
          <View style={styles.menuList}>
            {isAuthenticated ? (
              <MenuItem
                icon="log-out"
                label="Sign Out"
                desc={`Signed in as ${user?.email ?? ""}`}
                onPress={signOut}
              />
            ) : (
              <MenuItem
                icon="log-in"
                label="Sign In"
                desc="Access your account"
                onPress={() => router.push("/auth" as never)}
                accent
              />
            )}
          </View>
        </View>

        {/* About */}
        <View style={[styles.about, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <Text style={[styles.aboutTitle, { color: colors.gold }]}>GANA HUB</Text>
          <Text style={[styles.aboutDesc, { color: colors.mutedForeground }]}>
            African creative infrastructure for artists, collectors, and cultural storytellers.
            Built for Africa. Built for the world.
          </Text>
          <Text style={[styles.aboutVersion, { color: colors.mutedForeground }]}>Version 1.0.0 MVP</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  headerGrad: { paddingBottom: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  headerSub: { fontFamily: "Inter_500Medium", fontSize: 10, letterSpacing: 3 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 28 },
  userBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 20,
  },
  userName: { fontFamily: "Inter_500Medium", fontSize: 13 },
  signInBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1.5,
  },
  signInText: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  sections: { paddingHorizontal: 20, gap: 24 },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 2.5,
    marginBottom: 10,
  },
  menuList: { gap: 8 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
    borderWidth: 1,
  },
  menuIcon: { width: 42, height: 42, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  menuText: { flex: 1 },
  menuLabel: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  menuDesc: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  badgeText: { fontFamily: "Inter_700Bold", fontSize: 9, letterSpacing: 0.5 },
  about: {
    padding: 20,
    borderWidth: 1,
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  aboutTitle: { fontFamily: "Inter_700Bold", fontSize: 20, letterSpacing: 3 },
  aboutDesc: { fontFamily: "Inter_400Regular", fontSize: 12, textAlign: "center", lineHeight: 18 },
  aboutVersion: { fontFamily: "Inter_400Regular", fontSize: 10, letterSpacing: 1 },
});
