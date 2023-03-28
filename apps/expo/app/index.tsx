import React, { useEffect } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import BottomIcons from "./components/BottomIcons";
import MenuCard from "./components/MenuCard";
import { useCompanionStore } from "./store/store";

const Index = () => {
  const companionStore = useCompanionStore();
  const router = useRouter();

  const iconSize = 160;
  const fontSize = 42;

  useEffect(() => {
    companionStore.speak("Benvenuto, Giacomo!", "3xl");
  }, []);

  //TODO RESPONSIVE
  return (
    <SafeAreaView>
      <View className="flex h-full w-full p-4">
        <View className="flex flex-row">
          <Text className="font-logo text-default pr-4 text-9xl">PictoAI</Text>
          <Image
            source={require("../assets/images/logo.png")}
            className="h-[98px] w-[98px]"
            alt="University of Bologna Logo"
          />
        </View>
        <View className="mx-auto flex flex-grow flex-row items-center justify-center pb-24">
          <View className="flex h-3/5 w-[28%]">
            <MenuCard
              text="Giochiamo"
              fontSize={fontSize}
              bgcolor="#C6D7F9"
              onPress={() => router.push("/views/GamesPage")}
              icon={
                <MaterialIcons
                  name="videogame-asset"
                  size={iconSize}
                  color="#5C5C5C"
                />
              }
            />
          </View>
          <View className="w-8" />
          <View className="flex h-3/5 w-[28%]">
            <MenuCard
              text="Leggiamo"
              fontSize={fontSize}
              bgcolor="#B9D2C3"
              onPress={() => router.push("/views/board")}
              icon={
                <MaterialIcons
                  name="menu-book"
                  size={iconSize}
                  color="#5C5C5C"
                />
              }
            />
          </View>
          <View className="w-8" />
          <View className="flex h-3/5 w-[28%]">
            <MenuCard
              text="Parliamo"
              fontSize={fontSize}
              bgcolor="#EBDBD8"
              onPress={() => router.push("/views/board")}
              icon={
                <MaterialIcons
                  name="record-voice-over"
                  size={iconSize}
                  color="#5C5C5C"
                />
              }
            />
          </View>
        </View>
        <BottomIcons />
      </View>
    </SafeAreaView>
  );
};

export default Index;
