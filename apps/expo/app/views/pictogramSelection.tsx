import React from "react";
import { Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { type Pictogram } from "../../src/types/commonTypes";
import { usePictoramStore } from "../store/store";

const PictogramSelection = () => {
  const pictogramStore = usePictoramStore();
  const pictograms = pictogramStore.pictograms;

  React.useEffect(() => {
    pictogramStore.loaded ? null : pictogramStore.fetch();
  }, []);

  return (
    <SafeAreaView className="h-full w-full flex-col items-center rounded">
      <View className="w-full px-4 py-8">
        <TextInput
          className="w-full appearance-none rounded bg-white py-2 px-3 leading-tight shadow"
          placeholder="Search for a pictogram..."
        />
      </View>
    </SafeAreaView>
  );
};

export default PictogramSelection;
