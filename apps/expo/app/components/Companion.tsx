import React from "react";
import { Image, Text, View } from "react-native";

import { useCompanionStore } from "../store/store";

const Companion: React.FC<{}> = () => {
  const companionStore = useCompanionStore();
  const mood = companionStore.currentMood;
  const text = companionStore.currentText;

  //TODO Animated Avatar
  return (
    <View className="absolute bottom-4 right-4">
      <Text className="text-default absolute bottom-4 right-60 text-5xl">
        {text}
      </Text>
      <Image source={require("../../assets/images/companion.png")} />
    </View>
  );
};

export default Companion;
