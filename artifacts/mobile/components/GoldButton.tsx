import * as Haptics from "expo-haptics";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";

interface GoldButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "outline" | "ghost";
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export function GoldButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  fullWidth = false,
  size = "md",
  icon,
}: GoldButtonProps) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handlePress = () => {
    if (loading || disabled) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const heights: Record<string, number> = { sm: 40, md: 52, lg: 60 };
  const fontSizes: Record<string, number> = { sm: 13, md: 15, lg: 17 };

  const bg =
    variant === "primary"
      ? colors.gold
      : "transparent";
  const borderColor =
    variant === "outline" ? colors.gold : "transparent";
  const textColor =
    variant === "primary"
      ? colors.primaryForeground
      : colors.gold;

  return (
    <Animated.View style={[animatedStyle, fullWidth && { width: "100%" }]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.base,
          {
            backgroundColor: bg,
            borderColor,
            borderWidth: variant === "outline" ? 1.5 : 0,
            height: heights[size],
            borderRadius: colors.radius,
            opacity: disabled ? 0.5 : 1,
          },
          fullWidth && { width: "100%" },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={textColor} size="small" />
        ) : (
          <View style={styles.row}>
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text
              style={[styles.label, { color: textColor, fontSize: fontSizes[size] }]}
            >
              {label}
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
  },
});
