import { View } from "react-native";
import Modal from "react-native-modal";

import { usePictogramStore } from "../store/store";
import { type Pictogram } from "../utils/types/commonTypes";
import SearchFlatlist from "./SearchFlatlist";

const PictogramSelectionModal: React.FC<{
  isVisible: boolean;
  onSelect: (el: Pictogram) => void;
  onClose: () => void;
  defaultText: string;
  showFavourites?: boolean;
}> = ({ isVisible, onSelect, onClose, defaultText, showFavourites = true }) => {
  const pictogramStore = usePictogramStore();

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={{ margin: 0 }}
      onBackButtonPress={onClose}
    >
      <View className="absolute bottom-0 h-[75%] w-full flex-col items-center justify-center rounded-t-lg bg-[#2f3235ea]">
        <SearchFlatlist
          defaultText={defaultText}
          defaultData={
            showFavourites ? pictogramStore.getFavouritePictograms() : undefined
          }
          onSelect={onSelect}
        />
      </View>
    </Modal>
  );
};

export default PictogramSelectionModal;
