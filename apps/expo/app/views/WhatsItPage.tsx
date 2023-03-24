import { useEffect, useState } from "react";
import { Image, Text, View, type ImageSourcePropType } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQueries } from "@tanstack/react-query";

import BottomIcons from "../components/BottomIcons";
import { generateWhatsItGame } from "../hooks/gamesHandles";
import { useCompanionStore } from "../store/store";
import pictograms from "../utils/pictograms";
import {
  type Pictogram,
  type WhatsItGameProperties,
} from "../utils/types/commonTypes";

/* async function fetchPictogram(id: number) {
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

  const fontSize = 32;
  const cardWidth = "25%";
  const cardHeight = "80%";

  useEffect(() => {
    const generateGame = async () => {
      const game = await generateWhatsItGame();

      // set state with the result
      setGame(game);
    };
    generateGame().catch((err) => console.log("useEffect: " + err));
    companionStore.speak("A", "3xl");
  }, []);

  /* const userQueries = useQueries({
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
      <View className="flex h-full w-full flex-col justify-center">
        <View className="h-1/6 w-full flex-row justify-center">
          <Text className="text-default text-4xl font-semibold">
            Inovina cosa c'è nell'immagine!
          </Text>
        </View>
        <View className="flex h-5/6 w-full flex-col justify-center">
          <View className="flex h-1/2 w-full flex-row">
            <Image source={pictograms[game.pictograms[0]?._id]}></Image>
          </View>
        </View>
      </View>
      <BottomIcons />
    </SafeAreaView>
  );
}
