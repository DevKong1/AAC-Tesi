import React, { useEffect } from "react";
import { Alert, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";

import BottomIcons from "./components/BottomIcons";
import PictogramCard from "./components/PictogramCard";
import { getUser } from "./hooks/useBackend";
import {
  useApiStore,
  useCompanionStore,
  useDiaryStore,
  usePictogramStore,
} from "./store/store";
import { parseDiary } from "./utils/backendParsers";
import { isDeviceLarge } from "./utils/commonFunctions";

const Index = () => {
  const apiStore = useApiStore();
  const pictogramStore = usePictogramStore();
  const diaryStore = useDiaryStore();
  const companionStore = useCompanionStore();
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const loadAll = async () => {
      const token = await getToken();
      if (token) {
        const dbUser = await getUser(token);
        if (!dbUser) {
          Alert.alert("Error connecting to Backend!");
          return;
        }
        diaryStore.load(parseDiary(dbUser.diary));
      }
    };

    if (!apiStore.loaded) {
      companionStore.start();
      loadAll();
    }

    companionStore.speak(
      user?.firstName ? `Benvenuto, ${user?.firstName}!` : "Benvenuto!",
      isDeviceLarge() ? "3xl" : "lg",
    );
  }, []);

  return (
    <SafeAreaView>
      <View className="flex h-full w-full p-4">
        <View className="flex flex-row">
          <Text className="font-logo text-default pr-4 text-4xl lg:text-9xl">
            PictoAI
          </Text>
          <Image
            source={require("../assets/images/logo.png")}
            className="h-10 w-10 lg:h-[98px] lg:w-[98px]"
            alt="University of Bologna Logo"
          />
        </View>
        <View className="mx-auto flex flex-grow flex-row items-center justify-center">
          <View className="flex h-[66%] w-[25%]">
            <PictogramCard
              pictogram={pictogramStore.getPictogram("23392")}
              bgcolor="#C6D7F9"
              text="Giochiamo"
              onPress={() => router.push("/views/GamesPage")}
            />
          </View>
          <View className="flex h-[66%] w-[25%]">
            <PictogramCard
              pictogram={pictogramStore.getPictogram("28643")}
              bgcolor="#B9D2C3"
              text="Leggiamo"
              onPress={() => router.push("/views/ReadingPage")}
            />
          </View>
          <View className="flex h-[66%] w-[25%]">
            <PictogramCard
              pictogram={pictogramStore.getPictogram("28663")}
              bgcolor="#EBDBD8"
              text="Parliamo"
              onPress={() => router.push("/views/TalkingPage")}
            />
          </View>
          <View className="flex h-[66%] w-[25%]">
            <PictogramCard
              pictogram={pictogramStore.getPictogram("2359")}
              bgcolor="#D9D9FD"
              text="Diario"
              onPress={() => router.push("/views/DiaryPage")}
            />
          </View>
        </View>
        <BottomIcons />
      </View>
    </SafeAreaView>
  );
};

export default Index;
