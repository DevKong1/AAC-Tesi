import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type ImageSourcePropType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

import { type Pictogram } from "../../src/types/commonTypes";

const CategoriesView: React.FC<{
  categories: string[][];
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}> = ({ categories }) => {
  return (
    <View className="h-full w-full">
      <FlatList
        numColumns={2}
        data={categories}
        renderItem={({ item }) => {
          return (
            <View className="mx-auto my-6 w-2/5 rounded-lg  bg-white/10 p-4">
              <TouchableOpacity className="items-center justify-center">
                <View className="w-full">
                  <Image
                    className="h-12 object-contain"
                    source={item[1] as ImageSourcePropType}
                    alt={`Image of ${item[0] as string}`}
                  />
                </View>
                <Text className="color-white"> {item[0] as string}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

const PictogramsView: React.FC = () => {
  const {
    data: pictograms,
    error,
    isLoading,
  } = useQuery(["pictograms"], async () => {
    console.log("Loading pictorams...");
    return (await import("../../assets/dictionaries/Dizionario_en.json"))
      .default;
  });

  if (isLoading)
    return (
      <View className="h-3/4 w-full items-center justify-center">
        <ActivityIndicator size="large" color="#f472b6" />
        <Text className="py-4 text-xs text-white">Loading</Text>
      </View>
    );

  if (error)
    return (
      <View className="h-3/4 w-full items-center justify-center">
        <Text className="py-4 text-xs text-white">
          Error loading data, try restarting the app!
        </Text>
      </View>
    );

  return <View></View>;
};

const PictogramSelection = () => {
  const categories = [
    ["basic concepts", require("../../assets/pictograms/img_9202.png")],
    ["preposition", require("../../assets/pictograms/img_11709.png")],
    ["verb", require("../../assets/pictograms/img_11741.png")],
    ["animal", require("../../assets/pictograms/img_6901.png")],
    ["feeling", require("../../assets/pictograms/img_7251.png")],
    ["color", require("../../assets/pictograms/img_34483.png")],
    [
      "core vocabulary-communication",
      require("../../assets/pictograms/img_34826.png"),
    ],
  ];
  const [selectedCategory, setCategory] = React.useState("");
  const [searchText, setText] = React.useState("");

  return (
    <SafeAreaView className="h-full w-full flex-col items-center rounded">
      <View className="w-full px-4 py-8">
        <TextInput
          className="w-full appearance-none rounded bg-white py-2 px-3 leading-tight shadow"
          placeholder="Search for a pictogram..."
        />
      </View>
      <CategoriesView categories={categories} setCategory={setCategory} />
    </SafeAreaView>
  );
};

export default PictogramSelection;
