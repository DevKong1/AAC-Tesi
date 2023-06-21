import { type ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { type CategoryType } from "../utils/types/commonTypes";

const CategoryTab: React.FC<{
  value: string;
  text: string;
  icon: ReactNode;
  isSelected: boolean;
  width: string | number;
  compact: boolean;
  setCategory?: (category: string) => void;
}> = ({ value, text, icon, isSelected, width, setCategory, compact }) => {
  return (
    <TouchableOpacity
      onPress={() => (setCategory ? setCategory(value) : null)}
      style={{ width: width }}
      className={`flex h-3/4 flex-col justify-center align-middle lg:pt-5 ${
        isSelected ? "border-default border-b" : ""
      }`}
    >
      <View className="flex h-full flex-row content-center justify-center">
        <View className="h-full content-center justify-center">
          <Text
            className={`font-text text-default pr-2 ${
              compact ? "text-sm lg:text-xl" : "text-base lg:text-2xl"
            }`}
          >
            {text}
          </Text>
        </View>
        <View className="h-full content-center justify-center">{icon}</View>
      </View>
    </TouchableOpacity>
  );
};

const CategoryTabs: React.FC<{
  categories: CategoryType[];
  selectedCategory?: string; 
  setCategory?: (category: string) => void;
  compact?: boolean;
}> = ({ categories, selectedCategory, setCategory, compact = false }) => {
  return (
    <View className="mx-8 flex h-full flex-row content-center justify-center">
      {categories.map(({ textARASAAC, text, icon }) => (
        <CategoryTab
          value={textARASAAC}
          key={text}
          text={text}
          icon={icon}
          isSelected={selectedCategory == textARASAAC}
          width={`${100 / categories.length}%`}
          setCategory={setCategory}
          compact={compact}
        />
      ))}
    </View>
  );
};

export default CategoryTabs;
