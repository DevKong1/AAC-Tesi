import React from "react";
import { Image, Text, View } from "react-native";

import { useCompanionStore } from "../store/store";
import { shadowStyle } from "../utils/shadowStyle";

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
  const position = companionStore.position;
  const bubblePosition = companionStore.bubblePosition;

  //TODO Animated Avatar
  return (
    <View
      className={`absolute bottom-0 ${
        position == "gamesPage" ? "right-[22%]" : "right-2 lg:right-4"
      }`}
    >
      {/* Bubble */}
      {text !== "" && companionStore.bubbleOn && (
        <View
          style={shadowStyle.chatBubble}
          // If position isn't left it's top
          className={`absolute ${
            bubblePosition === "left"
              ? "bottom-4 right-36 lg:right-72"
              : "bottom-36 right-4 lg:bottom-48"
          } flex flex-1 items-center justify-center rounded-full bg-slate-50 p-6`}
        >
          <Text
            className={`font-text text-default py-4 text-center text-base lg:text-3xl`}
          >
            {text}
          </Text>
          {/* TODO BUBBLE ARROW*/}
        </View>
      )}
      {/* Companion */}
      {isVisible && (
        <View
          className={`h-36 w-36 opacity-100 transition-all duration-200 lg:h-44 lg:w-52`}
        >
          <Image
            style={{ resizeMode: "contain" }}
            className="h-full w-full"
            alt="Avatar cartoonato di un'insegnante"
            source={require("../../assets/images/companion.png")}
          />
        </View>
      )}
    </View>
  );
};

export default Companion;
