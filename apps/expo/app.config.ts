// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigContext, ExpoConfig } from "@expo/config";

const defineConfig = (_ctx: ConfigContext): ExpoConfig => ({
  name: "pictoai",
  slug: "pictoai",
  version: "1.0.0",
  scheme: "https",
  orientation: "landscape",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "pictoai",
    infoPlist: {
      RCTAsyncStorageExcludeFromBackup: false,
    },
  },
  android: {
    package: "com.unibo.pictoai",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#ffffff",
    },
    allowBackup: true,
  },
  extra: {
    huggingfaceBearer: process.env.HUGGINGFACE_BEARER,
    eas: {
      projectId: "54f2c5c2-fdf7-4aad-9c34-811de23d0762",
    },
  },
  plugins: ["./expo-plugins/with-modify-gradle.js"],
});

export default defineConfig;
