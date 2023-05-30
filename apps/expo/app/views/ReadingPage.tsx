import { useEffect, useRef, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Carousel, {
  type ICarouselInstance,
} from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

import BookCard from "../components/BookCard";
import BottomIcons from "../components/BottomIcons";
import PictogramCard from "../components/PictogramCard";
import { getBooks } from "../hooks/booksHandler";
import { getPictogram } from "../hooks/pictogramsHandler";
import { useCompanionStore } from "../store/store";
import { isDeviceLarge } from "../utils/commonFunctions";
import { shadowStyle } from "../utils/shadowStyle";
import { type Book } from "../utils/types/commonTypes";

export default function ReadingPage() {
  const companionStore = useCompanionStore();
  const r = useRef<ICarouselInstance>(null);
  const { width, height } = Dimensions.get("window");

  const [books, setBooks] = useState([] as Book[]);
  const [currentBook, setCurrentBook] = useState(undefined as Book | undefined);
  const [currentPage, setCurrentPage] = useState(0);

  const iconSize = isDeviceLarge() ? 90 : 42;
  const fontSize = isDeviceLarge() ? 32 : 16;

  const iconColor = "#5C5C5C";
  // TODO Import reading settings
  const rows = 3;
  const columns = 4;

  const loadBooks = async () => {
    const books = await getBooks();

    companionStore.speak("Leggiamo insieme un bel libro!");
    // set state with the result
    setBooks(books);
  };
  useEffect(() => {
    // In case of reload
    loadBooks().catch((err) => console.log(err));
  }, []);

  const getPictogramIndex = (row: number, col: number) => {
    // We sum the index of the first pictogram in the page to the number of pictograms in each row before
    return currentPage * rows * columns + columns * row + col;
  };

  const getCurrentPictogramsText = () => {
    if (currentBook) {
      const start = currentPage * rows * columns;
      const end = start + rows * columns;
      return currentBook.pictograms
        .slice(start, end)
        .flatMap((el) => (el.keywords[0] ? el.keywords[0].keyword : ""))
        .join(" ");
    } else return "";
  };

  const isNextPageEmpty = () => {
    if (currentBook)
      return currentBook.pictograms.length < (currentPage + 1) * rows * columns;
    else return true;
  };

  const readAll = () => {
    companionStore.speak(getCurrentPictogramsText());
  };

  if (currentBook) {
    return (
      <SafeAreaView className="flex h-full w-full flex-row">
        <View className="flex h-full w-[8%] flex-row">
          <View className="flex grow bg-[#e1ada3]">
            <TouchableOpacity
              className="ml-2 h-full w-full items-center justify-center"
              onPress={() =>
                currentPage > 0 ? setCurrentPage((el) => el - 1) : null
              }
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
            {[...Array(rows).keys()].map((row) => (
              <View
                key={row}
                style={{
                  height: `${(100 / rows).toFixed(0)}%`,
                }}
                className="w-full flex-row items-center justify-start"
              >
                {[...Array(columns).keys()].map((col) => (
                  <View
                    key={`${row}_${col}`}
                    style={{ width: `${(100 / columns).toFixed(0)}%` }}
                    className="flex h-full"
                  >
                    {currentBook.pictograms[getPictogramIndex(row, col)] ? (
                      <PictogramCard
                        pictogram={
                          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                          currentBook.pictograms[getPictogramIndex(row, col)]!
                        }
                        fontSize={fontSize}
                        bgcolor={"#B9D2C3"}
                        onPress={() => {
                          const current =
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            currentBook.pictograms[
                              getPictogramIndex(row, col)
                            ]!;
                          companionStore.speak(
                            current.keywords[0]
                              ? current.keywords[0].keyword
                              : "",
                          );
                        }}
                      />
                    ) : null}
                  </View>
                ))}
              </View>
            ))}
          </View>

          <View className="flex h-[25%] w-full flex-row items-center justify-center">
            <View className="h-full w-1/3 items-center justify-center">
              <Text className="text-default text-base font-semibold lg:text-2xl">
                Pagina:
              </Text>
            </View>
            <View className="h-full w-1/3 items-center justify-center">
              <View className="h-2/3 w-1/2">
                <PictogramCard
                  pictogram={getPictogram(36257)}
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
              onPress={() => {
                isNextPageEmpty() ? null : setCurrentPage((el) => el + 1);
              }}
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
      <View className="flex h-1/5 w-full flex-row items-center justify-center">
        <Text className="text-default text-3xl font-semibold">
          Scegli un libro da leggere:
        </Text>
      </View>
      <View className="flex h-3/5 w-full items-center justify-center">
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
            width={600}
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
      <View className="flex h-1/5 w-full"></View>
      <BottomIcons />
    </SafeAreaView>
  );
}
