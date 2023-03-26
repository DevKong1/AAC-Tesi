import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BottomIcons from "../components/BottomIcons";
import PictogramCard from "../components/PictogramCard";
import { generateWhatsItGame } from "../hooks/gamesHandler";
import { useCompanionStore } from "../store/store";
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
  const [game, setGame] = useState({
    pictograms: [] as Pictogram[],
  } as WhatsItGameProperties);
  const companionStore = useCompanionStore();

  const fontSize = 26;

  useEffect(() => {
    const generateGame = async () => {
      const game = await generateWhatsItGame();

      // set state with the result
      setGame(game);
    };
    generateGame().catch((err) => console.log(err));
    companionStore.speak("A", "3xl");
  }, []);

  const playerGuess = (guess: number) => {
    return;
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

  return (
    <SafeAreaView>
      {game.pictograms && game.pictograms.length == 6 ? (
        <View className="flex h-full w-full flex-col justify-center">
          <View className="h-[10%] w-full flex-row justify-center">
            <Text className="text-default pt-4 text-4xl font-semibold">
              Inovina cosa c'è nell'immagine!
            </Text>
          </View>
          <View className="flex h-[90%] w-full flex-col justify-center">
            <View className="flex h-1/2 w-full flex-row justify-center">
              {game.pictograms.slice(0, 4).map((pic) => (
                <View className="w-1/4">
                  <PictogramCard
                    pictogram={pic}
                    fontSize={fontSize}
                    bgcolor="#C6D7F9"
                    onPress={playerGuess}
                    key={pic._id}
                  />
                </View>
              ))}
            </View>
            <View className="mb-20 flex h-1/2 w-full flex-row justify-center">
              <View className="h-full w-1/4">
                <PictogramCard
                  pictogram={game.pictograms[4]!}
                  fontSize={fontSize}
                  bgcolor="#C6D7F9"
                  onPress={playerGuess}
                />
              </View>
              <View className="w-1/2">
                <Image
                  className="h-full w-full object-contain"
                  source={game.picture}
                />
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
      ) : (
        <View className="flex h-full w-full justify-center">
          <Text className="text-default m-auto text-4xl font-semibold">
            Caricamento...
          </Text>
        </View>
      )}
      <BottomIcons />
    </SafeAreaView>
  );
}
