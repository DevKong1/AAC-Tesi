import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Companion from "./components/Companion";
import useFonts from "./hooks/useFonts";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

// This is the main layout of the app
// It wraps your pages with the providers they need
const RootLayout = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await useFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        {/*
          The Stack component displays the current page.
          It also allows you to configure your screens 
        */}
        <LinearGradient
          colors={["white", "white", "#FFEEEB"]}
          locations={[0, 0.4, 0.5]}
          style={{ flex: 1 }}
        >
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
            }}
          />
        </LinearGradient>
        <StatusBar />
        <Companion />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
