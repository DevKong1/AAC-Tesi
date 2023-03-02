import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AddBoardButton from "./components/AddBoardButton";
import { useBoardStore } from "./store/store";

const Index = () => {
  const boardStore = useBoardStore();
  const boards = boardStore.boards;

  React.useEffect(() => {
    boardStore.fetch();
  }, []);

  return (
    <SafeAreaView>
      <View className="h-full w-full p-4">
        <Text className="mx-auto pb-2 text-5xl font-bold text-white">
          AI <Text className="text-pink-400">AAC</Text>
        </Text>

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
        <AddBoardButton />
      </View>
    </SafeAreaView>
  );
};

export default Index;
