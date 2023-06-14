import { useEffect, useState } from "react";
import { BackHandler, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import BottomIcons from "../components/BottomIcons";
import PictogramCard from "../components/PictogramCard";
import Spinner from "../components/Spinner";
import { generateWhatsItGame } from "../hooks/gamesHandler";
import { useCompanionStore, usePictogramStore } from "../store/store";
import { shadowStyle } from "../utils/shadowStyle";
import { type WhatsItGameProperties } from "../utils/types/commonTypes";

export default function WhatsItPage() {
  const router = useRouter();
  const companionStore = useCompanionStore();
  const pictogramStore = usePictogramStore();

  const { category } = useLocalSearchParams();

  const [game, setGame] = useState({
    pictograms: [] as string[],
  } as WhatsItGameProperties);
  const [guess, setGuess] = useState(undefined as string | undefined);

  const generateGame = async () => {
    const game = await generateWhatsItGame(category);

    companionStore.setPosition("center");
    companionStore.speak(game?.text, "top");
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

  const playerGuess = (guess: string) => {
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
            className="h-full w-1/2 border border-transparent"
          >
            <Image
              style={{
                backgroundColor: "white",
                resizeMode: "contain",
              }}
              className="h-full w-full"
              source={game.picture}
              alt="Immagine usata nel quiz"
            />
          </View>
          <View className="flex h-full w-1/4 flex-col items-center justify-center">
            <Text className="text-default text-base font-semibold lg:text-2xl">
              Risposta:
            </Text>
            <PictogramCard
              pictogram={pictogramStore.getPictogram(game.answer)}
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
                pictogram={pictogramStore.getPictogram("2806")}
                text="Esci"
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
          Indovina cosa c&apos;è nell&apos;immagine!
        </Text>
      </View>
      <View className="flex h-[93%] w-full flex-col justify-center">
        <View className="flex h-1/2 w-full flex-row">
          {game.pictograms.slice(0, 4).map((pic) => (
            <View className="m-auto h-[90%] w-1/4" key={`row1_${pic}`}>
              <PictogramCard
                pictogram={pictogramStore.getPictogram(pic)}
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
              pictogram={pictogramStore.getPictogram(game.pictograms[4]!)}
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
                // JUST FOR DEVELOPMENT
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
          <View className="h-full w-1/4">
            <PictogramCard
              pictogram={pictogramStore.getPictogram(game.pictograms[5]!)}
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
