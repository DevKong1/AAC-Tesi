import { useEffect, useState } from "react";
import {
  BackHandler,
  Image,
  Text,
  TouchableOpacity,
  View,
  type ImageSourcePropType,
} from "react-native";
import Modal from "react-native-modal";
import { useRouter } from "expo-router";

import { defaultPictogram } from "../utils/commonFunctions";
import pictograms from "../utils/pictograms";
import { shadowStyle } from "../utils/shadowStyle";
import { type Pictogram } from "../utils/types/commonTypes";
import SearchFlatlist from "./SearchFlatlist";
import SettingsButton from "./SettingsButton";

const PictogramSettingsModal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
}> = ({ isVisible, onClose }) => {
  const router = useRouter();
  const [selectedView, setView] = useState("");
  const [selectedPictogram, setSelectedPictogram] = useState(
    undefined as Pictogram | undefined,
  );
  const [selectedImage, setSelectedImage] = useState(
    undefined as ImageSourcePropType | undefined,
  );
  const [selectedText, setSelectedText] = useState("Testo Pittogramma");

  const onSelectedPictogram = (pictogram: Pictogram) => {
    setSelectedPictogram(pictogram);
    setView("");
  };

  const currentView = () => {
    switch (selectedView) {
      case "Search":
        return (
          <View className="h-full w-full items-center justify-center">
            <View className="h-[85%] w-full items-center justify-center">
              <SearchFlatlist
                defaultText="Cerca un pittogramma da modificare.."
                onSelect={onSelectedPictogram}
                textColor="#5C5C5C"
                backgroundColor="white"
              />
            </View>
            <View className="h-[15%] w-64 items-center justify-center p-2">
              <SettingsButton
                text="Annulla"
                color="#FFFFCA"
                onPress={() => setView("")}
              />
            </View>
          </View>
        );
      default:
        return (
          <View className="h-full w-full">
            <View className="flex h-full w-1/2 items-center justify-center">
              <TouchableOpacity
                style={[shadowStyle.light]}
                className="mx-auto flex h-5/6 w-2/3 flex-col items-center justify-center rounded-[30px] bg-[#C6D7F9]"
                onPress={() => {
                  setView("Search");
                }}
              >
                <Image
                  style={{ resizeMode: "contain" }}
                  className="h-[75%] w-full"
                  source={
                    selectedImage
                      ? selectedImage
                      : selectedPictogram
                      ? pictograms[2239]
                      : pictograms[3418]
                  }
                  alt="Image of the considered pictogram"
                />
                <View className="flex h-[25%] w-[90%] items-center justify-center">
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    textBreakStrategy="simple"
                    className={`text-default font-text text-center`}
                  >
                    {/* TODO PASS WORD */}
                    {selectedPictogram
                      ? selectedPictogram.keywords[0]?.keyword
                      : selectedText}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View className="flex h-full w-1/2 flex-col"></View>
          </View>
        );
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={{
        margin: "auto",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <View className="flex h-[85%] w-[85%] flex-row items-center justify-center rounded-lg bg-[#fadada]">
        {currentView()}
      </View>
    </Modal>
  );
};

export default PictogramSettingsModal;
