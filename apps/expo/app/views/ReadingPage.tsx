import { useEffect, useRef, useState } from "react";
import { BackHandler, Dimensions, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Carousel, {
  type ICarouselInstance,
} from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import BookCard from "../components/BookCard";
import BottomIcons from "../components/BottomIcons";
import PictogramCard from "../components/PictogramCard";
import {
  useBookStore,
  useCompanionStore,
  usePictogramStore,
} from "../store/store";
import { isDeviceLarge } from "../utils/commonFunctions";
import { dummyBooks } from "../utils/dummyResponses";
import { shadowStyle } from "../utils/shadowStyle";
import { type Book } from "../utils/types/commonTypes";

export default function ReadingPage() {
  const router = useRouter();
  const companionStore = useCompanionStore();
  const bookStore = useBookStore();
  const pictogramStore = usePictogramStore();

  const r = useRef<ICarouselInstance>(null);
  const { width, height } = Dimensions.get("window");

  const [books, setBooks] = useState([] as Book[]);
  const [currentBook, setCurrentBook] = useState(undefined as Book | undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [readIndex, setReadIndex] = useState(undefined as number | undefined);

  const iconSize = isDeviceLarge() ? 90 : 42;

  const iconColor = "#5C5C5C";
  const rows = bookStore.readingSettings.rows;
  const columns = bookStore.readingSettings.columns;

  const resetSpeech = () => {
    companionStore.resetSpeech();
    setReadIndex(undefined);
  };

  const previousPage = () => {
    if (currentBook && currentPage > 1) {
      resetSpeech();
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentBook && countPages() > currentPage) {
      resetSpeech();
      setCurrentPage(currentPage + 1);
    }
  };

  const countPages = () => {
    if (currentBook) {
      return Math.ceil(currentBook.pictograms.length / rows);
    } else return 0;
  };

  // Used to recursively read all pictograms while updating state
  const recursiveRead = (i: number, flattenedPage: string[]) => {
    if (i >= flattenedPage.length) {
      resetSpeech();
      return;
    }
    setReadIndex(i);
    const currentPictogram = pictogramStore.getPictogram(flattenedPage[i]!);
    const currentText = currentPictogram
      ? pictogramStore.getTextFromPictogram(currentPictogram)
      : undefined;
    if (currentText)
      companionStore.speak(currentText, undefined, undefined, () => {
        recursiveRead(i + 1, flattenedPage);
      });
  };

  const readOne = (id: string) => {
    resetSpeech();
    const pictogram = pictogramStore.getPictogram(id);
    const text = pictogram
      ? pictogramStore.getTextFromPictogram(pictogram)
      : undefined;
    if (text) companionStore.speak(text);
  };

  const readAll = () => {
    if (currentBook) {
      const currentPageFlattened = getCurrentPage().flatMap((el) => el);
      recursiveRead(0, currentPageFlattened);
    }
  };

  const getCurrentPage = () => {
    if (currentBook && currentBook.pictograms.length > 0)
      return currentBook.pictograms.slice(
        rows * (currentPage - 1),
        rows * currentPage,
      );
    else return [];
  };

  useEffect(() => {
    const baseBooks = dummyBooks; // Just for testing purposes
    const customBooks = bookStore.customBooks;
    // set state with the result
    setBooks(baseBooks.concat(customBooks));

    companionStore.speak("Leggiamo insieme un bel libro!");
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (currentBook) {
          setCurrentPage(1);
          setCurrentBook(undefined);
        } else router.back();

        resetSpeech();
        return true;
      },
    );

    return () => backHandler.remove();
  }, [currentBook]);

  if (currentBook) {
    return (
      <SafeAreaView className="flex h-full w-full flex-row">
        <View className="flex h-full w-[8%] flex-row">
          <View className="flex grow bg-[#e1ada3]">
            <TouchableOpacity
              className="ml-2 h-full w-full items-center justify-center"
              onPress={previousPage}
            >
              <MaterialIcons
                name="arrow-back-ios"
                style={shadowStyle.whiteShadow}
                size={iconSize}
                color={iconColor}
              />
            </TouchableOpacity>
          </View>
          <View className="flex h-full w-2 bg-[#f0e1de]" />
        </View>
        <View className="flex h-full w-[84%] flex-col">
          <View className="h-[75%] w-full">
            {getCurrentPage().map((row, i) => (
              <View
                key={`row${i}`}
                style={{
                  height: `${(100 / rows).toFixed(0)}%`,
                }}
                className="w-full flex-row items-center justify-start"
              >
                {row.map((col, j) => (
                  <View
                    key={`row${i}_col${j}`}
                    style={{ width: `${(100 / columns).toFixed(0)}%` }}
                    className="flex h-full"
                  >
                    <PictogramCard
                      pictogram={pictogramStore.getPictogram(col)}
                      bgcolor={"#B9D2C3"}
                      highlight={
                        readIndex == i * columns + j ? "#15d0f1b4" : undefined
                      }
                      onPress={() => readOne(col)}
                    />
                  </View>
                ))}
              </View>
            ))}
          </View>

          <View className="flex h-[25%] w-full flex-row items-center justify-center">
            <View className="h-full w-1/3 items-center justify-center" />
            <View className="h-full w-1/3 items-center justify-center">
              <View className="h-2/3 w-1/2">
                <PictogramCard
                  noCaption
                  pictogram={pictogramStore.getPictogram("36257")}
                  bgcolor="#89BF93"
                  onPress={readAll}
                />
              </View>
            </View>
            <View className="h-full w-1/3" />
          </View>
        </View>
        <View className="flex h-full w-[8%] flex-row">
          <View className="h-full w-2 bg-[#e5ece8]" />
          <View className="flex grow bg-[#bed4c6]">
            <TouchableOpacity
              className="h-full w-full items-center justify-center"
              onPress={nextPage}
            >
              <MaterialIcons
                name="arrow-forward-ios"
                style={shadowStyle.whiteShadow}
                size={iconSize}
                color={iconColor}
              />
            </TouchableOpacity>
          </View>
        </View>
        <BottomIcons onMute={() => setReadIndex(undefined)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-full w-full flex-col">
      <View className="flex h-[15%] w-full flex-row items-center justify-center">
        <Text className="text-default text-xl font-semibold">
          Scegli un libro da leggere:
        </Text>
      </View>
      <View className="flex h-[85%] w-full items-start justify-center">
        {books.length > 0 ? (
          <Carousel
            ref={r}
            loop={false}
            pagingEnabled={true}
            style={{
              width: width,
              height: height * 0.6,
              justifyContent: "center",
              alignItems: "flex-start",
            }}
            width={isDeviceLarge() ? 600 : 300}
            height={height * 0.6}
            data={books}
            scrollAnimationDuration={1000}
            renderItem={(el) => (
              <BookCard
                book={el.item}
                onPress={() => {
                  setCurrentBook(el.item);
                }}
              />
            )}
          />
        ) : (
          <Text className="text-default text-3xl font-semibold">
            Nessun libro trovato..
          </Text>
        )}
      </View>
      <BottomIcons />
    </SafeAreaView>
  );
}
