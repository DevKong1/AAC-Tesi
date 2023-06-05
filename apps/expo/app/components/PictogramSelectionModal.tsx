import { useState } from "react";
import { Modal, Text, View } from "react-native";
import { SearchBar } from "@rneui/themed";

import { type Pictogram } from "../utils/types/commonTypes";

const PictogramSelectionModal: React.FC<{
  isVisible: boolean;
  onSelect: (el: Pictogram) => void;
  onClose: () => void;
}> = ({ isVisible, onSelect, onClose }) => {
  const [searchPhrase, setSearchPhrase] = useState("");

  const updateSearch = (search: string) => {
    setSearchPhrase(search);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View className="absolute bottom-0 h-[75%] w-full flex-row rounded-t-lg border-t-gray-400 bg-[#2f3235ea]">
        <View className="h-[5%] w-full">
          <SearchBar
            placeholder="Type Here..."
            onChangeText={updateSearch}
            value={searchPhrase}
          />
        </View>
      </View>
    </Modal>
  );
};

export default PictogramSelectionModal;
