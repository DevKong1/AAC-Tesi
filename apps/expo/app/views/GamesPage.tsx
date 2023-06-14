import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import BottomIcons from "../components/BottomIcons";
import CategoryTabs from "../components/CategoryTab";
import PictogramCard from "../components/PictogramCard";
import { useCompanionStore, usePictogramStore } from "../store/store";
import categories from "../utils/categories";
import { isDeviceLarge } from "../utils/commonFunctions";

export default function GamesPage() {
  const pictogramStore = usePictogramStore();
  const router = useRouter();
  const [selectedCategory, setCategory] = useState("Tutto");

  const companionStore = useCompanionStore();

  useEffect(() => {
    companionStore.speak(
      "Evvaiiiii giochiamo! \nScegli a cosa vuoi giocare",
      isDeviceLarge() ? "top" : "left",
    );
  }, []);

  return (
    <SafeAreaView>
      <View className="flex h-full w-full flex-col justify-center">
        <View className="h-1/5">
          <CategoryTabs
            selectedCategory={selectedCategory}
            categories={categories}
            setCategory={setCategory}
          />
        </View>
        <View className="mx-auto flex h-4/5 flex-row items-center justify-center">
          <View className="flex h-4/5 w-1/4">
            <PictogramCard
              pictogram={pictogramStore.getPictogram("2680")}
              bgcolor="#C6D7F9"
              text="Che cos’è??"
              onPress={() =>
                router.push({
                  pathname: "/views/WhatsItPage",
                  params: {
                    category: selectedCategory,
                  },
                })
              }
            />
          </View>
        </View>
      </View>
      <BottomIcons />
    </SafeAreaView>
  );
}
