import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

import { type Pictogram } from "../../src/types/commonTypes";
import { usePictoramStore } from "../store/store";

const PictogramSelection = () => {
  const { data: pictograms, isLoading } = useQuery(["pictograms"], async () => {
    console.log("Loading pictorams...");
    return (await import("../../assets/dictionaries/Dizionario_en.json"))
      .default;
  });

  if (isLoading)
    return (
      <View className="h-3/4 w-full items-center justify-center">
        <ActivityIndicator size="large" color="#f472b6" />
        <Text className="py-4 text-xs text-white">Loading</Text>
      </View>
    );

  return (
    <SafeAreaView className="h-full w-full flex-col items-center rounded">
      <View className="w-full px-4 py-8">
        <TextInput
          className="w-full appearance-none rounded bg-white py-2 px-3 leading-tight shadow"
          placeholder="Search for a pictogram..."
        />
      </View>
      <FlatList
        className="w-full"
        data={[
          ...new Set(
            (pictograms as Pictogram[]).flatMap((el) => el.categories),
          ),
        ]}
        renderItem={({ item }) => {
          return <Text>{item}</Text>;
        }}
        keyExtractor={(item) => item}
      />
    </SafeAreaView>
  );
};

export default PictogramSelection;
