import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, Text, View } from "react-native";
import Carousel, {
  type ICarouselInstance,
} from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

import BottomIcons from "../components/BottomIcons";
import CategoryTabs from "../components/CategoryTab";
import ListButton from "../components/IconButton";
import PictogramCard from "../components/PictogramCard";
import { getPictograms } from "../hooks/talkingHandler";
import { useCompanionStore } from "../store/store";
import categories from "../utils/categories";
import { type Pictogram } from "../utils/types/commonTypes";

export default function TalkingPage() {
  const r = useRef<ICarouselInstance>(null);
  const { width, height } = Dimensions.get("window");
  const companionStore = useCompanionStore();
  const [selectedCategory, selectCategory] = useState(categories[0]!.text);
  const [pictograms, setPictograms] = useState([] as Pictogram[]);
  const [selectedPictograms, selectPictograms] = useState([] as Pictogram[]);

  const fontSize = 26;

  const addPictogram = (pressed: Pictogram) => {
    if (pressed.keywords[0]) companionStore.speak(pressed.keywords[0].keyword);
    selectPictograms((old) => [...old, pressed]);
    console.log(r.current?.getCurrentIndex(), selectedPictograms.length);
    r.current?.scrollTo({
      index: selectedPictograms.length,
      animated: true,
      onFinished: () => console.log(r.current?.getCurrentIndex()),
    });
  };

  const removePictogram = (index: number) => {
    selectPictograms((old) => [
      ...old.slice(0, index),
      ...old.slice(index + 1),
    ]);
    console.log(r.current?.getCurrentIndex(), selectedPictograms.length);
    r.current?.scrollTo({
      index: selectedPictograms.length - 1,
      animated: true,
      onFinished: () => console.log(r.current?.getCurrentIndex()),
    });
  };

  const listView = () => {
    return;
  };

  const loadPictograms = async () => {
    const loadedPictograms = await getPictograms(
      undefined,
      undefined,
      selectedCategory,
    );
    setPictograms(loadedPictograms);
  };

  useEffect(() => {
    // In case of reload
    loadPictograms().catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    companionStore.speak("Scrivi qualcosa e lo leggerò per te!");
  }, []);

  return (
    <SafeAreaView className="h-full w-full flex-col">
      <View className="flex h-[20%] w-full flex-row items-center justify-center">
        {selectedPictograms.length > 0 ? (
          <View className="flex h-full w-full flex-row items-center justify-center">
            <View></View>
            <View className="flex h-full w-[90%] flex-row items-center justify-center">
              <Carousel
                ref={r}
                loop={false}
                pagingEnabled={true}
                style={{
                  width: width * 0.9,
                  height: height * 0.2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                width={208}
                height={height * 0.2}
                data={selectedPictograms}
                scrollAnimationDuration={1000}
                renderItem={(el) => (
                  <PictogramCard
                    pictogram={el.item}
                    fontSize={fontSize}
                    bgcolor="#C6D7F9"
                    onPress={removePictogram}
                    args={el.index}
                  />
                )}
              />
            </View>
            <View></View>
          </View>
        ) : (
          <Text className="text-default text-3xl font-semibold">
            Seleziona un pittogramma...
          </Text>
        )}
      </View>
      <View className="flex h-[15%] w-full">
        <CategoryTabs
          selectedCategory={selectedCategory}
          categories={categories}
          setCategory={selectCategory}
        />
      </View>
      <View className="flex h-[65%] w-full flex-row">
        <View className="flex h-full w-[10%] items-center justify-center">
          <View className="mb-20 flex h-1/2 w-2/3">
            <ListButton
              onPress={listView}
              color={"#A3B0B4"}
              icon={<MaterialIcons name="list" size={64} color={"white"} />}
            ></ListButton>
          </View>
        </View>
        <View className="flex h-full w-[80%]">
          {pictograms.length == 8 ? (
            <View className="flex h-full w-full">
              <View className="flex h-[45%] w-full flex-row">
                {pictograms.slice(0, 4).map((el) => (
                  <View key={el._id} className="flex h-full w-1/4">
                    <PictogramCard
                      pictogram={el}
                      fontSize={fontSize}
                      bgcolor="#C6D7F9"
                      onPress={addPictogram}
                      args={el}
                    />
                  </View>
                ))}
              </View>
              <View className="flex h-[45%] w-full flex-row">
                {pictograms.slice(4, 8).map((el) => (
                  <View key={el._id} className="flex h-full w-1/4">
                    <PictogramCard
                      pictogram={el}
                      fontSize={fontSize}
                      bgcolor="#C6D7F9"
                      onPress={addPictogram}
                      args={el}
                    />
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View className="flex h-full w-full items-center justify-center">
              <ActivityIndicator size={64} color="#5C5C5C" className="pb-10" />
            </View>
          )}
        </View>
        <View className="flex h-full w-[10%] items-center justify-center">
          <View className="mb-20 flex h-1/2 w-2/3">
            <ListButton
              onPress={listView}
              color={"#E49691"}
              icon={<MaterialIcons name="refresh" size={64} color={"white"} />}
            ></ListButton>
          </View>
        </View>
      </View>
      <BottomIcons />
    </SafeAreaView>
  );
}
