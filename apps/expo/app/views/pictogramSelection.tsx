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

const PictogramCard: React.FC<{
  text: string;
  alt: string;
  image: ImageSourcePropType;
  onPress: React.Dispatch<React.SetStateAction<string>>;
}> = ({ text, alt, image, onPress }) => {
  return (
    <TouchableOpacity className="mx-auto my-6 h-56 w-[30%] rounded-lg  bg-white/10 p-4">
      <View className="flex flex-col items-center justify-center">
        <Image
          className="h-4/5 w-4/5 flex-auto object-cover"
          source={image as ImageSourcePropType}
          alt={alt}
        />
        <Text className="color-white pt-4  font-bold">{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const CategoriesView: React.FC<{
  categories: string[][];
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}> = ({ categories, setCategory }) => {
  return (
    <View className="h-full w-full">
      <FlatList
        numColumns={3}
        data={categories}
        renderItem={({ item }) => {
          return (
            <PictogramCard
              text={item[0] as string}
              alt={`Image of ${item[0] as string}`}
              image={item[1] as ImageSourcePropType}
              onPress={setCategory}
            />
          );
        }}
        keyExtractor={(_, i) => i.toString()}
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
    ["BASIC CONCEPTS", require("../../assets/pictograms/img_9202.png")],
    ["PREPOSITION", require("../../assets/pictograms/img_11709.png")],
    ["VERB", require("../../assets/pictograms/img_11741.png")],
    ["ANIMAL", require("../../assets/pictograms/img_6901.png")],
    ["FEELING", require("../../assets/pictograms/img_7251.png")],
    ["COLOR", require("../../assets/pictograms/img_34483.png")],
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
