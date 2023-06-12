import { ActivityIndicator, Text, View } from "react-native";

const Spinner: React.FC = () => {
  return (
    <View className="h-full w-full flex-col content-center justify-center">
      <ActivityIndicator size="large" color="#f472b6" />
      <View className="w-full content-center justify-center py-4">
        <Text className="text-default text-center text-xs">Caricamento...</Text>
      </View>
    </View>
  );
};

export default Spinner;
