import { useEffect, useState } from "react";
import { BackHandler, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import BottomIcons from "../components/BottomIcons";
import CategoryTabs from "../components/CategoryTab";
import PictogramCard from "../components/PictogramCard";
import {
  useCategoryStore,
  useCompanionStore,
  usePictogramStore,
} from "../store/store";
import { isDeviceLarge } from "../utils/commonFunctions";

export default function GamesPage() {
  const companionStore = useCompanionStore();
  const categoryStore = useCategoryStore();
  const pictogramStore = usePictogramStore();
  const router = useRouter();

  const [selectedGamePath, setGamePath] = useState("");
  const [selectedCategory, selectCategory] = useState(
    categoryStore.defaultCategory,
  );

  const setCategory = (category: string) => {
    selectCategory(category == selectedCategory ? undefined : category);
  };

  useEffect(() => {
    companionStore.speak(
      "Evvaiiiii giochiamo! \nScegli a cosa vuoi giocare",
      isDeviceLarge() ? "top" : "left",
    );
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (selectedGamePath != "") {
          setGamePath("");
        } else {
          companionStore.resetSpeech();
          router.back();
        }
        return true;
      },
    );

    return () => backHandler.remove();
  }, [selectedGamePath]);

  const selectedTab = () => {
    switch (selectedGamePath) {
      case "/views/WhatsItPage":
        return (
          <View className="flex h-full w-full flex-col items-center justify-start">
            <View className="flex h-1/3 w-full items-center justify-center">
              <View className="h-1/3 w-full items-center justify-center">
                <Text className="text-default font-text text-base">
                  Seleziona una categoria (facoltativo):
                </Text>
              </View>
              <View className="flex h-2/3 w-full items-center justify-center">
                <CategoryTabs
                  selectedCategory={selectedCategory}
                  categories={categoryStore.currentCategories}
                  setCategory={setCategory}
                />
              </View>
            </View>
            <View className="flex h-2/3 w-full flex-col items-center justify-center">
              <View className="h-4/5 w-1/5 items-center justify-center">
                <PictogramCard
                  pictogram={pictogramStore.getPictogram("5431")}
                  bgcolor="#89BF93"
                  onPress={() =>
                    router.push({
                      pathname: selectedGamePath,
                      params: {
                        category: selectedCategory,
                      },
                    })
                  }
                />
              </View>
            </View>
          </View>
        );
      default:
        return (
          <View className="mx-auto flex h-4/5 flex-row items-center justify-center">
            <View className="flex h-4/5 w-1/4">
              <PictogramCard
                pictogram={pictogramStore.getPictogram("2680")}
                bgcolor="#C6D7F9"
                text="Che cos’è??"
                onPress={() => setGamePath("/views/WhatsItPage")}
              />
            </View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView>
      <View className="flex h-full w-full flex-col justify-center">
        {selectedTab()}
      </View>
      <BottomIcons />
    </SafeAreaView>
  );
}
