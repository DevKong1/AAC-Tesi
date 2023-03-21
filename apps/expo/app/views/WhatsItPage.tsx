import { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { type Pictogram } from "../../src/types/commonTypes";
import BottomIcons from "../components/BottomIcons";
import { useCompanionStore } from "../store/store";

export default function WhatsItPage() {
  const companionStore = useCompanionStore();
  const fontSize = 32;
  const cardWidth = "25%";
  const cardHeight = "80%";

  useEffect(() => {
    companionStore.speak("A", "3xl");
  }, []);

  return (
    <SafeAreaView>
      <View className="flex h-full w-full flex-col justify-center">
        <View>
          <View className="h-1/6 w-full flex-row justify-center">
            <Text className="text-default text-4xl font-semibold">
              Inovina cosa c'è nell'immagine!
            </Text>
          </View>
          <View className="flex h-5/6 w-full flex-row justify-center"></View>
        </View>
      </View>
      <BottomIcons />
    </SafeAreaView>
  );
}
