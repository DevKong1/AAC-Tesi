import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

import BottomIcons from "../components/BottomIcons";
import CategoryTabs from "../components/CategoryTab";
import MenuCard from "../components/MenuCard";
import { useCompanionStore } from "../store/store";

const GamesPage = () => {
  const [selectedCategory, setCategories] = React.useState([]);

  const companionStore = useCompanionStore();

  const iconSize = 160;
  const fontSize = 32;
  const cardWidth = "25%";
  const cardHeight = "80%";

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
          <CategoryTabs />
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
                name="videogame-asset"
                size={iconSize}
                color="#5C5C5C"
              />
            }
          />
          <View className="w-8" />
          <MenuCard
            text="Che cos’è??"
            fontSize={fontSize}
            bgcolor="#C6D7F9"
            path="/views/GamesPage"
            width={cardWidth}
            height={cardHeight}
            icon={
              <MaterialIcons
                name="videogame-asset"
                size={iconSize}
                color="#5C5C5C"
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
                name="videogame-asset"
                size={iconSize}
                color="#5C5C5C"
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
              <MaterialIcons
                name="videogame-asset"
                size={iconSize}
                color="#5C5C5C"
              />
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
                name="videogame-asset"
                size={iconSize}
                color="#5C5C5C"
              />
            }
          />
        </View>
      </View>
      <BottomIcons />
    </SafeAreaView>
  );
};

export default GamesPage;
