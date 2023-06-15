import { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

import { usePictogramStore } from "../store/store";
import pictograms from "../utils/pictograms";
import { shadowStyle } from "../utils/shadowStyle";
import { type Pictogram } from "../utils/types/commonTypes";
import IconButton from "./IconButton";
import SearchFlatlist from "./PictogramSearchFlatlist";
import SettingsButton from "./SettingsButton";

const PictogramCustomizationModal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
}> = ({ isVisible, onClose }) => {
  const pictogramStore = usePictogramStore();

  const [selectedView, setView] = useState("");
  const [selectedPictogram, setSelectedPictogram] = useState(
    undefined as Pictogram | undefined,
  );
  const [selectedImage, setSelectedImage] = useState(
    undefined as string | undefined,
  );
  const [selectedText, setSelectedText] = useState("");
  const [textError, setTextError] = useState(false);

  const onSelectedPictogram = (pictogram: Pictogram) => {
    const text = pictogram.keywords[0]?.keyword;
    setSelectedPictogram(pictogram);
    if (text) setSelectedText(text);
    setView("");
  };

  // Add pictogram
  const onConfirm = () => {
    if (!selectedImage && !selectedPictogram) {
      Alert.alert("Seleziona un pittogramma o un'immagine!");
      return;
    }
    if (selectedText == "") {
      setTextError(true);
      return;
    }
    pictogramStore.addCustomPictogram(
      selectedPictogram?._id,
      selectedText,
      selectedImage,
    );
    close();
  };

  // Close modal and reset State
  const close = () => {
    setView("");
    setSelectedPictogram(undefined);
    setSelectedImage(undefined);
    setSelectedText("");
    setTextError(false);
    onClose();
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });

    if (!result.canceled && result.assets[0]?.base64) {
      setSelectedImage(result.assets[0]?.base64);
    }
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
                backgroundColor="white"
                inputColor="#5C5C5C"
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
          <View className="flex h-full w-full flex-row">
            <View className="flex h-full w-1/2 items-center justify-center">
              {!selectedImage && !selectedPictogram && (
                <View className="flex h-[10%] w-full items-center justify-center pt-2 ">
                  <Text className="text-default font-text text-center">
                    Premi per selezionare un pittogramma:
                  </Text>
                </View>
              )}
              <View
                className={`flex ${
                  !selectedImage && !selectedPictogram ? "h-[90%]" : "h-full"
                } w-full items-center justify-center`}
              >
                <TouchableOpacity
                  style={[shadowStyle.light]}
                  className="flex h-5/6 w-2/3 flex-col items-center justify-center rounded-[30px] bg-[#C6D7F9]"
                  onPress={() => {
                    if (selectedImage) setSelectedImage(undefined);
                    setView("Search");
                  }}
                >
                  <Image
                    style={{ resizeMode: "contain" }}
                    className={`h-[75%] ${
                      selectedImage ? "w-[75%]" : "w-full"
                    }`}
                    source={
                      selectedImage
                        ? { uri: "data:image/jpeg;base64," + selectedImage }
                        : selectedPictogram
                        ? // TODO JUST FOR DEBUG pictogram[selectedPictogram._id]
                          pictograms[2239]
                        : // Default Pictogram Image
                          pictograms[3418]
                    }
                    alt="Image of the considered pictogram"
                  />
                  <View className="flex h-[25%] w-[90%] items-center justify-center">
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      textBreakStrategy="simple"
                      className="text-default font-text text-center"
                    >
                      {/* TODO PASS WORD */}
                      {selectedText}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex h-full w-1/2 flex-col items-center justify-start gap-4 pt-10">
              <View className="h-14 w-full flex-col items-center justify-center">
                <TextInput
                  className={`w-3/4 rounded-xl  ${
                    textError
                      ? "border-2 border-red-500"
                      : "border border-[#5c5c5c85]"
                  } bg-white p-2`}
                  onChangeText={setSelectedText}
                  onFocus={() => {
                    textError ? setTextError(false) : null;
                  }}
                  value={selectedText}
                  placeholder="Testo pittogramma..."
                />
              </View>
              {selectedImage ? (
                <View className="h-14 w-3/4 flex-col items-center justify-center">
                  <SettingsButton
                    icon={
                      <MaterialIcons name="clear" size={22} color="#5c5c5c" />
                    }
                    text="Annulla selezione"
                    color="#FFFFCA"
                    onPress={() => {
                      setSelectedImage(undefined);
                    }}
                  />
                </View>
              ) : (
                <View className="h-14 w-3/4 flex-col items-center justify-center">
                  <SettingsButton
                    icon={
                      <MaterialIcons name="image" size={22} color="#5c5c5c" />
                    }
                    text="Seleziona un'immagine per il pittogramma"
                    color="#FFFFCA"
                    onPress={pickImage}
                  />
                </View>
              )}
              <View className="flex grow items-end justify-end">
                <View className="h-14 w-full flex-row items-center justify-center">
                  <View className="w-1/2">
                    <IconButton
                      icon={
                        <MaterialIcons name="check" size={32} color="white" />
                      }
                      color="#89BF93"
                      onPress={onConfirm}
                    />
                  </View>
                  <View className="w-1/2">
                    <IconButton
                      icon={
                        <MaterialIcons name="clear" size={32} color="white" />
                      }
                      color="#F69898"
                      onPress={close}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        );
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={close}
      onBackButtonPress={close}
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

export default PictogramCustomizationModal;
