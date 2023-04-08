import React, { useEffect } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import dictionary from "../assets/dictionaries/Dizionario_it.json";
import BottomIcons from "./components/BottomIcons";
import PictogramCard from "./components/PictogramCard";
import { useCompanionStore } from "./store/store";
import { isDeviceLarge } from "./utils/commonFunctions";
import { type Pictogram } from "./utils/types/commonTypes";

const Index = () => {
  const companionStore = useCompanionStore();
  const dictionaryArray = dictionary as Pictogram[];
  const router = useRouter();

  const fontSize = isDeviceLarge() ? 42 : 22;

  useEffect(() => {
    companionStore.speak("Benvenuto, Giacomo!", isDeviceLarge() ? "3xl" : "lg");
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
          <View className="flex h-[66%] w-[33%]">
            <PictogramCard
              pictogram={dictionaryArray.find((el) => (el._id = 23392))}
              fontSize={fontSize}
              bgcolor="#C6D7F9"
              text="Giochiamo"
              onPress={() => router.push("/views/GamesPage")}
            />
          </View>
          <View className="flex h-[66%] w-[33%]">
            <PictogramCard
              pictogram={dictionaryArray.find((el) => (el._id = 28643))}
              fontSize={fontSize}
              bgcolor="#B9D2C3"
              text="Leggiamo"
              onPress={() => router.push("/views/ReadingPage")}
            />
          </View>
          <View className="flex h-[66%] w-[33%]">
            <PictogramCard
              pictogram={dictionaryArray.find((el) => (el._id = 28663))}
              fontSize={fontSize}
              bgcolor="#EBDBD8"
              text="Parliamo"
              onPress={() => router.push("/views/TalkingPage")}
            />
          </View>
        </View>
        <BottomIcons />
      </View>
    </SafeAreaView>
  );
};

export default Index;
