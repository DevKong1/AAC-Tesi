import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SearchBar } from "@rneui/themed";

import { usePictogramStore } from "../store/store";
import { type Pictogram } from "../utils/types/commonTypes";
import PictogramCard from "./PictogramCard";

const SearchFlatlist: React.FC<{
  defaultText?: string;
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
  const [typing, setTyping] = useState(false);

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
        pictogramStore.getPictogramByText(searchPhrase.toLowerCase().trim()),
      );
    else clearSearch();
    setTyping(false);
  };

  const getFlatList = (data: Pictogram[]) => {
    return (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={(pictogram) => (
          <View className="h-full w-44 items-center justify-center">
            <PictogramCard
              radius={30}
              pictogram={pictogram.item}
              onPress={onSelect}
              args={pictogram.item}
            />
          </View>
        )}
      />
    );
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
          onFocus={() => setTyping(true)}
          value={searchPhrase}
        />
      </View>
      <View className="flex h-[75%] w-full">
        {searchPhrase != "" || searchedPictograms.length > 0 ? (
          <View className="h-full w-full content-center justify-center">
            {searchedPictograms.length > 0 || typing ? (
              getFlatList(searchedPictograms)
            ) : (
              <Text
                style={{ color: inputColor ? inputColor : "white" }}
                className="font-text m-auto text-base"
              > 
                Nessun pittogramma trovato.
              </Text>
            )}
          </View>
        ) : (
          <View className="h-full w-full content-center justify-center">
            {defaultData && defaultData.length > 0 ? (
              getFlatList(defaultData)
            ) : (
              <Text
                style={{ color: inputColor ? inputColor : "white" }}
                className="font-text m-auto text-base"
              >
                {defaultText}
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default SearchFlatlist;
