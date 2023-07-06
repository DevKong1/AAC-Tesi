import { Image, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { favouriteCategory } from "../utils/categories";
import pictograms from "../utils/pictograms";
import { type CategoryType } from "../utils/types/commonTypes";

const PictogramCategoryTab: React.FC<{
  value: string;
  text: string;
  isSelected: boolean;
  pictogram?: string;
  setCategory?: (category: string) => void;
}> = ({ value, text, isSelected, setCategory, pictogram }) => {
  const getPictogramImage = () => {
    return !pictogram || isNaN(+pictogram) || !pictograms[+pictogram]
      ? pictograms[3418]
      : pictograms[+pictogram];
  };

  return (
    <TouchableOpacity
      onPress={() => (setCategory ? setCategory(value) : null)}
      className={`flex h-3/4 w-32 flex-col justify-center pb-[2px] align-middle lg:pt-5 ${
        isSelected ? "border-default border-b" : ""
      }`}
    >
      <View className="flex h-full flex-row content-center justify-center">
        <View className="h-full content-center justify-center">
          <Text className="font-text text-default text-small lg:text-xl">
            {text}
          </Text>
        </View>
        <View className="h-full w-12 content-center justify-center">
          <Image
            className="h-full w-full"
            style={{ resizeMode: "contain" }}
            source={getPictogramImage()}
            alt={`Image of the associated Pictogram`}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const PictogramCategoryTabs: React.FC<{
  categories: CategoryType[];
  selectedCategory?: string;
  setCategory?: (category: string) => void;
  showFavourites?: boolean;
}> = ({ categories, selectedCategory, showFavourites, setCategory }) => {
  if (showFavourites) categories = [favouriteCategory].concat(categories);
  return (
    <ScrollView
      horizontal
      contentContainerStyle={{
        justifyContent: "center",
        alignContent: "center",
      }}
      className="mx-4 flex h-full flex-row"
    >
      {categories.map(({ textARASAAC, text, pictogram }) => (
        <PictogramCategoryTab
          value={textARASAAC}
          key={text}
          text={text}
          isSelected={selectedCategory == textARASAAC}
          setCategory={setCategory}
          pictogram={pictogram}
        />
      ))}
    </ScrollView>
  );
};

export default PictogramCategoryTabs;
