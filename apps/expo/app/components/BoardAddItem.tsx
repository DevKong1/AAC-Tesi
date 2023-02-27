import React from "react";
import { TouchableOpacity, View } from "react-native";
import Icons from "@expo/vector-icons/MaterialCommunityIcons";

const BoardAddItem = () => {
  return (
    <TouchableOpacity>
      <View className="border-pink flex flex-row rounded-lg border-4 bg-white/10 p-4">
        <Icons name="plus-thick" size={32} color="pink" />
      </View>
    </TouchableOpacity>
  );
};

export default BoardAddItem;
