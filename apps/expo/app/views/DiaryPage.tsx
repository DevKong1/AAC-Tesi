import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { randomUUID } from "expo-crypto";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import BottomIcons from "../components/BottomIcons";
import PictogramCard from "../components/PictogramCard";
import { getPictogram } from "../hooks/pictogramsHandler";
import {
  useCompanionStore,
  useDiaryStore,
  useInputStore,
} from "../store/store";
import {
  formatToMatchColumns,
  getTextFromPictogramsArray,
  isDeviceLarge,
} from "../utils/commonFunctions";
import { shadowStyle } from "../utils/shadowStyle";
import {
  type DiaryPage,
  type Pictogram,
  type diaryReqArgs,
} from "../utils/types/commonTypes";

export default function DiaryPage() {
  const router = useRouter();
  const companionStore = useCompanionStore();
  const diaryStore = useDiaryStore();
  const inputStore = useInputStore();

  const today = new Date();
  const [requestID, setReqId] = useState(undefined as string | undefined);
  const [currentPage, setPage] = useState(undefined as DiaryPage | undefined);

  const fontSize = isDeviceLarge() ? 32 : 16;
  const iconSize = isDeviceLarge() ? 90 : 42;
  const iconColor = "#5C5C5C";
  const columns = diaryStore.readingSettings.columns;

  const loadPage = async (date: string) => {
    let loadedPage = diaryStore.getDiaryPage(date);
    if (!loadedPage) {
      loadedPage = {
        date: today.toLocaleDateString(),
        pictograms: [],
      } as DiaryPage;
    }
    setPage(loadedPage);
  };

  const readEntry = (entry: Pictogram[]) => {
    if (entry.length > 0) {
      companionStore.speak(getTextFromPictogramsArray(entry));
    }
  };

  const modifyEntry = (index: number) => {
    if (currentPage) {
      const id = randomUUID() as string;
      setReqId(id);
      inputStore.inputRequest(id, "modifyEntry", {
        date: currentPage.date,
        entry: currentPage.pictograms[index],
        index: index,
      } as diaryReqArgs);
      router.push({
        pathname: "/views/TalkingPage",
        params: {
          inputID: id,
        },
      });
    }
  };

  function addParagraph(): void {
    if (currentPage) {
      const id = randomUUID() as string;
      setReqId(id);
      inputStore.inputRequest(id, "addParagraph", {
        date: currentPage.date,
      } as diaryReqArgs);
      router.push({
        pathname: "/views/TalkingPage",
        params: {
          inputID: id,
        },
      });
    }
  }

  // Handling responses from
  useEffect(() => {
    // Checks if there is a response from an input request
    const checkForInput = async () => {
      if (currentPage && requestID && inputStore.id == requestID) {
        // Response to an addParagraph
        if (
          inputStore.command == "addParagraph" &&
          inputStore.requestCompleted &&
          inputStore.args
        ) {
          const responsePictograms = inputStore.inputPictograms;
          const responseDate = (inputStore.args as diaryReqArgs).date;
          if (
            responsePictograms &&
            responsePictograms.length > 0 &&
            responseDate
          ) {
            // If page doesnt exist add it
            if (
              !diaryStore.getDiaryPage(responseDate) &&
              currentPage.date == responseDate
            ) {
              if (!(await diaryStore.addDiaryPage(currentPage))) {
                console.log("Error adding page");
                return undefined;
              }
            }
            await diaryStore.addPictogramsToPage(
              responseDate,
              responsePictograms,
            );
            inputStore.clear();
            setReqId(undefined);
            return responseDate;
          }
        }
        // Response to a modifyEntry
        else if (
          inputStore.command == "modifyEntry" &&
          inputStore.requestCompleted &&
          inputStore.args
        ) {
          const responsePictograms = inputStore.inputPictograms;
          const responseDate = (inputStore.args as diaryReqArgs).date;
          const responseIndex = (inputStore.args as diaryReqArgs).index;
          if (
            responsePictograms &&
            responseDate &&
            responseIndex != undefined
          ) {
            const done = await diaryStore.updatePictogramsInPage(
              responseDate,
              responseIndex,
              responsePictograms,
            );
            inputStore.clear();
            setReqId(undefined);
            if (done) return responseDate;
          }
        }
        return undefined;
      }
    };

    checkForInput()
      .then((res) => {
        if (res) loadPage(res).catch((err) => console.log(err));
        else {
          loadPage(today.toLocaleDateString()).catch((err) => console.log(err));
          companionStore.speak("Guardiamo il tuo diario!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [inputStore.requestCompleted]);

  if (!currentPage)
    return (
      <SafeAreaView className="h-full w-full items-center justify-center">
        <ActivityIndicator size="large" color="#f472b6" />
        <Text className="text-default py-4 text-xs">Caricamento...</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView className="h-full w-full flex-col">
      <View
        style={shadowStyle.heavy}
        className="bg-purpleCard mb-3 flex h-[15%] w-full flex-row items-center justify-center rounded-xl"
      >
        <View className="flex h-full w-[8%] items-start justify-center">
          {diaryStore.getPreviousPage(currentPage.date) && (
            <TouchableOpacity className="ml-[10px] h-full w-full justify-center">
              <MaterialIcons
                name="arrow-back-ios"
                size={iconSize}
                color={iconColor}
              />
            </TouchableOpacity>
          )}
        </View>
        <View className="flex h-full w-[84%] flex-row items-center justify-center">
          <View className="flex h-full w-full flex-row items-center justify-center">
            <Text className="text-default pr-2 text-base font-semibold">
              {currentPage.date}
            </Text>
          </View>
        </View>
        <View className="flex h-full w-[8%] items-end justify-center">
          {diaryStore.getNextPage(currentPage.date) && (
            <TouchableOpacity className="h-full w-full justify-center">
              <MaterialIcons
                name="arrow-forward-ios"
                size={iconSize}
                color={iconColor}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {currentPage.pictograms.length <= 0 && (
        <View className="flex h-[50%] w-full items-center justify-center">
          <Text className="text-default text-base font-semibold lg:text-3xl">
            Aggiungi qualcosa col pulsante sotto...
          </Text>
        </View>
      )}
      <ScrollView className="flex h-[85%] w-full">
        {currentPage.pictograms.map((diaryEntry, i) => (
          <View
            key={`entry_${i}`}
            className="flex w-full flex-row items-center justify-start pb-4"
          >
            <View className="h-16 w-[5%] flex-col pb-2 pl-2">
              <PictogramCard
                pictogram={getPictogram(36257)}
                noCaption={true}
                bgcolor="#f2b30a"
                onPress={() => readEntry(diaryEntry)}
              />
            </View>
            <View className="w-[90%] flex-col">
              {formatToMatchColumns(diaryEntry, columns).map((row, rowI) => (
                <View key={`row${rowI}`} className="h-16 w-full flex-row">
                  {row.map((col, colI) => (
                    <View
                      key={`row_${rowI}_col_${colI}`}
                      style={{ width: `${(100 / columns).toFixed(0)}%` }}
                      className="h-full flex-col"
                    >
                      <PictogramCard
                        pictogram={col}
                        fontSize={fontSize}
                        bgcolor={"#B9D2C3"}
                        onPress={() => {
                          const current = col;
                          companionStore.speak(
                            current.keywords[0]
                              ? current.keywords[0].keyword
                              : "",
                          );
                        }}
                      />
                    </View>
                  ))}
                </View>
              ))}
            </View>
            <View className="h-16 w-[5%] flex-col pb-2 pr-2">
              <PictogramCard
                pictogram={getPictogram(37360)}
                noCaption={true}
                bgcolor="#E49691"
                onPress={() => modifyEntry(i)}
              />
            </View>
          </View>
        ))}
        <View className={`pt-20`} />
      </ScrollView>
      <View
        className={`absolute bottom-4 left-[45%] ${
          isDeviceLarge() ? "h-32 w-32" : "h-16 w-28"
        }`}
      >
        <PictogramCard
          pictogram={getPictogram(38218)}
          noCaption={true}
          bgcolor="#89BF93"
          onPress={addParagraph}
        />
      </View>
      <BottomIcons />
    </SafeAreaView>
  );
}
