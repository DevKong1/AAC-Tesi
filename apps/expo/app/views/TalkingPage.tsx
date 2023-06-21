import { useEffect, useRef, useState } from "react";
import { BackHandler, Dimensions, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Carousel, {
  type ICarouselInstance,
} from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import CategoryTabs from "../components/CategoryTab";
import IconButton from "../components/IconButton";
import PictogramCard from "../components/PictogramCard";
import PictogramSearchModal from "../components/PictogramSearchModal";
import Spinner from "../components/Spinner";
import { predictPictograms } from "../hooks/useHuggingFace";
import {
  useCategoryStore,
  useCompanionStore,
  useInputStore,
  usePictogramStore,
} from "../store/store";
import { chunk } from "../utils/commonFunctions";
import { dummyPredictedPictograms } from "../utils/dummyResponses";
import { type Pictogram, type diaryReqArgs } from "../utils/types/commonTypes";

export default function TalkingPage() {
  const r = useRef<ICarouselInstance>(null);
  const { width, height } = Dimensions.get("window");

  const router = useRouter();
  const companionStore = useCompanionStore();
  const categoryStore = useCategoryStore();
  const inputStore = useInputStore();
  const pictogramStore = usePictogramStore();

  // This page might be used to write input for the diary
  const { inputID } = useLocalSearchParams();

  const [selectedCategory, selectCategory] = useState(
    undefined as string | undefined,
  );
  const [pictograms, setPictograms] = useState([] as string[]);
  const [selectedPictograms, selectPictograms] = useState([] as string[]);
  const [showModal, setShowModal] = useState(false);
  const [readIndex, setReadIndex] = useState(undefined as number | undefined);

  const addPictogram = (pressed: Pictogram) => {
    resetSpeech();
    const text = pictogramStore.getTextFromPictogram(pressed);
    if (text) companionStore.speak(text);
    selectPictograms((old) => [...old, pressed._id]);

    // TODO carousel bugs out if the index is 0
    r.current?.scrollTo({
      index: selectedPictograms.length,
      animated: true,
    });
    loadPictograms();
  };

  const removePictogram = (index: number) => {
    resetSpeech();
    const current = r.current!.getCurrentIndex();
    selectPictograms((old) => [
      ...old.slice(0, index),
      ...old.slice(index + 1),
    ]);
    // Scroll only if we remove an element before the selected
    if (index <= current) {
      r.current?.scrollTo({
        index: current - 1,
        animated: true,
      });
    }
    loadPictograms();
  };

  const resetSpeech = () => {
    companionStore.resetSpeech();
    setReadIndex(undefined);
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

  const readAll = () => {
    if (selectedPictograms.length > 0) recursiveRead(0, selectedPictograms);
  };

  const listView = () => {
    setShowModal(true);
  };

  const loadPictograms = async () => {
    const predictedPictograms = await predictPictograms(
      pictograms,
      selectedPictograms,
      selectedCategory,
    );
    // We set the response to the predicted pictograms or the default ones if there was an error
    setPictograms(
      predictedPictograms
        ? predictedPictograms.pictograms
        : dummyPredictedPictograms,
    );
  };

  const submitInput = () => {
    if (inputID) {
      inputStore.setInput(inputID, selectedPictograms);
      router.back();
    }
  };

  const onModalClose = () => {
    setShowModal(false);
  };

  const setCategory = (category: string) => {
    if (category == selectedCategory) selectCategory(undefined);
    else selectCategory(category);
  };

  useEffect(() => {
    companionStore.hideAll();
    // In case of reload
    loadPictograms().catch((err) => console.log(err));
    if (inputID && inputStore.command == "modifyEntry" && inputStore.args) {
      selectPictograms((inputStore.args as diaryReqArgs).entry!);
    }
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        resetSpeech();
        companionStore.showAll();
        inputStore.clear();
        router.back();
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView className="h-full w-full flex-col">
      <PictogramSearchModal
        isVisible={showModal}
        onSelect={addPictogram}
        onClose={onModalClose}
        backdrop={false}
        defaultText="Qui potrai visualizzare i tuoi pittogrammi preferiti, selezionali dalle impostazioni.."
        defaultData={pictogramStore.getFavouritePictograms()}
      />
      <View className="flex h-[23%] w-full flex-row items-center justify-center">
        {selectedPictograms.length > 0 ? (
          <View className="flex h-full w-full items-center justify-center">
            <Carousel
              ref={r}
              loop={false}
              pagingEnabled={true}
              style={{
                width: width,
                height: height * 0.23,
                justifyContent: "center",
                alignItems: "center",
              }}
              width={104}
              height={height * 0.23}
              data={selectedPictograms}
              scrollAnimationDuration={1000}
              renderItem={(el) => (
                <PictogramCard
                  radius={10}
                  pictogram={pictogramStore.getPictogram(el.item)}
                  bgcolor="#C6D7F9"
                  onPress={removePictogram}
                  highlight={readIndex == el.index ? "#FFFFCA" : undefined}
                  args={el.index}
                />
              )}
            />
          </View>
        ) : (
          <Text className="text-default text-base font-semibold lg:text-3xl">
            Seleziona un pittogramma...
          </Text>
        )}
      </View>
      <View className="flex h-[15%] w-full">
        <CategoryTabs
          selectedCategory={selectedCategory}
          categories={categoryStore.currentCategories}
          setCategory={setCategory}
          compact
        />
      </View>
      <View className="flex h-[62%] w-full flex-row items-center justify-center">
        <View className="flex h-full w-[6%] items-center justify-center">
          <View className="flex h-full w-full">
            <IconButton
              squared
              full
              icon={<Ionicons name="search" size={32} color="white" />}
              color="#A3B0B4"
              onPress={listView}
            />
          </View>
        </View>
        {pictograms.length > 0 ? (
          <ScrollView
            horizontal
            pagingEnabled
            className="flex h-full w-[84%] flex-row"
          >
            {(chunk(pictograms, 8) as string[][]).map(
              (wholeScreenPictograms, page) => (
                <View
                  style={{ width: width * 0.84 }}
                  className="flex h-full flex-col"
                  key={page}
                >
                  <View className="flex h-[50%] w-full flex-row">
                    {wholeScreenPictograms.slice(0, 4).map((el, i) => (
                      <View
                        key={`page${page}_${i}`}
                        className="flex h-full w-1/4"
                      >
                        <PictogramCard
                          full
                          pictogram={pictogramStore.getPictogram(el)}
                          bgcolor="#C6D7F9"
                          onPress={addPictogram}
                          args={pictogramStore.getPictogram(el)}
                        />
                      </View>
                    ))}
                  </View>
                  <View className="flex h-[50%] w-full flex-row">
                    {wholeScreenPictograms.slice(4, 8).map((el, i) => (
                      <View key={`row2_${i}`} className="flex h-full w-1/4">
                        <PictogramCard
                          full
                          pictogram={pictogramStore.getPictogram(el)}
                          bgcolor="#C6D7F9"
                          onPress={addPictogram}
                          args={pictogramStore.getPictogram(el)}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              ),
            )}
          </ScrollView>
        ) : (
          <View className="h-full w-[80%] flex-row content-center items-center justify-center">
            <Spinner />
          </View>
        )}
        <View className="flex h-[50%] w-[10%] flex-col items-center justify-center">
          <View className="flex h-full w-full items-center justify-center">
            <PictogramCard
              full
              pictogram={pictogramStore.getPictogram(
                inputID ? "38221" : "36257",
              )}
              noCaption={true}
              bgcolor="#89BF93"
              onPress={inputID ? submitInput : readAll}
            />
          </View>
          <View className="flex h-full w-full items-center justify-center">
            <PictogramCard
              full
              pictogram={pictogramStore.getPictogram("38201")}
              noCaption={true}
              bgcolor="#f05252"
              onPress={() => {
                resetSpeech();
                selectPictograms([]);
                loadPictograms();
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
