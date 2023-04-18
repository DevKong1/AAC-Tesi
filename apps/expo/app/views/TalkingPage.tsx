import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, Text, View } from "react-native";
import Carousel, {
  type ICarouselInstance,
} from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

import BottomIcons from "../components/BottomIcons";
import CategoryTabs from "../components/CategoryTab";
import IconButton from "../components/IconButton";
import PictogramCard from "../components/PictogramCard";
import { getPictograms } from "../hooks/talkingHandler";
import { useCompanionStore } from "../store/store";
import categories from "../utils/categories";
import { isDeviceLarge } from "../utils/commonFunctions";
import { type Pictogram } from "../utils/types/commonTypes";

export default function TalkingPage() {
  const r = useRef<ICarouselInstance>(null);
  const { width, height } = Dimensions.get("window");
  const companionStore = useCompanionStore();
  const [selectedCategory, selectCategory] = useState(categories[0]!.text);
  const [pictograms, setPictograms] = useState([] as Pictogram[]);
  const [selectedPictograms, selectPictograms] = useState([] as Pictogram[]);

  const iconSize = isDeviceLarge() ? 64 : 32;
  const fontSize = isDeviceLarge() ? 26 : 16;

  const addPictogram = (pressed: Pictogram) => {
    if (pressed.keywords[0]) companionStore.speak(pressed.keywords[0].keyword);
    selectPictograms((old) => [...old, pressed]);

    // TODO carousel bugs out if the index is 0
    r.current?.scrollTo({
      index: selectedPictograms.length,
      animated: true,
    });
  };

  const removePictogram = (index: number) => {
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
  };

  const readAll = () => {
    if (selectedPictograms.length > 0) {
      companionStore.speak(
        selectedPictograms.flatMap((el) => el.keywords[0]?.keyword).join(" "),
        undefined,
        (e) => {
          console.log(e);
        },
      );
    }
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
      <View className="flex h-[23%] w-full flex-row items-center justify-center">
        {selectedPictograms.length > 0 ? (
          <View className="flex h-full w-full flex-row items-center justify-center">
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
                width={208}
                height={height * 0.23}
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
          </View>
        ) : (
          <Text className="text-default text-base font-semibold lg:text-3xl">
            Seleziona un pittogramma...
          </Text>
        )}
      </View>
      <View className="flex h-[12%] w-full">
        <CategoryTabs
          selectedCategory={selectedCategory}
          categories={categories}
          setCategory={selectCategory}
        />
      </View>
      <View className="flex h-[50%] w-full flex-row">
        <View className="flex h-full w-[10%] items-center justify-center">
          <View className="flex h-3/4 w-2/3 lg:mb-20 lg:h-1/2">
            <IconButton
              onPress={listView}
              color={"#A3B0B4"}
              icon={
                <MaterialIcons name="list" size={iconSize} color={"white"} />
              }
            />
          </View>
        </View>
        <View className="flex h-full w-[80%]">
          {pictograms.length == 8 ? (
            <View className="flex h-full w-full">
              <View className="flex h-[50%] w-full flex-row">
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
              <View className="flex h-[50%] w-full flex-row">
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
            <IconButton
              onPress={listView}
              color={"#E49691"}
              icon={
                <MaterialIcons name="refresh" size={iconSize} color={"white"} />
              }
            />
          </View>
        </View>
      </View>
      <View className=" flex h-[10%] w-full flex-row items-center justify-center">
        <View className=" flex h-full w-1/6 items-center justify-center">
          <IconButton
            onPress={readAll}
            color={"#89BF93"}
            icon={
              <MaterialIcons
                name="play-arrow"
                size={iconSize}
                color={"white"}
              />
            }
          />
        </View>
        <View className="w-8"></View>
        <View className="flex h-full w-1/6 items-center justify-center">
          <IconButton
            onPress={() => {
              selectPictograms([]);
            }}
            color={"#f05252"}
            icon={
              <MaterialIcons name="clear" size={iconSize} color={"white"} />
            }
          />
        </View>
      </View>
      <BottomIcons />
    </SafeAreaView>
  );
}
