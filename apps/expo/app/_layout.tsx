/* eslint-disable @typescript-eslint/require-await */
import React, { useCallback, useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";

import getEnvVars from "../enviroment";
import Companion from "./components/Companion";
import SignInWithOAuth from "./components/SignInWithOAuth";
import useFonts from "./hooks/useFonts";
import { useBookStore, useDiaryStore } from "./store/store";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// This is the main layout of the app
// It wraps your pages with the providers they need
const RootLayout = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  const diaryStore = useDiaryStore();
  const bookStore = useBookStore();
  const windowHeight = useWindowDimensions().height;

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // eslint-disable-next-line react-hooks/rules-of-hooks
        await useFonts();
        await diaryStore.load();
        await bookStore.load();
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

  // Used to cache Clerk Token
  const tokenCache = {
    async getToken(key: string) {
      try {
        return SecureStore.getItemAsync(key);
      } catch (err) {
        return null;
      }
    },

    async saveToken(key: string, value: string) {
      try {
        return SecureStore.setItemAsync(key, value);
      } catch (err) {
        return;
      }
    },
  };

  if (!appIsReady) {
    return null;
  }

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={getEnvVars().CLERK_PUBLISHABLE_KEY}
    >
      <SafeAreaProvider
        onLayout={onLayoutRootView}
        style={[{ minHeight: Math.round(windowHeight) }]}
      >
        {/*
          The Stack component displays the current page.
          It also allows you to configure your screens 
        */}
        <LinearGradient
          colors={["white", "white", "#FFEEEB"]}
          locations={[0, 0.4, 0.5]}
          style={{ flex: 1 }}
        >
          <SignedIn>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "transparent" },
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignInWithOAuth />
          </SignedOut>
        </LinearGradient>
        <StatusBar />
        <Companion />
      </SafeAreaProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
