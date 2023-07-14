import { useEffect, useState } from "react";
import { BackHandler, Text, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { randomUUID } from "expo-crypto";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";

import PictogramCard from "../components/PictogramCard";
import Spinner from "../components/Spinner";
import {
  useCompanionStore,
  useDiaryStore,
  useInputStore,
  usePictogramStore,
} from "../store/store";
import { chunk, isDeviceLarge } from "../utils/commonFunctions";
import { shadowStyle } from "../utils/shadowStyle";
import { type DiaryPage, type diaryReqArgs } from "../utils/types/commonTypes";

export default function DiaryPage() {
  const router = useRouter();
  const pictogramStore = usePictogramStore();
  const companionStore = useCompanionStore();
  const diaryStore = useDiaryStore();
  const inputStore = useInputStore();
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(false);

  const [requestID, setReqId] = useState(undefined as string | undefined);
  const [currentPage, setPage] = useState(undefined as DiaryPage | undefined);
  const [readEntryIndex, setReadEntryIndex] = useState(
    undefined as number | undefined,
  ); // Currently read entry in page
  const [readIndex, setReadIndex] = useState(undefined as number | undefined); // Currently read index in entry
  const [readingOne, setReadOne] = useState(false); // Used to prevent useEffect from reading the next pictograms

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

  // Loads current page
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

  // Stops the speech and resets all states
  const resetSpeech = async () => {
    await companionStore.resetSpeech();
    setReadOne(false);
    setReadEntryIndex(undefined);
    setReadIndex(undefined);
  };

  // Sets states so that one pictogram is read
  const readOne = async (entryIndex: number, index: number) => {
    await resetSpeech();
    setReadOne(true);
    setReadEntryIndex(entryIndex);
    setReadIndex(index);
  };

  // Sets states so that an entry is read
  const readEntry = async (entryI: number) => {
    await resetSpeech();
    setReadEntryIndex(entryI);
    setReadIndex(0);
  };

  // Routes to TalkingPage, setting the InputState so that we can retrieve the response
  const modifyEntry = async (index: number) => {
    if (currentPage) {
      await resetSpeech();
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

  // Gets the previous day page, if not present create a new one (but not save till one entry is added)
  const goPreviousDay = async () => {
    if (!currentPage) return;
    await resetSpeech();
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

  // Gets the next day page, if not present create a new one (but not save till one entry is added)
  const goNextDay = async () => {
    if (!currentPage) return;
    await resetSpeech();
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

  // Adds an entry to the current page
  function addEntry(): void {
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
        const token = await getToken();
        if (!token) return undefined;
        setLoading(true);
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
            if (!diaryStore.getDiaryPage(responseDate)) {
              const newPage = {
                ...currentPage,
                pictograms: [responsePictograms],
              };
              const addedPage = await diaryStore.addDiaryPage(token, newPage);
              if (!addedPage) {
                console.log("Error adding page");
                setLoading(false);
              } else {
                inputStore.clear();
                setReqId(undefined);
                setLoading(false);
                return addedPage.date;
              }
            } else {
              const addedPage = await diaryStore.addPictogramsToPage(
                token,
                responseDate,
                responsePictograms,
              );
              if (!addedPage) {
                console.log("Error updating page");
                setLoading(false);
              } else {
                inputStore.clear();
                setReqId(undefined);
                setLoading(false);
                return addedPage.date;
              }
            }
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
            const updatedPage = await diaryStore.updatePictogramsEntryInPage(
              token,
              responseDate,
              responseIndex,
              responsePictograms,
            );
            inputStore.clear();
            setReqId(undefined);
            if (updatedPage) {
              setLoading(false);
              return responseDate;
            }
          }
        }
        setLoading(false);
        return undefined;
      }
    };

    companionStore.hideAll();
    checkForInput()
      .then((res) => {
        if (res) loadPage(res);
        else {
          loadPage(getTodayDate().toISOString());
          if (!requestID) companionStore.speak("Guardiamo il tuo diario!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [inputStore.requestCompleted]);

  // Read pictograms
  useEffect(() => {
    (async () => {
      if (
        readIndex === undefined ||
        readEntryIndex === undefined ||
        currentPage === undefined
      )
        return;
      const currentEntry = currentPage.pictograms[readEntryIndex];
      if (currentEntry === undefined) return;
      if (readIndex >= currentEntry.length) {
        await resetSpeech();
        return;
      }
      const currentId = currentEntry[readIndex];
      const currentPictogram = currentId
        ? pictogramStore.getPictogram(currentId)
        : undefined;
      const currentText = currentPictogram
        ? pictogramStore.getTextFromPictogram(currentPictogram)
        : undefined;
      if (currentText)
        await companionStore.speak(
          currentText,
          undefined,
          undefined,
          async () => {
            if (readingOne) await resetSpeech();
            else setReadIndex(readIndex + 1);
          },
        );
    })();
  }, [readIndex, readEntryIndex, currentPage]);

  // Show back the companion and stop speech
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        resetSpeech();
        companionStore.showAll();
        router.back();

        return true;
      },
    );

    return () => backHandler.remove();
  }, []);

  if (!currentPage || loading)
    return (
      <SafeAreaView className="h-full w-full items-center justify-center">
        <Spinner />
      </SafeAreaView>
    );

  return (
    <SafeAreaView className="h-full w-full flex-col">
      <View
        style={shadowStyle.heavy}
        className="bg-purpleCard flex h-[15%] w-full flex-row items-center justify-center"
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
      <View className="h-[2%]" />
      {currentPage.pictograms.length <= 0 ? (
        <View className="flex w-full grow flex-col">
          <View className="flex w-full flex-1 items-center justify-center">
            <Text className="text-default text-base font-semibold lg:text-3xl">
              Aggiungi qualcosa col pulsante sotto...
            </Text>
          </View>
          <View className="flex h-16 w-full justify-end">
            <PictogramCard
              full
              text="Aggiungi"
              pictogram={pictogramStore.getPictogram("38218")}
              bgcolor="#89BF93"
              onPress={addEntry}
            />
          </View>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, flexDirection: "column" }}
          className="flex h-[83%] w-full "
        >
          {currentPage.pictograms.map((diaryEntry, i) => (
            <View
              key={`entry_${i}`}
              className="flex w-full flex-1 flex-row items-center justify-start pb-4"
            >
              <View
                style={{ height: 96 * Math.ceil(diaryEntry.length / columns) }}
                className="w-[8%] flex-col"
              >
                <View className="h-1/2 w-full">
                  <PictogramCard
                    full
                    text="Leggi"
                    pictogram={pictogramStore.getPictogram("2447")}
                    bgcolor="#89BF93"
                    onPress={() => readEntry(i)}
                  />
                </View>
                <View className="h-1/2 w-full">
                  <PictogramCard
                    full
                    text="Modifica"
                    pictogram={pictogramStore.getPictogram("15018")}
                    bgcolor="#f2b30a"
                    onPress={() => modifyEntry(i)}
                  />
                </View>
              </View>
              <View className="w-[92%] flex-col">
                {(chunk(diaryEntry, columns) as string[][]).map((row, rowI) => (
                  <View key={`row${rowI}`} className="h-24 w-full flex-row">
                    {row.map((col, colI) => (
                      <View
                        key={`row_${rowI}_col_${colI}`}
                        style={{ width: `${(100 / columns).toFixed(0)}%` }}
                        className="h-full flex-col items-center justify-center"
                      >
                        <PictogramCard
                          full
                          pictogram={pictogramStore.getPictogram(col)}
                          highlight={
                            readEntryIndex == i &&
                            readIndex == rowI * columns + colI
                          }
                          onPress={() => readOne(i, rowI * columns + colI)}
                        />
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </View>
          ))}
          <View className="flex h-16 w-full justify-end">
            <PictogramCard
              full
              text="Aggiungi"
              pictogram={pictogramStore.getPictogram("38218")}
              bgcolor="#89BF93"
              onPress={addEntry}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
