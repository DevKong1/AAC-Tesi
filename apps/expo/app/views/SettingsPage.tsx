import React, { useEffect, useState } from "react";
import { BackHandler, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import IconButton from "../components/IconButton";
import MenuCard from "../components/MenuCard";
import PictogramCard from "../components/PictogramCard";
import PictogramCustomizationModal from "../components/PictogramCustomizationModal";
import PictogramSelectionModal from "../components/PictogramSelectionModal";
import SettingsButton from "../components/SettingsButton";
import { useCompanionStore, usePictogramStore } from "../store/store";
import { isDeviceLarge } from "../utils/commonFunctions";
import { type Pictogram } from "../utils/types/commonTypes";

export default function SettingsPage() {
  const pictogramStore = usePictogramStore();
  const router = useRouter();
  const [selectedMenu, setMenu] = useState("Impostazioni");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  const fontSize = isDeviceLarge() ? 32 : 18;

  const addPictogram = (pressed: Pictogram) => {
    pictogramStore.addFavourite(pressed._id);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (selectedMenu != "Impostazioni") {
          setMenu("Impostazioni");
          return true;
        } else {
          router.back();
          return true;
        }
      },
    );

    return () => backHandler.remove();
  }, [selectedMenu]);

  const selectedTab = () => {
    switch (selectedMenu) {
      case "Preferiti":
        return (
          <View className="flex h-full w-full flex-col items-center justify-center">
            <PictogramSelectionModal
              isVisible={showAddModal}
              onSelect={addPictogram}
              onClose={() => {
                setShowAddModal(false);
              }}
              defaultText="Cerca un pittogramma da aggiungere tra i preferiti..."
              showFavourites={false}
            />
            <View className="flex h-3/4 w-full">
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
                  <View className="flex h-1/4 w-full items-center justify-center">
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
                    setShowAddModal(true);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case "AI":
        return <View />;
      case "Personalizza Pittogrammi":
        return (
          <View className="flex h-full w-full flex-col items-center justify-start pt-4">
            <PictogramCustomizationModal
              isVisible={showCustomizeModal}
              onClose={() => {
                setShowCustomizeModal(false);
              }}
            />
            <View className="flex h-14 w-80 items-center justify-center p-1">
              <SettingsButton
                text="Modifica/Crea pittogramma"
                color="#C6D7F9"
                onPress={() => {
                  setShowCustomizeModal(true);
                }}
              />
            </View>
            <View className="flex h-14 w-80 items-center justify-center p-1">
              <SettingsButton
                text="Cambia pittogrammi modificati/creati"
                color="#C6D7F9"
                onPress={() => {
                  return;
                }}
              />
            </View>
            <View className="flex h-14 w-80 items-center justify-center p-1">
              <SettingsButton
                text="Elimina pittogrammi modificati/creati"
                color="#C6D7F9"
                onPress={() => {
                  return;
                }}
              />
            </View>
          </View>
        );
      default:
        return (
          <View className="flex h-full flex-row items-center justify-center pb-10">
            <View className="flex h-[65%] w-[25%]">
              <MenuCard
                text="Preferiti"
                fontSize={fontSize}
                bgcolor="#FFFFCA"
                icon={<MaterialIcons name="star" size={90} color="#5C5C5C" />}
                onPress={() => setMenu("Preferiti")}
              />
            </View>
            <View className="w-6" />
            <View className="flex h-[65%] w-[25%]">
              <MenuCard
                text="Personalizza Pittogrammi"
                fontSize={fontSize}
                bgcolor="#B9D2C3"
                icon={<MaterialIcons name="create" size={90} color="#5C5C5C" />}
                onPress={() => setMenu("Personalizza Pittogrammi")}
              />
            </View>
            <View className="w-6" />
            <View className="flex h-[65%] w-[25%]">
              <MenuCard
                text="AI"
                fontSize={fontSize}
                bgcolor="#f2b7b3"
                icon={<MaterialIcons name="apps" size={90} color="#5C5C5C" />}
                onPress={() => setMenu("AI")}
              />
            </View>
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
