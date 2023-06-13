import React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { AntDesign } from "@expo/vector-icons";

import { useWarmUpBrowser } from "../hooks/useWarmupBrowser";

WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <View className="m-auto flex h-[60%] w-[40%] flex-col items-center justify-center rounded-lg border border-red-50 bg-white">
      <Text className="font-text text-default pb-2 text-base lg:text-2xl">
        Effettua il login:
      </Text>
      <View className="h-16 w-64 items-center justify-center">
        <TouchableOpacity
          className="flex flex-row items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          onPress={onPress}
        >
          <View className="pr-2">
            <AntDesign name="google" size={24} color="red" />
          </View>
          <View>
            <Text>Continua con Google</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignInWithOAuth;
