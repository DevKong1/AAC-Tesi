import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SearchBar } from "@rneui/themed";

import { findPictograms } from "../hooks/pictogramsHandler";
import { usePictogramStore } from "../store/store";
import { type Pictogram } from "../utils/types/commonTypes";
import PictogramCard from "./PictogramCard";

const SearchFlatlist: React.FC<{
  defaultText: string;
  defaultData?: Pictogram[];
  backgroundColor?: string;
  inputColor?: string;
  onSelect: (el: Pictogram) => void;
}> = ({
  defaultText,
  defaultData,
  inputColor,
  backgroundColor = "#ffffff00",
  onSelect,
}) => {
  const pictogramStore = usePictogramStore();
  const [searchPhrase, setSearchPhrase] = useState("");
  const [searchedPictograms, setSearchedPictograms] = useState(
    [] as Pictogram[],
  );

  const updateSearch = (search: string) => {
    setSearchPhrase(search);
  };

  const clearSearch = () => {
    setSearchPhrase("");
    setSearchedPictograms([]);
  };

  const searchPictograms = () => {
    if (searchPhrase != "")
      setSearchedPictograms(
        findPictograms(
          searchPhrase.toLowerCase(),
          pictogramStore.getCustomPictograms(),
        ),
      );
    else clearSearch();
  };

  return (
    <View className="flex h-full w-full">
      <View className="h-[25%] w-full">
        <SearchBar
          round
          inputContainerStyle={{
            backgroundColor: backgroundColor ? backgroundColor : undefined,
          }}
          containerStyle={{
            borderBottomWidth: 0,
            borderTopWidth: 0,
            backgroundColor: "#ffffff00",
          }}
          inputStyle={{ color: inputColor ? inputColor : "white" }}
          placeholder="Inserire testo pittogramma..."
          onChangeText={updateSearch}
          onEndEditing={searchPictograms}
          onClear={clearSearch}
          value={searchPhrase}
        />
      </View>
      <View className="flex h-[75%] w-full">
        {searchPhrase != "" || (defaultData && defaultData.length > 0) ? (
          <View className="h-full w-full content-center justify-center">
            {searchedPictograms.length > 0 || defaultData ? (
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={searchPhrase != "" ? searchedPictograms : defaultData}
                renderItem={(pictogram) => (
                  <View className="h-full w-44 items-center justify-center">
                    <PictogramCard
                      pictogram={pictogram.item}
                      bgcolor="#C6D7F9"
                      onPress={onSelect}
                      args={pictogram.item}
                    />
                  </View>
                )}
              />
            ) : (
              <Text className="font-text text-default m-auto text-base">
                Nessun pittogramma trovato.
              </Text>
            )}
          </View>
        ) : (
          <Text className="font-text text-default m-auto text-base">
            {defaultText}
          </Text>
        )}
      </View>
    </View>
  );
};

export default SearchFlatlist;
