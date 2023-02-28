import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import Icons from "@expo/vector-icons/MaterialCommunityIcons";

const BoardAddItem = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="w-full"
      onPress={() => router.push(`../views/board`)}
    >
      <View className="flex flex-col items-center justify-center rounded-lg bg-white/10 p-4">
        <Icons className="flex-row" name="plus-thick" size={32} color="white" />
        <Text className="color-white flex-row">Add new board</Text>
      </View>
    </TouchableOpacity>
  );
};

export default BoardAddItem;
