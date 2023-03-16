import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import AddButton from "./components/AddButton";
import { useBoardStore } from "./store/store";

const Index = () => {
  const router = useRouter();

  const boardStore = useBoardStore();
  const boards = boardStore.boards;

  React.useEffect(() => {
    boardStore.fetch();
  }, []);

  return (
    <SafeAreaView>
      <View className="flex h-full w-full p-4">
        <View>
          <Text className="font-logo text-text text-9xl">PictoAI</Text>
        </View>
        {/* TODO SAVE AND LOAD BOARDS */}
        <View className="flex w-full flex-col items-center justify-center py-6">
          {boards.length <= 0 ? (
            <Text className="text-white">
              Create a new board by tapping the button below...
            </Text>
          ) : (
            <Text>Boards TODO</Text>
          )}
        </View>
        <TouchableOpacity
          className="w-full"
          onPress={() => router.push(`../views/board`)}
        >
          <AddButton text="Add new board" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Index;
