import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SearchBar } from "@rneui/themed";

import { findPictograms } from "../hooks/pictogramsHandler";
import { isDeviceLarge } from "../utils/commonFunctions";
import { type Pictogram } from "../utils/types/commonTypes";
import PictogramCard from "./PictogramCard";

const SearchFlatlist: React.FC<{
  defaultText: string;
  defaultData?: Pictogram[];
  backgroundColor?: string;
  textColor?: string;
  onSelect: (el: Pictogram) => void;
}> = ({
  defaultText,
  defaultData,
  backgroundColor = "#ffffff00",
  textColor = "white",
  onSelect,
}) => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [searchedPictograms, setSearchedPictograms] = useState(
    [] as Pictogram[],
  );

  const fontSize = isDeviceLarge() ? 26 : 16;

  const updateSearch = (search: string) => {
    setSearchPhrase(search);
  };

  const clearSearch = () => {
    setSearchPhrase("");
    setSearchedPictograms([]);
  };

  const searchPictograms = () => {
    if (searchPhrase != "")
      setSearchedPictograms(findPictograms(searchPhrase.toLowerCase(), false));
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
          inputStyle={{ color: textColor ? textColor : "white" }}
          placeholder="Inserire testo pittogramma..."
          onChangeText={updateSearch}
          onEndEditing={searchPictograms}
          onClear={clearSearch}
          value={searchPhrase}
        />
      </View>
      <View className="flex h-[75%] w-full">
        {searchPhrase != "" || defaultData ? (
          <View className="h-full w-full content-center justify-center">
            {searchedPictograms.length > 0 ? (
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={searchPhrase != "" ? searchedPictograms : defaultData}
                renderItem={(pictogram) => (
                  <View className="h-full w-44">
                    <PictogramCard
                      pictogram={pictogram.item}
                      fontSize={fontSize}
                      bgcolor="#C6D7F9"
                      onPress={onSelect}
                      args={pictogram.item}
                    />
                  </View>
                )}
              />
            ) : (
              <Text
                style={{ color: textColor }}
                className="font-text m-auto text-base"
              >
                Nessun pittogramma trovato.
              </Text>
            )}
          </View>
        ) : (
          <Text
            style={{ color: textColor }}
            className="font-text m-auto text-base text-white"
          >
            {defaultText}
          </Text>
        )}
      </View>
    </View>
  );
};

export default SearchFlatlist;
