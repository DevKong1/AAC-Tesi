import React from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { type Pictogram } from "../../src/types/commonTypes";

const PictogramSelection = (addPictogram: (pictogram: Pictogram) => void) => {
  return (
    <SafeAreaView className="bg-[#1d4289]">
      <Text>AAA</Text>
    </SafeAreaView>
  );
};

export default PictogramSelection;
