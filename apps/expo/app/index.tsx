import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

import MenuCard from "./components/MenuCard";
import { useBoardStore } from "./store/store";

const Index = () => {
  const iconSize = 160;
  const fontSize = 42;
  const cardWidth = "28%";
  const cardHeight = "50%";

  const boardStore = useBoardStore();
  const boards = boardStore.boards;

  React.useEffect(() => {
    boardStore.fetch();
  }, []);

  //TODO RESPONSIVE
  return (
    <SafeAreaView>
      <View className="flex h-full w-full p-4">
        <View className="flex flex-row">
          <Text className="font-logo text-default pr-4 text-9xl">PictoAI</Text>
          <Image
            source={require("../assets/images/logo.png")}
            className="h-[98px] w-[98px]"
            alt="University of Bologna Logo"
          />
        </View>
        <View className="flex flex-grow flex-row content-center items-start justify-center">
          <MenuCard
            text="Giochiamo"
            fontSize={fontSize}
            bgcolor="#C6D7F9"
            path="/views/board"
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
          <MenuCard
            text="Leggiamo"
            fontSize={fontSize}
            bgcolor="#B9D2C3"
            width={cardWidth}
            height={cardHeight}
            path="/views/board"
            icon={
              <MaterialIcons name="menu-book" size={iconSize} color="#5C5C5C" />
            }
          />
          <MenuCard
            text="Parliamo"
            fontSize={fontSize}
            bgcolor="#EBDBD8"
            width={cardWidth}
            height={cardHeight}
            path="/views/board"
            icon={
              <MaterialIcons
                name="record-voice-over"
                size={iconSize}
                color="#5C5C5C"
              />
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Index;

{
  /* OLD CODE TODO REMOVE
<View className="flex w-full flex-col items-center justify-center py-6">
{boards.length <= 0 ? (
  <Text className="text-white">
    Create a new board by tapping the button below...
  </Text>
) : (
  <Text>Boards TODO</Text>
)}
</View>
<TouchableOpacity
className="w-full"
onPress={() => router.push(`../views/board`)}
>
<AddButton text="Add new board" />
</TouchableOpacity>
*/
}
