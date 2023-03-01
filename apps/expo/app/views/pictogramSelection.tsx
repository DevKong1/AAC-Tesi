import React from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { type Pictogram } from "../../src/types/commonTypes";

const PictogramSelection = () => {
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
