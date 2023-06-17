import React, { useEffect } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

import BottomIcons from "./components/BottomIcons";
import PictogramCard from "./components/PictogramCard";
import { useCompanionStore, usePictogramStore } from "./store/store";
import { isDeviceLarge } from "./utils/commonFunctions";

const Index = () => {
  const pictogramStore = usePictogramStore();
  const companionStore = useCompanionStore();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!companionStore.started) companionStore.start();
    companionStore.speak(
      user?.firstName ? `Benvenuto, ${user?.firstName}!` : "Benvenuto!",
      isDeviceLarge() ? "3xl" : "lg",
    );
  }, []);

  //TODO RESPONSIVE
  return (
    <SafeAreaView>
      <View className="flex h-full w-full p-4">
        <View className="flex flex-row">
          <Text className="font-logo text-default pr-4 text-4xl lg:text-9xl">
            PictoAI
          </Text>
          <Image
            source={require("../assets/images/logo.png")}
            className=" h-10 w-10 lg:h-[98px] lg:w-[98px]"
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
