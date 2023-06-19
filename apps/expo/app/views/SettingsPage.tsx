import React, { useEffect, useState } from "react";
import { Alert, BackHandler, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";

import AddBookModal from "../components/AddBookModal";
import BookSelectionModal from "../components/BookSelectionModal";
import IconButton from "../components/IconButton";
import MenuCard from "../components/MenuCard";
import PictogramCard from "../components/PictogramCard";
import PictogramCustomizationModal from "../components/PictogramCustomizationModal";
import PictogramSearchModal from "../components/PictogramSearchModal";
import PictogramSelectionModal from "../components/PictogramSelectionModal";
import SettingsButton from "../components/SettingsButton";
import {
  //  useApiStore,
  useBookStore,
  useCompanionStore,
  usePictogramStore,
} from "../store/store";
import { type Book, type Pictogram } from "../utils/types/commonTypes";

export default function SettingsPage() {
  //  const apiStore = useApiStore();
  const companionStore = useCompanionStore();
  const pictogramStore = usePictogramStore();
  const bookStore = useBookStore();
  const router = useRouter();

  const [selectedMenu, setMenu] = useState("Impostazioni");
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showRemoveBookModal, setShowRemoveBookModal] = useState(false);
  const [showAddPictogramModal, setShowAddPictogramModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  // LOGOUT
  const { signOut } = useAuth();

  const addPictogram = async (pressed: Pictogram) => {
    if (!(await pictogramStore.addFavourite(pressed._id)))
      Alert.alert("Errore, pittoramma non aggiunto!");
  };

  const removePictogram = async (pictogram: Pictogram) => {
    if (pictogram.customPictogram)
      (await pictogramStore.removeCustomPictogram(
        pictogram.customPictogram._id,
      ))
        ? null
        : Alert.alert("Errore rimozione pittogramma!");
  };

  const removeBook = async (book: Book) => {
    (await bookStore.removeBook(book.id))
      ? null
      : Alert.alert("Errore rimozione libro!");
  };

  useEffect(() => {
    companionStore.setVisible(false);
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (selectedMenu != "Impostazioni") {
          setMenu("Impostazioni");
        } else {
          companionStore.setVisible(true);
          router.back();
        }
        return true;
      },
    );

    return () => backHandler.remove();
  }, [selectedMenu]);

  const selectedTab = () => {
    switch (selectedMenu) {
      case "Libri":
        return (
          <View className="flex h-full w-full flex-col items-center justify-start pt-4">
            <AddBookModal
              isVisible={showAddBookModal}
              onClose={() => {
                setShowAddBookModal(false);
              }}
            />
            <BookSelectionModal
              isVisible={showRemoveBookModal}
              onSelect={removeBook}
              onClose={() => setShowRemoveBookModal(false)}
            />
            <View className="flex h-14 w-80 items-center justify-center p-1">
              <SettingsButton
                text="Aggiungi libro"
                color="#C6D7F9"
                onPress={() => setShowAddBookModal(true)}
              />
            </View>
            <View className="flex h-14 w-80 items-center justify-center p-1">
              <SettingsButton
                text="Elimina libro aggiunto"
                color="#C6D7F9"
                onPress={() => setShowRemoveBookModal(true)}
              />
            </View>
          </View>
        );
      case "Preferiti":
        return (
          <View className="flex h-full w-full flex-col items-center justify-center">
            <PictogramSearchModal
              isVisible={showAddPictogramModal}
              onSelect={addPictogram}
              onClose={() => {
                setShowAddPictogramModal(false);
              }}
              defaultText="Cerca un pittogramma da aggiungere tra i preferiti..."
              defaultData={pictogramStore.getCustomPictograms()}
            />
            <View className="flex h-4/5 w-full">
              {pictogramStore.favourites.length > 0 ? (
                <View className="flex h-full w-full items-center justify-center">
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="flex h-3/4"
                  >
                    {pictogramStore
                      .getFavouritePictograms()
                      .map((pictogram, i) => (
                        <View
                          className="h-44 w-44 items-center justify-center"
                          key={i}
                        >
                          <PictogramCard
                            pictogram={pictogram}
                            bgcolor="#FFFFCA"
                            onPress={pictogramStore.removeFavourite}
                            args={pictogram._id}
                          />
                        </View>
                      ))}
                  </ScrollView>
                  <View className="h-1/5a flex w-full items-center justify-center">
                    <Text className="text-default font-text text-center text-base lg:text-lg">
                      Premi su un pittogramma per rimuoverlo dai preferiti
                    </Text>
                  </View>
                </View>
              ) : (
                <View className="flex h-full w-full items-center justify-center">
                  <Text className="text-default font-text py-6 text-center text-base lg:text-lg">
                    Nessun pittogramma tra i preferiti, puoi aggiungerlo col
                    pulsante sotto...
                  </Text>
                </View>
              )}
            </View>
            <View className="flex h-1/4 w-full flex-row items-center justify-center">
              <View className="h-14 w-14">
                <IconButton
                  icon={<MaterialIcons name="add" size={32} color="white" />}
                  color="#89BF93"
                  onPress={() => {
                    setShowAddPictogramModal(true);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case "Personalizza Pittogrammi":
        return (
          <View className="flex h-full w-full flex-col items-center justify-start pt-4">
            <PictogramCustomizationModal
              isVisible={showCustomizeModal}
              onClose={() => {
                setShowCustomizeModal(false);
              }}
            />
            <PictogramSelectionModal
              isVisible={showRemoveModal}
              onSelect={removePictogram}
              onClose={() => {
                setShowRemoveModal(false);
              }}
              data={pictogramStore.getCustomPictograms()}
            />
            <View className="flex h-14 w-80 items-center justify-center p-1">
              <SettingsButton
                text="Modifica/Crea pittogramma"
                color="#C6D7F9"
                onPress={() => setShowCustomizeModal(true)}
              />
            </View>
            <View className="flex h-14 w-80 items-center justify-center p-1">
              <SettingsButton
                text="Elimina pittogrammi modificati/creati"
                color="#C6D7F9"
                onPress={() => setShowRemoveModal(true)}
              />
            </View>
          </View>
        );
      default:
        return (
          <View className="justify-centerr h-full w-full flex-col items-center">
            <View className="flex h-[70%] w-full flex-row items-start justify-center">
              <View className="flex h-[90%] w-[25%]">
                <MenuCard
                  text="Preferiti"
                  bgcolor="#FFFFCA"
                  icon={<MaterialIcons name="star" size={90} color="#5C5C5C" />}
                  onPress={() => setMenu("Preferiti")}
                />
              </View>
              <View className="w-6" />
              <View className="flex h-[90%] w-[25%]">
                <MenuCard
                  text="Personalizza Pittogrammi"
                  bgcolor="#C6D7F9"
                  icon={
                    <MaterialIcons name="create" size={90} color="#5C5C5C" />
                  }
                  onPress={() => setMenu("Personalizza Pittogrammi")}
                />
              </View>
              <View className="w-6" />
              <View className="flex h-[90%] w-[25%]">
                <MenuCard
                  text="Libri"
                  bgcolor="#B9D2C3"
                  icon={
                    <MaterialIcons name="menu-book" size={90} color="#5C5C5C" />
                  }
                  onPress={() => setMenu("Libri")}
                />
              </View>
            </View>
            {/* 
            <View className="flex h-[20%] w-full flex-row items-start justify-center">
              <View className="flex h-12 w-[25%] items-start justify-center">
                <SettingsButton
                  text="Logout"
                  color="#F69898"
                  onPress={async () => {
                    await signOut();
                    companionStore.stop();
                    apiStore.setLoaded(false);
                  }}
                />
              </View> 
            </View> */}
          </View>
        );
    }
  };

  return (
    <SafeAreaView>
      <View className="flex h-full w-full flex-col">
        <View className="flex h-[15%] items-center justify-center text-center">
          <Text className="text-default text-center text-lg font-semibold lg:text-4xl">
            {selectedMenu}
          </Text>
        </View>
        <View className="flex h-[85%] items-center justify-center">
          {selectedTab()}
        </View>
      </View>
    </SafeAreaView>
  );
}
