import { FlatList, Text, View } from "react-native";
import Modal from "react-native-modal";

import { type Pictogram } from "../utils/types/commonTypes";
import PictogramCard from "./PictogramCard";

const PictogramSelectionModal: React.FC<{
  isVisible: boolean;
  onSelect: (el: Pictogram) => void;
  onClose: () => void;
  data: Pictogram[];
}> = ({ isVisible, onSelect, onClose, data }) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={{ margin: 0 }}
      onBackButtonPress={onClose}
    >
      <View className="absolute bottom-0 flex h-[75%] w-full items-center justify-center rounded-t-lg bg-[#2f3235ea]">
        <View className="flex h-full w-full items-center justify-center">
          {data.length > 0 ? (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={data}
              renderItem={(pictogram) => (
                <View className="h-full w-44 items-center justify-center">
                  <PictogramCard
                radius={30}
                    pictogram={pictogram.item}
                    bgcolor="#C6D7F9"
                    onPress={onSelect}
                    args={pictogram.item}
                  />
                </View>
              )}
            />
          ) : (
            <Text className="font-text m-auto text-base text-white">
              Nessun pittogramma personalizzato trovato.
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default PictogramSelectionModal;
