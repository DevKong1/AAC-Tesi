import { useEffect, useRef, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Carousel, {
  type ICarouselInstance,
} from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AntDesign,
  Entypo,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import BookCard from "../components/BookCard";
import BottomIcons from "../components/BottomIcons";
import IconButton from "../components/IconButton";
import PictogramCard from "../components/PictogramCard";
import { getBooks } from "../hooks/booksHandler";
import { useCompanionStore } from "../store/store";
import { shadowStyle } from "../utils/shadowStyle";
import { type Book } from "../utils/types/commonTypes";

export default function ReadingPage() {
  const companionStore = useCompanionStore();
  const r = useRef<ICarouselInstance>(null);
  const { width, height } = Dimensions.get("window");

  const [books, setBooks] = useState([] as Book[]);
  const [currentBook, setCurrentBook] = useState(undefined as Book | undefined);
  const [currentPage, setCurrentPage] = useState(0);

  const iconSize = 90;
  const fontSize = 32;
  const iconColor = "#5C5C5C";
  // TODO Import reading settings
  const rows = 3;
  const columns = 4;

  const loadBooks = async () => {
    const books = await getBooks();

    companionStore.speak("Leggiamo insieme un bel libro!", "top");
    // set state with the result
    setBooks(books);
  };
  useEffect(() => {
    // In case of reload
    loadBooks().catch((err) => console.log(err));
  }, []);

  if (currentBook) {
    return (
      <SafeAreaView className="flex h-full w-full flex-row">
        <View className="flex h-full w-[8%] flex-row items-center justify-center">
          <View className="flex h-full w-[90%] items-center justify-center bg-[#e1ada3] pl-5">
            <MaterialIcons
              name="arrow-back-ios"
              style={shadowStyle.whiteShadow}
              size={iconSize}
              color={iconColor}
            />
          </View>
          <View className="h-full w-[10%] bg-[#f0e1de]" />
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
                    {currentBook.pictograms[
                      currentPage * rows * columns + columns * row + col
                    ] ? (
                      <PictogramCard
                        pictogram={
                          currentBook.pictograms[
                            currentPage * rows * columns + columns * row + col
                          ]!
                        }
                        fontSize={fontSize}
                        bgcolor={"#B9D2C3"}
                        onPress={() => null}
                      />
                    ) : null}
                  </View>
                ))}
              </View>
            ))}
          </View>

          <View className="flex h-[25%] w-full flex-row items-center justify-center">
            <View className="h-full w-1/3 items-center justify-center">
              <Text className="text-default text-2xl font-semibold">
                Capitolo:
              </Text>
            </View>
            <View className="h-full w-1/3 items-center justify-center">
              <View className="h-2/3 w-1/2">
                <IconButton
                  onPress={() => null}
                  color={"#89BF93"}
                  icon={
                    <MaterialIcons
                      name="play-arrow"
                      size={64}
                      color={"white"}
                    />
                  }
                />
              </View>
            </View>
            <View className="h-full w-1/3" />
          </View>
        </View>
        <View className="flex h-full w-[8%] flex-row items-center justify-center">
          <View className="h-full w-[10%] bg-[#e5ece8]" />
          <View className="flex h-full w-[90%] items-center justify-center bg-[#bed4c6]">
            <MaterialIcons
              name="arrow-forward-ios"
              style={shadowStyle.whiteShadow}
              size={iconSize}
              color={iconColor}
            />
          </View>
        </View>
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
