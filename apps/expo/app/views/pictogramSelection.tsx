import React from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { type Pictogram } from "../../src/types/commonTypes";

const PictogramSelection = () => {
  return (
    <SafeAreaView className="h-full w-full flex-col items-center">
      <View className="w-full p-4">
        <TextInput
          className="bg-white"
          placeholder="Search for a pictogram..."
        />
      </View>
    </SafeAreaView>
  );
};

export default PictogramSelection;
