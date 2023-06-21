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
import { randomUUID } from "expo-crypto";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

import { getPictogramsFromFile } from "../hooks/useHuggingFace";
import { useBookStore } from "../store/store";
import { formatToMatchColumns } from "../utils/commonFunctions";
import { shadowStyle } from "../utils/shadowStyle";
import { type Book } from "../utils/types/commonTypes";
import IconButton from "./IconButton";
import SettingsButton from "./SettingsButton";

const AddBookModal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
}> = ({ isVisible, onClose }) => {
  const bookStore = useBookStore();
  const [selectedFile, setSelectedFile] = useState(
    undefined as string | undefined,
  );
  const [selectedImage, setSelectedImage] = useState(
    undefined as string | undefined,
  );
  const [selectedText, setSelectedText] = useState("");
  const [textError, setTextError] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
    });

    if (!result.canceled && result.assets[0]?.base64) {
      setSelectedImage(result.assets[0]?.base64);
    }
  };

  const pickDocument = async () => {
    try {
      // TODO SET TYPES
      const result = await DocumentPicker.getDocumentAsync({
        type: "text/plain",
        copyToCacheDirectory: true,
      });
      if (result.type !== "cancel") {
        setSelectedFile(result.uri);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Contact HuggingFace to get book pictograms and format them to match given columns
  const parseDocument = async (uri: string) => {
    const response = await getPictogramsFromFile(uri);
    return response;
  };

  // Add pictogram
  const onConfirm = async () => {
    if (!selectedFile || !selectedImage) {
      Alert.alert("Seleziona un file e una copertina!");
      return;
    }
    if (selectedText == "") {
      setTextError(true);
      return;
    }

    // Retrieve the pictograms, already formatted
    const parsedPictograms = await parseDocument(selectedFile);

    if (parsedPictograms) {
      const addedBook = await bookStore.addBook({
        id: randomUUID(),
        title: selectedText,
        cover: selectedImage,
        pictograms: parsedPictograms.pictograms,
        isCustom: true,
        customPictograms: parsedPictograms.customPictograms,
      } as Book);
      addedBook ? close() : Alert.alert("Errore nella creazione del libro.");
    } else Alert.alert("Errore nella creazione del libro.");
  };

  // Close modal and reset State
  const close = () => {
    setSelectedFile(undefined);
    setSelectedImage(undefined);
    setSelectedText("");
    setTextError(false);
    onClose();
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
        <View className="flex h-full w-1/2 items-center justify-center">
          <TouchableOpacity
            style={[shadowStyle.light]}
            className="flex h-5/6 w-2/3 flex-col items-center justify-center rounded-[30px] bg-[#C6D7F9]"
            onPress={pickImage}
          >
            {selectedImage ? (
              <Image
                style={{ resizeMode: "cover" }}
                className="h-full w-full rounded-[30px]"
                source={{ uri: "data:image/jpeg;base64," + selectedImage }}
                alt="Image of the considered pictogram"
              />
            ) : (
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                textBreakStrategy="simple"
                className="text-default font-text text-center"
              >
                Seleziona un&apos;immagine di copertina...
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <View className="flex h-full w-1/2 flex-col items-center justify-start gap-4 pt-10">
          <View className="h-14 w-full flex-col items-center justify-center pr-8">
            <TextInput
              className={`w-full rounded-xl ${
                textError
                  ? "border-2 border-red-500"
                  : "border border-[#5c5c5c85]"
              } bg-white p-2`}
              onChangeText={setSelectedText}
              onFocus={() => {
                textError ? setTextError(false) : null;
              }}
              value={selectedText}
              placeholder="Titolo libro..."
            />
          </View>
          <View className="h-14 w-3/4 flex-row items-center justify-center gap-2">
            <SettingsButton
              icon={
                <MaterialIcons name="file-upload" size={22} color="#5c5c5c" />
              }
              text="Seleziona un file testuale da convertire in pittogrammi"
              color="#FFFFCA"
              onPress={pickDocument}
            />
            {selectedFile && (
              <MaterialIcons name="check" size={22} color="#5c5c5c" />
            )}
          </View>
          <View className="flex grow items-end justify-end">
            <View className="mb-3 h-14 w-full flex-row items-center justify-center">
              <View className="w-1/2">
                <IconButton
                  icon={<MaterialIcons name="check" size={32} color="white" />}
                  color="#89BF93"
                  onPress={onConfirm}
                />
              </View>
              <View className="w-1/2">
                <IconButton
                  icon={<MaterialIcons name="clear" size={32} color="white" />}
                  color="#F69898"
                  onPress={close}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddBookModal;
