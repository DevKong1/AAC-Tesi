import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import BottomIcons from "../components/BottomIcons";
import PictogramCard from "../components/PictogramCard";
import { getPictogram } from "../hooks/pictogramsHandler";
import {
  useCompanionStore,
  useDiaryStore,
  useInputStore,
} from "../store/store";
import { isDeviceLarge } from "../utils/commonFunctions";
import { shadowStyle } from "../utils/shadowStyle";
import { type DiaryPage } from "../utils/types/commonTypes";

export default function DiaryPage() {
  const router = useRouter();
  const companionStore = useCompanionStore();
  const diaryStore = useDiaryStore();
  const inputStore = useInputStore();

  const today = new Date();
  const [currentPage, setPage] = useState(undefined as DiaryPage | undefined);

  const iconSize = isDeviceLarge() ? 90 : 42;
  const iconColor = "#5C5C5C";

  const loadPage = async (date: string) => {
    let loadedPage = diaryStore.getDiaryPage(date);
    if (!loadedPage) {
      loadedPage = {
        date: today.toLocaleDateString(),
        pictograms: [],
      } as DiaryPage;
      // await storageStore.addDiaryPage(loadedPage);
    }
    companionStore.speak("Guardiamo il tuo diario!");
    setPage(loadedPage);
  };

  const checkForInput = () => {
    console.log(inputStore.id);
  };

  useEffect(() => {
    // In case of reload
    loadPage(today.toLocaleDateString()).catch((err) => console.log(err));
    checkForInput();
  }, [inputStore.inputPictograms]);

  if (!currentPage)
    return (
      <SafeAreaView className="h-full w-full items-center justify-center">
        <ActivityIndicator size="large" color="#f472b6" />
        <Text className="text-default py-4 text-xs">Caricamento...</Text>
      </SafeAreaView>
    );

  function addParagraph(): void {
    if (currentPage) {
      router.push({
        pathname: "/views/TalkingPage",
        params: {
          inputID: `${currentPage.date};${currentPage.pictograms.length}`,
        },
      });
    }
  }

  return (
    <SafeAreaView className="h-full w-full flex-col">
      <View
        style={shadowStyle.heavy}
        className="bg-purpleCard flex h-[15%] w-full flex-row items-center justify-center rounded-xl"
      >
        <View className="flex h-full w-[8%] items-start justify-center">
          {diaryStore.getPreviousPage(currentPage.date) && (
            <TouchableOpacity className="ml-[10px] h-full w-full justify-center">
              <MaterialIcons
                name="arrow-back-ios"
                size={iconSize}
                color={iconColor}
              />
            </TouchableOpacity>
          )}
        </View>
        <View className="flex h-full w-[84%] flex-row items-center justify-center">
          <TouchableOpacity className="flex h-full w-full flex-row items-center justify-center">
            <Text className="text-default pr-2 text-base font-semibold">
              {currentPage.date}
            </Text>
            <MaterialIcons
              name="calendar-today"
              size={iconSize / 2}
              color={iconColor}
            />
          </TouchableOpacity>
        </View>
        <View className="flex h-full w-[8%] items-end justify-center">
          {diaryStore.getNextPage(currentPage.date) && (
            <TouchableOpacity className="h-full w-full justify-center">
              <MaterialIcons
                name="arrow-forward-ios"
                size={iconSize}
                color={iconColor}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ScrollView className="flex h-[85%] w-full">
        <View
          className={`flex ${
            isDeviceLarge() ? "h-64 w-64" : "h-32 w-32"
          } items-center justify-center`}
        >
          <PictogramCard
            pictogram={getPictogram(38218)}
            text="Nuova riga"
            bgcolor="#89BF93"
            onPress={addParagraph}
          />
        </View>
      </ScrollView>
      <BottomIcons />
    </SafeAreaView>
  );
}
