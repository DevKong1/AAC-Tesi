import { type ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { type CategoryType } from "../utils/types/commonTypes";

const CategoryTab: React.FC<{
  text: string;
  icon: ReactNode;
  isSelected: boolean;
  width: string | number;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}> = ({ text, icon, isSelected, width, setCategory }) => {
  return (
    <TouchableOpacity
      onPress={() => setCategory(text)}
      style={{ width: width }}
      className={`flex h-3/4 flex-col justify-center pt-5 align-middle ${
        isSelected ? "border-default border-b-2" : ""
      }`}
    >
      <View className="flex-row justify-center">
        <Text className="font-text text-default pr-2 text-2xl">{text}</Text>
        {icon}
      </View>
    </TouchableOpacity>
  );
};

const CategoryTabs: React.FC<{
  categories: CategoryType[];
  selectedCategory: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}> = ({ categories, selectedCategory, setCategory }) => {
  return (
    <View className="mx-8 flex h-full flex-row justify-center align-middle">
      {categories.map(({ text, icon }) => (
        <CategoryTab
          key={text}
          text={text}
          icon={icon}
          isSelected={selectedCategory == text}
          width={`${100 / categories.length}%`}
          setCategory={setCategory}
        />
      ))}
    </View>
  );
};

export default CategoryTabs;
