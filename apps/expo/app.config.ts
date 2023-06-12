import { type ConfigContext, type ExpoConfig } from "@expo/config";

const defineConfig = (_ctx: ConfigContext): ExpoConfig => ({
  name: "PictoAI",
  slug: "PictoAI",
  scheme: "PictoAI",
  version: "1.0.0",
  orientation: "landscape",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#1F104A",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "your.bundle.identifier",
    infoPlist: {
      RCTAsyncStorageExcludeFromBackup: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#1F104A",
    },
    allowBackup: true,
  },
  extra: {
    eas: {
      projectId: "your-project-id",
    },
    PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.PUBLIC_CLERK_PUBLISHABLE_KEY,
    PUBLIC_HUGGINGFACE_BEARER: process.env.PUBLIC_HUGGINGFACE_BEARER,
  },
  plugins: ["./expo-plugins/with-modify-gradle.js"],
});

export default defineConfig;
