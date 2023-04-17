import { useEffect, useRef, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Carousel, {
  type ICarouselInstance,
} from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

import BottomIcons from "../components/BottomIcons";
import IconButton from "../components/IconButton";
import PictogramCard from "../components/PictogramCard";
import { getPages } from "../hooks/diaryHandler";
import { useCompanionStore } from "../store/store";
import { isDeviceLarge } from "../utils/commonFunctions";
import { shadowStyle } from "../utils/shadowStyle";
import { Pictogram, type DiaryPage } from "../utils/types/commonTypes";

export default function ReadingPage() {
  const companionStore = useCompanionStore();

  const [pages, setPages] = useState([] as DiaryPage[]);
  const [selectedPage, selectPage] = useState(
    undefined as DiaryPage | undefined,
  );

  const iconSize = isDeviceLarge() ? 90 : 42;
  const iconColor = "#5C5C5C";
  const fontSize = isDeviceLarge() ? 32 : 16;

  const loadPages = async () => {
    const loadedPages = await getPages();

    companionStore.speak("Guardiamo il tuo diario!");
    // set state with the result
    setPages(loadedPages);
  };

  useEffect(() => {
    // In case of reload
    loadPages().catch((err) => console.log(err));
  }, []);

  if (selectedPage) {
    return (
      <SafeAreaView className="flex h-full w-full flex-row"></SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-full w-full flex-row">
      <BottomIcons />
    </SafeAreaView>
  );
}
