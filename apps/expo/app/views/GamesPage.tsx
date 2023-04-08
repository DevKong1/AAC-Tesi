import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import dictionary from "../../assets/dictionaries/Dizionario_it.json";
import BottomIcons from "../components/BottomIcons";
import CategoryTabs from "../components/CategoryTab";
import MenuCard from "../components/MenuCard";
import PictogramCard from "../components/PictogramCard";
import { useCompanionStore } from "../store/store";
import categories from "../utils/categories";
import { isDeviceLarge } from "../utils/commonFunctions";
import { Pictogram } from "../utils/types/commonTypes";

export default function GamesPage() {
  const router = useRouter();
  const dictionaryArray = dictionary as Pictogram[];
  const [selectedCategory, setCategory] = useState("Tutto");

  const companionStore = useCompanionStore();

  const fontSize = isDeviceLarge() ? 32 : 18;

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
              pictogram={dictionaryArray.find((el) => (el._id = 2680))}
              fontSize={fontSize}
              bgcolor="#C6D7F9"
              text="Che cos’è??"
              onPress={() => router.push("/views/WhatsItPage")}
            />
          </View>
        </View>
      </View>
      <BottomIcons />
    </SafeAreaView>
  );
}
/* 
OLD LAYOUT 
<View className="mx-auto flex h-2/5 flex-row items-center justify-center">
  <View className="flex h-4/5 w-1/4">
    <MenuCard
      text="A parole tue!"
      fontSize={fontSize}
      bgcolor="#C6D7F9"
      onPress={() => router.push("/views/GamesPage")}
      icon={
        <MaterialIcons
          name="videocam"
          size={iconSize}
          color={iconColor}
        />
      }
    />
  </View>
  <View className="w-8" />
  <View className="flex h-4/5 w-1/4">
    <MenuCard
      text="Che cos’è??"
      fontSize={fontSize}
      bgcolor="#C6D7F9"
      onPress={() => router.push("/views/WhatsItPage")}
      icon={
        <MaterialIcons
          name="photo-camera"
          size={iconSize}
          color={iconColor}
        />
      }
    />
  </View>
  <View className="w-8" />
  <View className="flex h-4/5 w-1/4">
    <MenuCard
      text="Crea una storia"
      fontSize={fontSize}
      bgcolor="#C6D7F9"
      onPress={() => router.push("/views/GamesPage")}
      icon={
        <MaterialIcons
          name="library-books"
          size={iconSize}
          color={iconColor}
        />
      }
    />
  </View>
  </View>
  <View className="mx-auto flex h-2/5 flex-row items-center justify-center">
  <View className="flex h-4/5 w-1/4">
    <MenuCard
      text="Quiz"
      fontSize={fontSize}
      bgcolor="#C6D7F9"
      onPress={() => router.push("/views/GamesPage")}
      icon={
        <MaterialIcons name="chat" size={iconSize} color={iconColor} />
      }
    />
  </View>
  <View className="w-8" />
  <View className="flex h-4/5 w-1/4">
    <MenuCard
      text="Cosa senti?"
      fontSize={fontSize}
      bgcolor="#C6D7F9"
      onPress={() => router.push("/views/GamesPage")}
      icon={
        <MaterialIcons
          name="audiotrack"
          size={iconSize}
          color={iconColor}
        />
      }
    />
  </View>
  </View> */
