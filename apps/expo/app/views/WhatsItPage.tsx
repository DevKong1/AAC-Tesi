import { useEffect, useState } from "react";
import { BackHandler, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import { randomUUID } from "expo-crypto";
import { useLocalSearchParams, useRouter } from "expo-router";

import BottomIcons from "../components/BottomIcons";
import PictogramCard from "../components/PictogramCard";
import Spinner from "../components/Spinner";
import { requestWhatsItGame } from "../hooks/useHuggingFace";
import { useCompanionStore, usePictogramStore } from "../store/store";
import { dummyGame } from "../utils/dummyResponses";
import { shadowStyle } from "../utils/shadowStyle";
import { type WhatsItGameProperties } from "../utils/types/commonTypes";

export default function WhatsItPage() {
  const router = useRouter();
  const companionStore = useCompanionStore();
  const pictogramStore = usePictogramStore();

  const { category } = useLocalSearchParams();

  const successSound = require("../../assets/success.mp3");
  const failureSound = require("../../assets/failure.mp3");
  const [sound, setSound] = useState(undefined as Audio.Sound | undefined);
  const [game, setGame] = useState({
    pictograms: [] as string[],
  } as WhatsItGameProperties);
  const [guess, setGuess] = useState(undefined as string | undefined);

  const generateGame = async () => {
    const generatedGame = await requestWhatsItGame(category);
    const newGame = generatedGame
      ? ({
          id: randomUUID(),
          text: generatedGame.text,
          pictograms: generatedGame.pictograms,
          answer: generatedGame.answer,
          picture: generatedGame.picture,
          isGenerated: true, // Just for development
        } as WhatsItGameProperties)
      : dummyGame;

    // Set state with the result or Dummy Game
    setGame(newGame);

    companionStore.speak(newGame.text, "top");
  };

  const playSound = async (success: boolean) => {
    const { sound } = await Audio.Sound.createAsync(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      success ? successSound : failureSound,
    );
    setSound(sound);
    await sound.playAsync();
  };

  const playerGuess = async (guess: string) => {
    companionStore.speak(
      guess == game.answer
        ? "Yaaay!\nHai indovinato!"
        : "Purtroppo hai sbagliato!",
    );
    setGuess(guess);
    await playSound(guess == game.answer);
  };

  useEffect(() => {
    companionStore.hideAll();
    // In case of reload
    if (!guess) generateGame().catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        companionStore.resetSpeech();
        companionStore.showAll();
        router.back();
        return true;
      },
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Error Screen
  if (game.pictograms.length != 4) {
    return (
      <SafeAreaView>
        <Spinner />
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
            className="h-full w-1/3 border border-transparent"
          >
            <Image
              style={{
                backgroundColor: "white",
                resizeMode: "cover",
              }}
              className="h-full w-full"
              source={game.picture}
              alt="Immagine usata nel quiz"
            />
          </View>
          {guess != game.answer && (
            <View className="ml-6 flex h-full w-1/4 flex-col content-center justify-center">
              <View className="flex h-[20%] w-full items-center justify-center">
                <Text className="text-default text-base font-semibold lg:text-2xl">
                  Risposta:
                </Text>
              </View>
              <View className="flex h-[80%] w-full content-center items-center justify-center">
                <PictogramCard
                  radius={30}
                  pictogram={pictogramStore.getPictogram(game.answer)}
                  onPress={() => null}
                />
              </View>
            </View>
          )}
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
                radius={30}
                pictogram={pictogramStore.getPictogram("37162")}
                text="Gioca ancora"
                bgcolor="#FFFFCA"
                onPress={async () => {
                  await generateGame();
                  setGuess(undefined);
                }}
              />
            </View>
            <View className="flex h-full w-1/4 items-center justify-center">
              <PictogramCard
                radius={30}
                pictogram={pictogramStore.getPictogram("2806")}
                text="Esci"
                bgcolor="#F69898"
                onPress={() => {
                  companionStore.resetSpeech();
                  companionStore.showAll();
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
    <SafeAreaView className="flex h-full w-full flex-col content-center justify-center">
      <View className="h-[12%] w-full flex-row content-center justify-center">
        <Text className="text-default text-lg font-semibold lg:text-4xl">
          Indovina cosa c&apos;è nell&apos;immagine!
        </Text>
      </View>
      <View className="flex h-[88%] w-full flex-col content-center items-center justify-center">
        <View className="flex h-1/2 w-full content-center items-center justify-center pb-6 lg:pb-24">
          <View
            style={shadowStyle.light}
            className="flex h-full w-1/3 content-center justify-center border border-transparent"
          >
            <Image
              style={{
                backgroundColor: "white",
                resizeMode: "cover",
              }}
              className="h-full w-full"
              source={
                game.isGenerated
                  ? {
                      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                      uri: "data:image/jpeg;base64," + game.picture,
                    }
                  : game.picture
              }
              alt="Immagine del quiz"
            />
          </View>
        </View>
        <View className="flex h-1/2 w-full flex-row content-center justify-center">
          {game.pictograms.slice(0, 4).map((pic) => (
            <View
              className="flex h-[90%] w-1/4 flex-row content-center justify-center"
              key={`row1_${pic} `}
            >
              <PictogramCard
                radius={30}
                pictogram={pictogramStore.getPictogram(pic)}
                onPress={playerGuess}
                args={pic}
              />
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
