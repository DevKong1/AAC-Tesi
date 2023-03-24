import React, { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AntDesign,
  Entypo,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import BottomIcons from "../components/BottomIcons";
import CategoryTabs from "../components/CategoryTab";
import MenuCard from "../components/MenuCard";
import { useCompanionStore } from "../store/store";
import { type CategoryType } from "../utils/types/commonTypes";

export default function GamesPage() {
  const [selectedCategory, setCategory] = React.useState("Tutto");

  const companionStore = useCompanionStore();

  const iconSize = 130;
  const fontSize = 32;
  const iconColor = "#5C5C5C";
  const cardWidth = "25%";
  const cardHeight = "80%";
  const categoryIconSize = 28;
  const categories = [
    {
      text: "Tutto",
      icon: (
        <Ionicons name="infinite" size={categoryIconSize} color={iconColor} />
      ),
    },
    {
      text: "Frutta",
      icon: (
        <AntDesign name="apple1" size={categoryIconSize} color={iconColor} />
      ),
    },
    {
      text: "Animali",
      icon: (
        <FontAwesome5 name="cat" size={categoryIconSize} color={iconColor} />
      ),
    },
    {
      text: "Oggetti",
      icon: <Entypo name="pencil" size={categoryIconSize} color={iconColor} />,
    },
    {
      text: "Azioni",
      icon: (
        <MaterialCommunityIcons
          name="hand-wave"
          size={categoryIconSize}
          color={iconColor}
        />
      ),
    },
  ] as CategoryType[];

  useEffect(() => {
    companionStore.speak(
      "Evvaiiiii giochiamo! \nScegli a cosa vuoi giocare",
      "3xl",
      "top",
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
        <View className="m-auto flex h-2/5 flex-row content-center items-start justify-center">
          <MenuCard
            text="A parole tue!"
            fontSize={fontSize}
            bgcolor="#C6D7F9"
            path="/views/GamesPage"
            width={cardWidth}
            height={cardHeight}
            icon={
              <MaterialIcons
                name="videocam"
                size={iconSize}
                color={iconColor}
              />
            }
          />
          <View className="w-8" />
          <MenuCard
            text="Che cos’è??"
            fontSize={fontSize}
            bgcolor="#C6D7F9"
            path="/views/WhatsItPage"
            params={{
              pictograms: [{ _id: 100 }],
              answer: "2000",
              picture: "nop",
            }}
            width={cardWidth}
            height={cardHeight}
            icon={
              <MaterialIcons
                name="photo-camera"
                size={iconSize}
                color={iconColor}
              />
            }
          />
          <View className="w-8" />
          <MenuCard
            text="Crea una storia"
            fontSize={fontSize}
            bgcolor="#C6D7F9"
            path="/views/GamesPage"
            width={cardWidth}
            height={cardHeight}
            icon={
              <MaterialIcons
                name="library-books"
                size={iconSize}
                color={iconColor}
              />
            }
          />
        </View>
        <View className="m-auto flex h-2/5 flex-row content-center items-start justify-center">
          <MenuCard
            text="Quiz"
            fontSize={fontSize}
            bgcolor="#C6D7F9"
            path="/views/GamesPage"
            width={cardWidth}
            height={cardHeight}
            icon={
              <MaterialIcons name="chat" size={iconSize} color={iconColor} />
            }
          />
          <View className="w-8" />
          <MenuCard
            text="Cosa senti?"
            fontSize={fontSize}
            bgcolor="#C6D7F9"
            path="/views/GamesPage"
            width={cardWidth}
            height={cardHeight}
            icon={
              <MaterialIcons
                name="audiotrack"
                size={iconSize}
                color={iconColor}
              />
            }
          />
        </View>
      </View>
      <BottomIcons />
    </SafeAreaView>
  );
}
