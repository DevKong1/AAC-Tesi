import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import Modal from "react-native-modal";
import { SearchBar } from "@rneui/themed";

import { findPictograms } from "../hooks/pictogramsHandler";
import { usePictogramStore } from "../store/store";
import { isDeviceLarge } from "../utils/commonFunctions";
import { type Pictogram } from "../utils/types/commonTypes";
import PictogramCard from "./PictogramCard";

const PictogramSelectionModal: React.FC<{
  isVisible: boolean;
  onSelect: (el: Pictogram) => void;
  onClose: () => void;
  defaultText: string;
  showFavourites?: boolean;
}> = ({ isVisible, onSelect, onClose, defaultText, showFavourites = true }) => {
  const pictogramStore = usePictogramStore();
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
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={{ margin: 0 }}
      onBackButtonPress={onClose}
    >
      <View className="absolute bottom-0 h-[75%] w-full flex-col items-center justify-center rounded-t-lg bg-[#2f3235ea]">
        <View className="h-[25%] w-full">
          <SearchBar
            round
            containerStyle={{
              borderBottomWidth: 0,
              borderTopWidth: 0,
              backgroundColor: "#ffffff00",
            }}
            inputStyle={{ color: "white" }}
            placeholder="Inserire testo pittogramma..."
            onChangeText={updateSearch}
            onEndEditing={searchPictograms}
            onClear={clearSearch}
            value={searchPhrase}
          />
        </View>
        <View className="flex h-[75%] w-full">
          {searchPhrase != "" ||
          (showFavourites && pictogramStore.favourites.length > 0) ? (
            <View className="h-full w-full content-center justify-center">
              {searchedPictograms.length > 0 ? (
                <FlatList
                  horizontal
                  data={
                    searchPhrase != ""
                      ? searchedPictograms
                      : pictogramStore.getFavouritePictograms()
                  }
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
                <Text className="font-text m-auto text-base text-white">
                  Nessun pittogramma trovato.
                </Text>
              )}
            </View>
          ) : (
            <Text className="font-text m-auto text-base text-white">
              {defaultText}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default PictogramSelectionModal;
