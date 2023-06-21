import { Dimensions, ScrollView, Text, View } from "react-native";

import { useCategoryStore } from "../store/store";
import { chunk } from "../utils/commonFunctions";
import { type CategoryType } from "../utils/types/commonTypes";
import CategoryTabs from "./CategoryTab";
import SettingsButton from "./SettingsButton";

const CategorySelection: React.FC = () => {
  const cols = 5;
  const { width } = Dimensions.get("window");
  const categoryStore = useCategoryStore();

  const isCurrent = (category: string) => {
    return categoryStore.currentCategories.find(
      (el) => el.textARASAAC == category,
    );
  };

  const addCategory = async (category: string) => {
    await categoryStore.addCategory(category);
  };

  const removeCategory = async (category: string) => {
    await categoryStore.removeCategory(category);
    if (categoryStore.defaultCategory == category)
      await categoryStore.setDefault();
  };

  const setDefault = async (category: string) => {
    await categoryStore.setDefault(
      categoryStore.defaultCategory == category ? undefined : category,
    );
  };

  return (
    <View className="flex h-full w-full flex-col items-center justify-center">
      <View className="flex h-[20%] w-full items-center justify-center pt-4">
        <CategoryTabs
          setCategory={setDefault}
          selectedCategory={categoryStore.defaultCategory}
          categories={categoryStore.currentCategories}
        />
      </View>
      <View className="flex h-[10%] w-full items-center justify-start">
        <Text className="text-default font-text text-center">{`Premi una categoria per farla diventare predefinita o seleziona le categorie da visualizzare: ${categoryStore.currentCategories.length}/${categoryStore.maxCategories}`}</Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
        className="h-[70%] w-full flex-col"
      >
        {(chunk(categoryStore.allCategories, cols) as CategoryType[][]).map(
          (columns, i) => (
            <View
              key={i}
              className="flex h-16 w-full flex-row content-center justify-center pt-2"
            >
              {columns.map((column) => (
                <View
                  key={column.textARASAAC}
                  style={{ width: width / cols }}
                  className="flex h-12 px-4"
                >
                  <SettingsButton
                    text={column.text}
                    color={
                      isCurrent(column.textARASAAC) ? "#B9D2C3" : "#FFFFCA"
                    }
                    onPress={() => {
                      isCurrent(column.textARASAAC)
                        ? removeCategory(column.textARASAAC)
                        : addCategory(column.textARASAAC);
                    }}
                  />
                </View>
              ))}
            </View>
          ),
        )}
      </ScrollView>
    </View>
  );
};

export default CategorySelection;
