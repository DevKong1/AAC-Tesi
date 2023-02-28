import React from "react";
import {
  Alert,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { type Pictogram } from "../../src/types/commonTypes";
import AddPictogramButton from "../components/AddPictogramButton";

const Board = () => {
  const [pictograms, setPictograms] = React.useState([] as Pictogram[]);

  const addPictogram = (pictogram: Pictogram) => {
    Alert.alert("Added");
    // setPictograms((prevItems) => {
    //   return [pictogram, ...prevItems];
    // });
  };

  return (
    <SafeAreaView className="bg-[#1d4289]">
      <View className="h-full w-full p-4">
        <View className="flex h-full w-full flex-col items-center p-4">
          {pictograms.length > 0 ? (
            <Text>Boards TODO</Text>
          ) : (
            <Text className="py-4 text-white">
              Compose your board by adding items with the button below..
            </Text>
          )}
          <TouchableOpacity
            className="w-full"
            onPress={() => addPictogram({ name: "test" })}
          >
            <AddPictogramButton />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Board;
