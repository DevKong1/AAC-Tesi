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
import { getDummyBooks } from "../hooks/booksHandler";
import { getPictogram } from "../hooks/pictogramsHandler";
import { useBookStore, useCompanionStore } from "../store/store";
import {
  getTextFromPictogramsMatrix,
  isDeviceLarge,
} from "../utils/commonFunctions";
import { shadowStyle } from "../utils/shadowStyle";
import { type Book } from "../utils/types/commonTypes";

export default function ReadingPage() {
  const router = useRouter();
  const companionStore = useCompanionStore();
  const bookStore = useBookStore();
  const r = useRef<ICarouselInstance>(null);
  const { width, height } = Dimensions.get("window");

  const [books, setBooks] = useState([] as Book[]);
  const [currentBook, setCurrentBook] = useState(undefined as Book | undefined);
  const [currentPage, setCurrentPage] = useState(1);

  const iconSize = isDeviceLarge() ? 90 : 42;

  const iconColor = "#5C5C5C";
  const rows = bookStore.readingSettings.rows;
  const columns = bookStore.readingSettings.columns;

  useEffect(() => {
    const baseBooks = getDummyBooks(); // Just for Development
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
          setCurrentBook(undefined);
        } else {
          companionStore.setPosition("default");
          router.back();
        }
        return true;
      },
    );

    return () => backHandler.remove();
  }, []);

  const previousPage = () => {
    if (currentBook && currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentBook && countPages() > currentPage)
      setCurrentPage(currentPage + 1);
  };

  const countPages = () => {
    if (currentBook) {
      return Math.ceil(currentBook.pictograms.length / rows);
    } else return 0;
  };

  const readAll = () => {
    if (currentBook) {
      const text = getTextFromPictogramsMatrix(getCurrentPage());
      companionStore.speak(text);
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
            {/* FOR EACH ROW */}
            {getCurrentPage().map((row, i) => (
              <View
                key={`row${i}`}
                style={{
                  height: `${(100 / rows).toFixed(0)}%`,
                }}
                className="w-full flex-row items-center justify-start"
              >
                {/* FOR EACH COLUMN */}
                {row.map((col, j) => (
                  <View
                    key={`row${i}_col${j}`}
                    style={{ width: `${(100 / columns).toFixed(0)}%` }}
                    className="flex h-full"
                  >
                    <PictogramCard
                      pictogram={col}
                      bgcolor={"#B9D2C3"}
                      onPress={() => {
                        companionStore.speak(
                          col.keywords[0] ? col.keywords[0].keyword : "",
                        );
                      }}
                    />
                  </View>
                ))}
              </View>
            ))}
          </View>

          <View className="flex h-[25%] w-full flex-row items-center justify-center">
            <View className="h-full w-1/3 items-center justify-center"></View>
            <View className="h-full w-1/3 items-center justify-center">
              <View className="h-2/3 w-1/2">
                <PictogramCard
                  pictogram={getPictogram("36257")}
                  noCaption={true}
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
        <BottomIcons />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-full w-full flex-col">
      <View className="flex h-1/5 w-full flex-row items-start justify-center">
        <Text className="text-default text-xl font-semibold">
          Scegli un libro da leggere:
        </Text>
      </View>
      <View className="flex h-4/5 w-full items-center justify-center">
        {books.length > 0 ? (
          <Carousel
            ref={r}
            loop={false}
            pagingEnabled={true}
            style={{
              width: width,
              height: height * 0.6,
              justifyContent: "center",
              alignItems: "center",
            }}
            width={isDeviceLarge() ? 600 : 300}
            height={height * 0.6}
            data={books}
            scrollAnimationDuration={1000}
            renderItem={(el) => (
              <BookCard
                book={el.item}
                onPress={() => {
                  setCurrentBook(el.item); // TODO Check for correct book format (rows, columns) and fix if incorrect
                  companionStore.setPosition("center");
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
