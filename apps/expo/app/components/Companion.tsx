import React from "react";
import { Image, Text, View } from "react-native";

import { useCompanionStore } from "../store/store";
import { shadowStyle } from "../utils/shadowStyle";

const Companion: React.FC = () => {
  const companionStore = useCompanionStore();
  const isVisible = companionStore.isVisible;
  const text = companionStore.currentText;
  const position = companionStore.position;
  const bubblePosition = companionStore.bubblePosition;

  //TODO Animated Avatar
  return (
    <View
      pointerEvents="none"
      className={`absolute bottom-0 ${
        position == "center" ? "right-[22%]" : "right-2 lg:right-4"
      }`}
    >
      {/* Bubble */}
      {isVisible && text !== "" && companionStore.bubbleOn && (
        <View
          pointerEvents="none"
          style={shadowStyle.chatBubble}
          // If position isn't left it's top
          className={`absolute ${
            bubblePosition === "left"
              ? "bottom-4 right-36 lg:right-72"
              : "bottom-36 right-4 lg:bottom-48"
          } flex flex-1 items-center justify-center rounded-full bg-[#ffffffda] p-2`}
        >
          <Text
            className={`font-text text-default p-4 text-center text-base lg:text-3xl`}
          >
            {text}
          </Text>
          {/* TODO BUBBLE ARROW*/}
        </View>
      )}
      {/* Companion */}
      {isVisible && (
        <View
          pointerEvents="none"
          className={`h-32 w-32 opacity-100 transition-all duration-200 lg:h-44 lg:w-52`}
        >
          <Image
            style={{ resizeMode: "contain" }}
            className="pointer-events-none h-full w-full"
            alt="Avatar cartoonato di un'insegnante"
            source={require("../../assets/images/companion.png")}
          />
        </View>
      )}
    </View>
  );
};

export default Companion;
