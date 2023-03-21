import React from "react";
import { Image, Text, View } from "react-native";

import { shadowStyle } from "../../src/utils/shadowStyle";
import { useCompanionStore } from "../store/store";

const textSizes = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
};

type ObjectKey = keyof typeof textSizes;

const Companion: React.FC = () => {
  const companionStore = useCompanionStore();
  const isVisible = companionStore.isVisible;
  const mood = companionStore.currentMood;
  const text = companionStore.currentText;
  const textSize = companionStore.textSize;
  const position = companionStore.position;

  //TODO Animated Avatar
  return (
    <View className="absolute bottom-4 right-4">
      {/* Bubble */}
      {text !== "" && companionStore.bubbleOn && (
        <View
          style={shadowStyle.chatBubble}
          // If position isn't left it's top
          className={`absolute ${
            position === "left" ? "bottom-4 right-72" : "bottom-56 right-4"
          } flex flex-1 items-center justify-center rounded-full bg-slate-50 p-6`}
        >
          <Text
            className={`font-text text-default text-center ${
              textSizes[textSize as ObjectKey]
            }`}
          >
            {text}
          </Text>
          {/* TODO BUBBLE ARROW*/}
        </View>
      )}
      {/* Companion */}
      {isVisible && (
        <View
          className={`max-h-52 max-w-xs opacity-100 transition-all duration-200`}
        >
          <Image
            className="m-auto h-52 w-64 object-scale-down"
            alt="Avatar cartoonato di un'insegnante"
            source={require("../../assets/images/companion.png")}
          />
        </View>
      )}
    </View>
  );
};

export default Companion;
