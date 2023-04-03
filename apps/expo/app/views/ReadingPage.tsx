import { useEffect, useRef, useState } from "react";
import { Dimensions, Text, View } from "react-native";
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
import { getBooks } from "../hooks/booksHandler";
import { useCompanionStore } from "../store/store";
import { type Book } from "../utils/types/commonTypes";

export default function ReadingPage() {
  const companionStore = useCompanionStore();
  const r = useRef<ICarouselInstance>(null);
  const { width, height } = Dimensions.get("window");

  const [books, setBooks] = useState([] as Book[]);
  const [currentBook, setCurrent] = useState(undefined as Book | undefined);

  // TODO Import reading settings
  const rows = 5;
  const columns = 5;

  const loadBooks = async () => {
    const books = await getBooks();

    companionStore.speak("Leggiamo insieme un bel libro!", "3xl", "top");
    // set state with the result
    setBooks(books);
  };
  useEffect(() => {
    // In case of reload
    loadBooks().catch((err) => console.log(err));
  }, []);

  if (currentBook) {
    return (
      <SafeAreaView className="h-[85%] w-[80%] flex-col">
        {[...Array(rows).keys()].map((row) => (
          <View
            key={row}
            style={{ height: `${(100 / rows).toFixed(0)}%` }}
            className="w-full flex-row items-center justify-start"
          >
            {[...Array(rows).keys()].map((col) => (
              <View
                key={col}
                style={{ height: `${(100 / rows).toFixed(0)}%` }}
                className="w-full flex-row items-center justify-start"
              ></View>
            ))}
          </View>
        ))}
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
                  setCurrent(el.item);
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
