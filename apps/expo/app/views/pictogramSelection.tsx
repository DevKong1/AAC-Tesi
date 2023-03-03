import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { type Pictogram } from "../../src/types/commonTypes";
import { usePictoramStore } from "../store/store";

const PictogramSelection = () => {
  const pictogramStore = usePictoramStore();
  const pictograms = pictogramStore.pictograms;
  const categories = pictogramStore.categories;

  React.useEffect(() => {
    setTimeout(() => {
      pictogramStore.loaded ? null : pictogramStore.fetch();
    }, 50);
  }, []);

  return (
    <SafeAreaView className="h-full w-full flex-col items-center rounded">
      <View className="w-full px-4 py-8">
        <TextInput
          className="w-full appearance-none rounded bg-white py-2 px-3 leading-tight shadow"
          placeholder="Search for a pictogram..."
        />
      </View>
      {pictogramStore.loaded ? (
        <FlatList
          className="w-full"
          data={categories}
          renderItem={({ item }) => {
            return <Text>{item}</Text>;
          }}
          keyExtractor={(item) => item}
        />
      ) : (
        <View className="h-3/4 w-full items-center justify-center">
          <ActivityIndicator size="large" color="#f472b6" />
          <Text className="py-4 text-xs text-white">Loading</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default PictogramSelection;
