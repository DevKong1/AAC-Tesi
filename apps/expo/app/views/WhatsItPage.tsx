import { useEffect, useState } from "react";
import { BackHandler, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import BottomIcons from "../components/BottomIcons";
import PictogramCard from "../components/PictogramCard";
import { generateWhatsItGame } from "../hooks/gamesHandler";
import { getPictogram } from "../hooks/pictogramsHandler";
import { useCompanionStore } from "../store/store";
import { isDeviceLarge } from "../utils/commonFunctions";
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

  const fontSize = isDeviceLarge() ? 26 : 16;

  const generateGame = async () => {
    const game = await generateWhatsItGame();

    companionStore.setPosition("gamesPage");
    companionStore.speak(game.text, "top");
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

  const playerGuess = (guess: Pictogram) => {
    companionStore.setPosition("default");
    companionStore.speak(
      guess._id == game.answer
        ? "Yaaay!\nHai indovinato!"
        : "Purtroppo non era la risposta giusta!",
    );
    setGuess(guess._id);
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
      <SafeAreaView className="flex h-full w-full flex-col">
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
            <Text className="text-default text-base font-semibold lg:text-2xl">
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
        <View className=" flex h-[60%] w-full flex-col justify-center pb-4 lg:pb-16">
          <View className="flex h-1/4 w-full items-center justify-center">
            <Text className="text-default text-base font-semibold lg:text-3xl">
              {guess == game.answer
                ? "Complimenti hai indovinato!"
                : "Purtroppo non hai indovinato!"}
            </Text>
          </View>
          <View className=" flex h-3/4 w-full flex-row items-center justify-center">
            <View className="flex h-full w-1/4 items-center justify-center">
              <PictogramCard
                pictogram={getPictogram(37162)}
                text="Gioca ancora"
                fontSize={fontSize}
                bgcolor="#FFFFCA"
                onPress={async () => {
                  await generateGame();
                  setGuess(undefined);
                }}
              />
            </View>
            <View className="flex h-full w-1/4 items-center justify-center">
              <PictogramCard
                pictogram={getPictogram(2806)}
                text="Esci"
                fontSize={fontSize}
                bgcolor="#F69898"
                onPress={() => {
                  companionStore.setPosition("default");
                  router.back();
                }}
              />
            </View>
          </View>
        </View>
        <BottomIcons />
      </SafeAreaView>
    );
  }

  // Main Game Screen
  return (
    <SafeAreaView className="flex h-full w-full flex-col justify-center">
      <View className="h-[7%] w-full flex-row justify-center">
        <Text className="text-default text-lg font-semibold lg:text-4xl">
          Inovina cosa c'è nell'immagine!
        </Text>
      </View>
      <View className="flex h-[93%] w-full flex-col justify-center">
        <View className="flex h-1/2 w-full flex-row">
          {game.pictograms.slice(0, 4).map((pic) => (
            <View className="m-auto h-[90%] w-1/4" key={pic._id}>
              <PictogramCard
                pictogram={pic}
                fontSize={fontSize}
                bgcolor="#C6D7F9"
                onPress={playerGuess}
                args={pic}
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
              args={game.pictograms[4]!}
            />
          </View>
          <View className=" flex w-1/2 items-center justify-center pb-6 lg:pb-24">
            <View
              style={shadowStyle.light}
              className="h-full w-5/6 border border-transparent lg:w-full"
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
          <View className="h-full w-1/4">
            <PictogramCard
              pictogram={game.pictograms[5]!}
              fontSize={fontSize}
              bgcolor="#C6D7F9"
              onPress={playerGuess}
              args={game.pictograms[5]!}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
