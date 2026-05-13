import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  seeAllRoute?: string;
}

export function SectionHeader({ title, subtitle, seeAllRoute }: SectionHeaderProps) {
  const colors = useColors();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={[styles.accentBar, { backgroundColor: colors.gold }]} />
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {seeAllRoute && (
        <Pressable onPress={() => router.push(seeAllRoute as never)}>
          <Text style={[styles.seeAll, { color: colors.gold }]}>See all</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  accentBar: {
    width: 3,
    height: 24,
    borderRadius: 2,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginTop: 2,
  },
  seeAll: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    letterSpacing: 0.3,
  },
});
