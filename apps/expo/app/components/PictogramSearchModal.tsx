import { View } from "react-native";
import Modal from "react-native-modal";

import { type Pictogram } from "../utils/types/commonTypes";
import SearchFlatlist from "./SearchFlatlist";

const PictogramSearchModal: React.FC<{
  isVisible: boolean;
  onSelect: (el: Pictogram) => void;
  onClose: () => void;
  defaultText: string;
  defaultData?: Pictogram[];
  backdrop?: boolean;
}> = ({
  isVisible,
  onSelect,
  onClose,
  defaultText,
  defaultData,
  backdrop = true,
}) => {
  return (
    <Modal
      backdropOpacity={backdrop ? 1 : 0}
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={{ margin: 0 }}
      onBackButtonPress={onClose}
    >
      <View className="absolute bottom-0 h-[75%] w-full flex-col items-center justify-center rounded-t-lg bg-[#2f3235fa]">
        <SearchFlatlist
          defaultText={defaultText}
          defaultData={defaultData}
          onSelect={onSelect}
        />
      </View>
    </Modal>
  );
};

export default PictogramSearchModal;
