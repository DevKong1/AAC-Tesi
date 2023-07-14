import React, { useEffect } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";

import BottomIcons from "./components/BottomIcons";
import PictogramCard from "./components/PictogramCard";
import Spinner from "./components/Spinner";
import { getUser } from "./hooks/useBackend";
import {
  useBackend,
  useCompanionStore,
  useDiaryStore,
  usePictogramStore,
} from "./store/store";
import { isDeviceLarge } from "./utils/commonFunctions";

const Index = () => {
  const pictogramStore = usePictogramStore();
  const companionStore = useCompanionStore();
  const diaryStore = useDiaryStore();
  const backendStore = useBackend();
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const loadAll = async () => {
      const token = await getToken();
      const mail = user?.primaryEmailAddress;
      if (token && mail) {
        const dbUser = await getUser(token, mail.emailAddress);
        if (!dbUser) {
          Alert.alert(
            "Error connecting to Backend!",
            "Some features may not work properly",
          );
        } else {
          if (dbUser.customPictograms)
            pictogramStore.parseBackendCustomPictograms(
              dbUser.customPictograms,
            );
          if (dbUser.favourites)
            pictogramStore.setFavourites(
              JSON.parse(dbUser.favourites) as string[],
            );
          if (dbUser.diary) diaryStore.parseBackendDiary(dbUser.diary);
        }
      }
      backendStore.setLoaded(true);
    };

    if (!backendStore.loaded) {
      loadAll();
      companionStore.speak(
        user?.firstName ? `Benvenuto, ${user?.firstName}!` : "Benvenuto!",
        isDeviceLarge() ? "3xl" : "lg",
      );
    }
  }, []);

  if (!backendStore.loaded)
    return (
      <SafeAreaView>
        <View className="flex h-full w-full flex-col p-4">
          <Spinner />
        </View>
      </SafeAreaView>
    );

  return (
    <SafeAreaView>
      <View className="flex h-full w-full flex-col p-4">
        <View className="flex flex-row">
          <Text className="font-logo text-default pr-4 text-4xl lg:text-9xl">
            PictoAI
          </Text>
        </View>
        <View className="mx-auto flex flex-grow flex-row items-center justify-center pb-4">
          <View className="flex h-4/5 w-1/4 items-center justify-center">
            <PictogramCard
              radius={30}
              pictogram={pictogramStore.getPictogram("23392")}
              bgcolor="#C6D7F9"
              text="Giochiamo"
              onPress={() => router.push("/views/GamesPage")}
            />
          </View>
          <View className="flex h-4/5 w-1/4 items-center justify-center">
            <PictogramCard
              radius={30}
              pictogram={pictogramStore.getPictogram("28643")}
              bgcolor="#B9D2C3"
              text="Leggiamo"
              onPress={() => router.push("/views/ReadingPage")}
            />
          </View>
          <View className="flex h-4/5 w-1/4 items-center justify-center">
            <PictogramCard
              radius={30}
              pictogram={pictogramStore.getPictogram("28663")}
              bgcolor="#EBDBD8"
              text="Parliamo"
              onPress={() => router.push("/views/TalkingPage")}
            />
          </View>
          <View className="flex h-4/5 w-1/4 items-center justify-center">
            <PictogramCard
              radius={30}
              pictogram={pictogramStore.getPictogram("2359")}
              bgcolor="#D9D9FD"
              text="Diario"
              onPress={() => router.push("/views/DiaryPage")}
            />
          </View>
        </View>
        <BottomIcons />
      </View>
    </SafeAreaView>
  );
};

export default Index;
