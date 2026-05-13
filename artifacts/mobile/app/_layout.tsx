import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { PlayerProvider } from "@/context/PlayerContext";
import { MediaPlayerBar } from "@/components/MediaPlayerBar";

SplashScreen.preventAutoHideAsync();
SystemUI.setBackgroundColorAsync("#0A0A0A");

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0A0A0A" },
          headerTintColor: "#F5F5F0",
          headerTitleStyle: { fontFamily: "Inter_600SemiBold", color: "#F5F5F0" },
          contentStyle: { backgroundColor: "#0A0A0A" },
          headerBackTitle: "Back",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="artwork/[id]" options={{ headerShown: false, presentation: "card" }} />
        <Stack.Screen name="artist/[id]" options={{ headerShown: false, presentation: "card" }} />
        <Stack.Screen
          name="checkout"
          options={{ title: "Checkout", headerBackTitle: "Back" }}
        />
        <Stack.Screen
          name="payment-processing"
          options={{ title: "Processing", gestureEnabled: false, headerLeft: () => null }}
        />
        <Stack.Screen
          name="payment-success"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="payment-failed"
          options={{ title: "Payment Failed" }}
        />
        <Stack.Screen
          name="register-artist"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name="festival"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="living-art"
          options={{ headerShown: false, presentation: "fullScreenModal" }}
        />
        <Stack.Screen
          name="admin"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="auth"
          options={{ headerShown: false, presentation: "modal" }}
        />
      </Stack>
      <MediaPlayerBar />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CartProvider>
              <PlayerProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <KeyboardProvider>
                    <RootLayoutNav />
                  </KeyboardProvider>
                </GestureHandlerRootView>
              </PlayerProvider>
            </CartProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
