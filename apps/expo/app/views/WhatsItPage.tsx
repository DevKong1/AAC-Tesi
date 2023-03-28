import { useEffect, useState } from "react";
import { BackHandler, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import BottomIcons from "../components/BottomIcons";
import MenuCard from "../components/MenuCard";
import PictogramCard from "../components/PictogramCard";
import { generateWhatsItGame } from "../hooks/gamesHandler";
import { useCompanionStore } from "../store/store";
import { shadowStyle } from "../utils/shadowStyle";
import {
  type Pictogram,
  type WhatsItGameProperties,
} from "../utils/types/commonTypes";

/* 
    If we want to get the pictograms from a webserver:

    async function fetchPictogram(id: number) {
    try {
      console.log(id);
      const res = await fetch(
        `exp://26.114.23.199:19000/assets/pictograms/img_${id}.png`,
      );
      return res.blob();
    } catch (err) {
      console.log(err);
      return null;
    }
  } */

export default function WhatsItPage() {
  const router = useRouter();
  const [game, setGame] = useState({
    pictograms: [] as Pictogram[],
  } as WhatsItGameProperties);
  const [guess, setGuess] = useState(undefined as number | undefined);
  const companionStore = useCompanionStore();

  const fontSize = 26;
  const iconSize = 160;
  const iconFontSize = 42;

  const generateGame = async () => {
    const game = await generateWhatsItGame();

    companionStore.setPosition("gamesPage");
    companionStore.speak(game.text, "3xl", "top");
    // set state with the result
    setGame(game);
  };

  useEffect(() => {
    // In case of reload
    if (!guess) generateGame().catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        companionStore.setPosition("default");
        router.back();
        return true;
      },
    );

    return () => backHandler.remove();
  }, []);

  const playerGuess = (guess: number) => {
    companionStore.setPosition("default");
    companionStore.speak(
      guess == game.answer
        ? "Yaaay!\nHai indovinato!"
        : "Purtroppo non era la risposta giusta!",
    );
    setGuess(guess);
  };

  /*   
    const userQueries = useQueries({
    queries: game.pictograms.map((pic) => {
      return {
        queryKey: ["pictograms", pic._id],
        queryFn: () => fetchPictogram(pic._id),
        enabled: !!pic._id,
        staleTime: Infinity,
      };
    }),
  }); */

  // Error Screen
  if (game.pictograms.length != 6) {
    return (
      <SafeAreaView>
        <View className="flex h-full w-full justify-center">
          <Text className="text-default m-auto text-4xl font-semibold">
            Caricamento...
          </Text>
        </View>
        <BottomIcons />
      </SafeAreaView>
    );
  }

  // Ended Game Screen
  if (guess) {
    return (
      <SafeAreaView>
        <View className="flex h-full w-full flex-col">
          <View className="flex h-[40%] w-full flex-row justify-center">
            <View
              style={shadowStyle.light}
              className="h-full w-1/2 border border-transparent"
            >
              <Image
                style={{
                  backgroundColor: "white",
                  resizeMode: "contain",
                }}
                className="h-full w-full"
                source={game.picture}
              />
            </View>
            <View className="flex h-full w-1/4 flex-col items-center justify-center">
              <Text className="text-default text-2xl font-semibold">
                Risposta:
              </Text>
              <PictogramCard
                pictogram={game.pictograms.find((el) => el._id == game.answer)!}
                fontSize={fontSize}
                bgcolor="#C6D7F9"
                onPress={() => null}
              />
            </View>
          </View>
          <View className="flex h-[60%] w-full flex-col justify-center pb-16">
            <View className="flex h-1/4 w-full items-center justify-center">
              <Text className="text-default text-3xl font-semibold">
                {guess == game.answer
                  ? "Complimenti hai indovinato!"
                  : "Purtroppo non hai indovinato!"}
              </Text>
            </View>
            <View className="flex h-3/4 w-full flex-row items-center justify-center ">
              <View className="flex h-full w-1/4 items-center justify-center">
                <MenuCard
                  text="Gioca ancora"
                  fontSize={iconFontSize}
                  bgcolor="#FFFFCA"
                  onPress={async () => {
                    await generateGame();
                    setGuess(undefined);
                  }}
                  icon={
                    <MaterialIcons
                      name="refresh"
                      size={iconSize}
                      color="#5C5C5C"
                    />
                  }
                />
              </View>
              <View className="w-8" />
              <View className="flex h-full w-1/4 items-center justify-center">
                <MenuCard
                  text="Esci"
                  fontSize={iconFontSize}
                  bgcolor="#F69898"
                  onPress={() => {
                    companionStore.setPosition("default");
                    router.back();
                  }}
                  icon={
                    <MaterialIcons
                      name="clear"
                      size={iconSize}
                      color="#5C5C5C"
                    />
                  }
                />
              </View>
            </View>
          </View>
        </View>
        <BottomIcons />
      </SafeAreaView>
    );
  }

  // Main Game Screen
  return (
    <SafeAreaView>
      <View className="flex h-full w-full flex-col justify-center">
        <View className="h-[7%] w-full flex-row justify-center">
          <Text className="text-default text-4xl font-semibold">
            Inovina cosa c'è nell'immagine!
          </Text>
        </View>
        <View className="flex h-[93%] w-full flex-col justify-center">
          <View className="flex h-1/2 w-full flex-row">
            {game.pictograms.slice(0, 4).map((pic) => (
              <View className="m-auto w-1/4" key={pic._id}>
                <PictogramCard
                  pictogram={pic}
                  fontSize={fontSize}
                  bgcolor="#C6D7F9"
                  onPress={playerGuess}
                />
              </View>
            ))}
          </View>
          <View className="flex h-1/2 w-full flex-row justify-center">
            <View className="flex h-full w-1/4 items-start">
              <PictogramCard
                pictogram={game.pictograms[4]!}
                fontSize={fontSize}
                bgcolor="#C6D7F9"
                onPress={playerGuess}
              />
            </View>
            <View className="flex w-1/2 items-center justify-center pb-24">
              <View
                style={shadowStyle.light}
                className="h-full w-full border border-transparent"
              >
                <Image
                  style={{
                    backgroundColor: "white",
                    resizeMode: "contain",
                  }}
                  className="h-full w-full"
                  source={game.picture}
                />
              </View>
            </View>
            <View className="w-1/4">
              <PictogramCard
                pictogram={game.pictograms[5]!}
                fontSize={fontSize}
                bgcolor="#C6D7F9"
                onPress={playerGuess}
              />
            </View>
          </View>
        </View>
      </View>
      <BottomIcons />
    </SafeAreaView>
  );
}
