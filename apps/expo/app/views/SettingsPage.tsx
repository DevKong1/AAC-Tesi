import React, { useEffect, useState } from "react";
import { BackHandler, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import IconButton from "../components/IconButton";
import MenuCard from "../components/MenuCard";
import PictogramCard from "../components/PictogramCard";
import PictogramSelectionModal from "../components/PictogramSelectionModal";
import { useCompanionStore, usePictogramStore } from "../store/store";
import { isDeviceLarge } from "../utils/commonFunctions";
import { type Pictogram } from "../utils/types/commonTypes";

export default function SettingsPage() {
  const pictogramStore = usePictogramStore();
  const router = useRouter();
  const [selectedMenu, setMenu] = useState("Impostazioni");
  const [showAddModal, setShowAddModal] = useState(false);

  const fontSize = isDeviceLarge() ? 32 : 18;

  const addPictogram = (pressed: Pictogram) => {
    pictogramStore.addFavourite(pressed._id);
  };

  const onModalClose = () => {
    setShowAddModal(false);
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
      case "Pittogrammi":
        return (
          <ScrollView
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "center",
            }}
            className="flex flex-col"
          >
            <PictogramSelectionModal
              isVisible={showAddModal}
              onSelect={addPictogram}
              onClose={onModalClose}
              defaultText="Cerca un pittogramma da aggiungere tra i preferiti..."
              showFavourites={false}
            />
            <Text className="text-default font-text pb-2 text-center text-base lg:text-lg">
              Preferiti:
            </Text>
            {pictogramStore.favourites.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="h-32"
              >
                {pictogramStore.getFavouritePictograms().map((pictogram, i) => (
                  <View className="h-32 w-32" key={i}>
                    <PictogramCard
                      pictogram={pictogram}
                      bgcolor="#FFFFCA"
                      onPress={pictogramStore.removeFavourite}
                      args={pictogram._id}
                    />
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text className="text-default font-text py-6 text-center text-base lg:text-lg">
                Nessun pittogramma tra i preferiti, puoi aggiungerlo col
                pulsante sotto...
              </Text>
            )}
            <View className="flex h-14 w-14 flex-row content-center justify-center">
              <IconButton
                icon={<MaterialIcons name="add" size={32} color="white" />}
                color="#89BF93"
                onPress={() => {
                  setShowAddModal(true);
                }}
              />
            </View>
          </ScrollView>
        );
      case "AI":
        return <View />;
      default:
        return (
          <View className="flex h-full flex-row items-center justify-center pb-10">
            <View className="w-6" />
            <View className="flex h-[65%] w-[25%]">
              <MenuCard
                text="Pittogrammi"
                fontSize={fontSize}
                bgcolor="#FFFFCA"
                icon={<MaterialIcons name="image" size={90} color="#5C5C5C" />}
                onPress={() => setMenu("Pittogrammi")}
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
