import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { randomUUID } from "expo-crypto";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";

import BottomIcons from "../components/BottomIcons";
import PictogramCard from "../components/PictogramCard";
import Spinner from "../components/Spinner";
import {
  useCompanionStore,
  useDiaryStore,
  useInputStore,
  usePictogramStore,
} from "../store/store";
import {
  formatToMatchColumns,
  getTextFromPictogramsArray,
  isDeviceLarge,
} from "../utils/commonFunctions";
import { shadowStyle } from "../utils/shadowStyle";
import { type DiaryPage, type diaryReqArgs } from "../utils/types/commonTypes";

export default function DiaryPage() {
  const router = useRouter();
  const pictogramStore = usePictogramStore();
  const companionStore = useCompanionStore();
  const diaryStore = useDiaryStore();
  const inputStore = useInputStore();

  const [requestID, setReqId] = useState(undefined as string | undefined);
  const [currentPage, setPage] = useState(undefined as DiaryPage | undefined);

  const iconSize = isDeviceLarge() ? 90 : 42;
  const iconColor = "#5C5C5C";
  const columns = diaryStore.readingSettings.columns;

  // Returns todays date without counting hours
  const getTodayDate = () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  };

  // Returns currents page date without counting hours
  const getCurrentPageDate = () => {
    const currentDate = currentPage
      ? moment(currentPage.date).toDate()
      : undefined;
    if (currentDate) currentDate.setHours(0, 0, 0, 0);
    return currentDate;
  };

  const loadPage = (date: string) => {
    let loadedPage = diaryStore.getDiaryPage(date);
    if (!loadedPage) {
      loadedPage = {
        date: getTodayDate().toISOString(),
        pictograms: [],
      } as DiaryPage;
    }
    setPage(loadedPage);
  };

  const readEntry = (entry: string[]) => {
    if (entry.length > 0) {
      const pictograms = pictogramStore.getPictograms(entry);
      companionStore.speak(getTextFromPictogramsArray(pictograms));
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

  const goPreviousDay = () => {
    if (!currentPage) return;
    const previousDayString = moment(currentPage.date)
      .subtract(1, "day")
      .toDate()
      .toISOString();
    const previousDiaryEntry = diaryStore.getDiaryPage(previousDayString);
    setPage(
      previousDiaryEntry
        ? previousDiaryEntry
        : ({
            date: previousDayString,
            pictograms: [],
          } as DiaryPage),
    );
  };

  const goNextDay = () => {
    if (!currentPage) return;
    const nextDayString = moment(currentPage.date)
      .add(1, "day")
      .toDate()
      .toISOString();
    const nextDiaryEntry = diaryStore.getDiaryPage(nextDayString);
    setPage(
      nextDiaryEntry
        ? nextDiaryEntry
        : ({
            date: nextDayString,
            pictograms: [],
          } as DiaryPage),
    );
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

  // Handling responses from TalkingPage
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
        if (res) loadPage(res);
        else {
          loadPage(getTodayDate().toISOString());
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
        <Spinner />
      </SafeAreaView>
    );

  return (
    <SafeAreaView className="h-full w-full flex-col">
      <View
        style={shadowStyle.heavy}
        className="bg-purpleCard mb-3 flex h-[15%] w-full flex-row items-center justify-center rounded-xl"
      >
        <View className="flex h-full w-[8%] items-start justify-center">
          {getCurrentPageDate() && getCurrentPageDate()! < getTodayDate() && (
            <TouchableOpacity
              className="ml-[10px] h-full w-full justify-center"
              onPress={goNextDay}
            >
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
              {getCurrentPageDate()?.toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View className="flex h-full w-[8%] items-end justify-center">
          <TouchableOpacity
            className="h-full w-full justify-center"
            onPress={goPreviousDay}
          >
            <MaterialIcons
              name="arrow-forward-ios"
              size={iconSize}
              color={iconColor}
            />
          </TouchableOpacity>
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
                noCaption
                pictogram={pictogramStore.getPictogram("36257")}
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
                        pictogram={pictogramStore.getPictogram(col)}
                        bgcolor={"#B9D2C3"}
                        onPress={() => {
                          const current = pictogramStore.getPictogram(col);
                          companionStore.speak(
                            current?.customPictogram?.text
                              ? current.customPictogram.text
                              : current?.keywords[0]
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
                pictogram={pictogramStore.getPictogram("37360")}
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
          pictogram={pictogramStore.getPictogram("38218")}
          noCaption={true}
          bgcolor="#89BF93"
          onPress={addParagraph}
        />
      </View>
      <BottomIcons />
    </SafeAreaView>
  );
}
