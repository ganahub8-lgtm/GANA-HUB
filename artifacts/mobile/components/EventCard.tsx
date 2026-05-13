import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { Event } from "@/constants/sampleData";
import { formatUGX } from "@/constants/sampleData";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const colors = useColors();
  const router = useRouter();

  const startDate = new Date(event.startDate);
  const month = startDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const day = startDate.getDate();
  const spotsPercent = ((event.capacity - event.spotsLeft) / event.capacity) * 100;
  const almostFull = spotsPercent > 80;

  return (
    <Pressable
      onPress={() => router.push("/festival" as never)}
      style={[
        styles.card,
        { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border },
      ]}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: event.imageUrl }} style={styles.image} contentFit="cover" />
        <View style={[styles.dateBadge, { backgroundColor: colors.background }]}>
          <Text style={[styles.dateMonth, { color: colors.gold }]}>{month}</Text>
          <Text style={[styles.dateDay, { color: colors.foreground }]}>{day}</Text>
        </View>
        <View style={[styles.typeBadge, { backgroundColor: colors.gold }]}>
          <Text style={[styles.typeText, { color: colors.primaryForeground }]}>{event.type}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={2}>
          {event.title}
        </Text>

        <View style={styles.row}>
          <Feather name="map-pin" size={12} color={colors.mutedForeground} />
          <Text style={[styles.location, { color: colors.mutedForeground }]} numberOfLines={1}>
            {event.city}
          </Text>
        </View>

        <View style={styles.row}>
          <Feather name="users" size={12} color={colors.mutedForeground} />
          <Text style={[styles.artists, { color: colors.mutedForeground }]}>
            {event.artistCount} artists participating
          </Text>
        </View>

        <View style={styles.bottom}>
          <Text style={[styles.price, { color: colors.gold }]}>
            {event.price === 0 ? "Free" : formatUGX(event.price)}
          </Text>
          {almostFull && (
            <View style={[styles.spotsTag, { backgroundColor: "#EF4444" + "22" }]}>
              <Text style={[styles.spotsText, { color: "#EF4444" }]}>
                Only {event.spotsLeft} left
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 260,
    marginRight: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 150,
    backgroundColor: "#1A1A1A",
  },
  dateBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  dateMonth: {
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    letterSpacing: 1,
  },
  dateDay: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    lineHeight: 20,
  },
  typeBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    letterSpacing: 1.5,
  },
  content: {
    padding: 14,
    gap: 6,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  location: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    flex: 1,
  },
  artists: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  price: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
  },
  spotsTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  spotsText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
  },
});
