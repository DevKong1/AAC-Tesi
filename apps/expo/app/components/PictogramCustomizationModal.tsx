import { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import ColorPicker, { HueSlider, Panel1 } from "reanimated-color-picker";

import { useCategoryStore, usePictogramStore } from "../store/store";
import { chunk } from "../utils/commonFunctions";
import pictograms from "../utils/pictograms";
import { shadowStyle } from "../utils/shadowStyle";
import { type CategoryType, type Pictogram } from "../utils/types/commonTypes";
import IconButton from "./IconButton";
import SearchFlatlist from "./PictogramSearchFlatlist";
import SettingsButton from "./SettingsButton";

const PictogramCustomizationModal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
}> = ({ isVisible, onClose }) => {
  const { getToken } = useAuth();
  const { width } = Dimensions.get("window");

  const categoryCols = 5;
  const maxCategories = 5;

  const pictogramStore = usePictogramStore();
  const categoryStore = useCategoryStore();

  const [selectedView, setView] = useState("");
  const [selectedPictogram, setSelectedPictogram] = useState(
    undefined as Pictogram | undefined,
  );
  const [selectedImage, setSelectedImage] = useState(
    undefined as string | undefined,
  );
  const [selectedText, setSelectedText] = useState("");
  const [selectedCategories, setCategories] = useState([] as string[]);
  const [selectedColor, setSelectedColor] = useState(
    undefined as string | undefined,
  );
  const [textError, setTextError] = useState(false);

  const onSelectedPictogram = (pictogram: Pictogram) => {
    const text = pictogram.keywords[0]?.keyword;
    setSelectedPictogram(pictogram);
    if (text) setSelectedText(text);
    setView("");
  };

  const addCategory = (category: string) => {
    if (selectedCategories.includes(category))
      setCategories(selectedCategories.filter((el) => el != category));
    else if (selectedCategories.length < maxCategories)
      setCategories([...selectedCategories, category]);
  };

  const onSelectColor = (value: any) => {
    // do something with the selected color.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    setSelectedColor(value?.hex);
  };

  // Close modal and reset State
  const close = () => {
    setView("");
    setSelectedPictogram(undefined);
    setSelectedImage(undefined);
    setSelectedText("");
    setSelectedColor(undefined);
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

  // Add pictogram
  const onConfirm = async () => {
    if (!selectedImage && !selectedPictogram) {
      Alert.alert("Seleziona un pittogramma o un'immagine!");
      return;
    }
    if (selectedText == "") {
      setTextError(true);
      return;
    }
    const token = await getToken();
    if (!token) {
      Alert.alert("Error creating pictogram");
      close();
      return;
    }
    const result = await pictogramStore.addCustomPictogram(
      token,
      selectedPictogram?._id,
      selectedText,
      selectedImage,
      selectedCategories,
      selectedColor,
    );
    if (!result) Alert.alert("Error creating pictogram");
    close();
  };

  const getColor = () => {
    if (selectedColor) return selectedColor;
    else if (selectedPictogram && pictogramStore.showColors) {
      const color = categoryStore.getCategoryColor(selectedPictogram);
      if (color) return color;
    }
    return "#C6D7F9";
  };

  const currentView = () => {
    switch (selectedView) {
      case "Category":
        return (
          <View className="flex h-full w-full flex-col items-center justify-center">
            <View className="flex h-[25%] w-full items-center justify-center py-2">
              <View className="h-full w-32">
                <SettingsButton
                  textColor="white"
                  text="Conferma"
                  color="#89BF93"
                  onPress={() => setView("")}
                />
              </View>
            </View>
            <View className="flex h-[10%] w-full items-center justify-start">
              <Text className="text-default font-text text-center">{`Seleziona le categorie del pittogramma: ${selectedCategories.length}/${maxCategories}`}</Text>
            </View>
            <ScrollView
              contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center",
              }}
              className="h-[65%] w-full flex-col"
            >
              {(
                chunk(
                  categoryStore.allCategories,
                  categoryCols,
                ) as CategoryType[][]
              ).map((columns, i) => (
                <View
                  key={i}
                  className="flex h-16 w-full flex-row content-center justify-center pt-2"
                >
                  {columns.map((column) => (
                    <View
                      key={column.textARASAAC}
                      style={{ width: (width * 0.85) / categoryCols }}
                      className="flex h-12 px-4"
                    >
                      <SettingsButton
                        text={column.text}
                        color={
                          selectedCategories.includes(column.textARASAAC)
                            ? "#B9D2C3"
                            : "#FFFFCA"
                        }
                        onPress={() => {
                          addCategory(column.textARASAAC);
                        }}
                      />
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        );
      case "Color":
        return (
          <View className="flex h-full w-full flex-col items-center justify-center">
            <View className="flex h-[15%] w-full items-center justify-center">
              <Text className="text-default font-text text-center">
                Seleziona un colore per il pittogramma:
              </Text>
            </View>
            <View className="flex h-[65%] w-full flex-col items-center justify-center">
              <ColorPicker
                style={{
                  height: "100%",
                  width: "100%",
                  alignItems: "center",
                }}
                onComplete={onSelectColor}
              >
                <Panel1 style={{ height: "80%", width: "95%" }} />
                <HueSlider
                  style={{
                    height: "20%",
                    width: "95%",
                    marginTop: 10,
                  }}
                />
              </ColorPicker>
            </View>

            <View className="flex h-[25%] w-full flex-row items-center justify-center py-2">
              <View className="h-10 w-32">
                <SettingsButton
                  textColor="white"
                  text="Conferma"
                  color="#89BF93"
                  onPress={() => setView("")}
                />
              </View>
              <View className="w-2" />
              <View className="h-10 w-32">
                <SettingsButton
                  textColor="white"
                  text="Annulla"
                  color="#F69898"
                  onPress={() => {
                    setSelectedColor(undefined);
                    setView("");
                  }}
                />
              </View>
            </View>
          </View>
        );
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
              <View className="flex h-[85%] w-full items-center justify-center">
                <TouchableOpacity
                  style={[
                    shadowStyle.light,
                    {
                      backgroundColor: getColor(),
                    },
                  ]}
                  className="flex h-5/6 w-2/3 flex-col items-center justify-center rounded-[30px]"
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
                          pictograms[+selectedPictogram._id]
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
                {(selectedImage || selectedPictogram) && (
                  <View className="mt-2 h-10 w-2/3 flex-col items-center justify-center">
                    <SettingsButton
                      icon={
                        <MaterialIcons
                          name="format-paint"
                          size={22}
                          color="#5c5c5c"
                        />
                      }
                      text="Personalizza Colore"
                      color="#FFFFCA"
                      onPress={() => setView("Color")}
                    />
                  </View>
                )}
              </View>
            </View>
            <View className="flex h-full w-1/2 flex-col items-center justify-start gap-4 pt-10">
              <View className="h-[15%] w-full flex-col items-center justify-center">
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
                <View className="h-20 w-full flex-col items-center justify-center">
                  <View className="h-10 w-3/4 flex-col items-center justify-center">
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
                  <View className="h-2" />
                  <View className="h-10 w-3/4 flex-col items-center justify-center">
                    <SettingsButton
                      text="Seleziona Categorie"
                      color="#FFFFCA"
                      onPress={() => setView("Category")}
                    />
                  </View>
                </View>
              ) : (
                <View className="h-10 w-3/4 flex-col items-center justify-center">
                  <SettingsButton
                    icon={
                      <MaterialIcons name="image" size={22} color="#5c5c5c" />
                    }
                    text="Personalizza immagine"
                    color="#FFFFCA"
                    onPress={pickImage}
                  />
                </View>
              )}
              <View className="flex w-full flex-1 grow items-end justify-end">
                <View className="h-14 w-full flex-row items-center justify-center">
                  <View className="w-1/2 items-center justify-center">
                    <IconButton
                      icon={
                        <MaterialIcons name="check" size={32} color="white" />
                      }
                      color="#89BF93"
                      onPress={onConfirm}
                    />
                  </View>
                  <View className="w-1/2 items-center justify-center">
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
