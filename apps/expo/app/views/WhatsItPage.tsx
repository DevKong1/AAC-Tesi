import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQueries } from "@tanstack/react-query";

import {
  type Pictogram,
  type WhatsItGameProperties,
} from "../../src/types/commonTypes";
import BottomIcons from "../components/BottomIcons";
import { generateWhatsItGame } from "../hooks/gamesHandles";
import { useCompanionStore } from "../store/store";

async function fetchPictogram(id: number) {
  try {
    const res = await fetch(
      `exp://26.114.23.199:19000/assets/pictograms/img_${id}`,
    );
    return res.blob();
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

export default function WhatsItPage() {
  const [game, setGame] = useState({} as WhatsItGameProperties);
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

  const userQueries = useQueries({
    queries: game.pictograms?.map((pic) => {
      return {
        queryKey: ["pictograms", pic._id],
        queryFn: () => fetchPictogram(pic._id),
        enabled: game.pictograms && game.pictograms.length > 0,
      };
    }),
  });

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
            <Text>{game.id}</Text>
          </View>
        </View>
      </View>
      <BottomIcons />
    </SafeAreaView>
  );
}
