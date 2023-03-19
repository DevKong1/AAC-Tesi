import { Image, Text, View } from "react-native";

const Companion: React.FC<{}> = () => {
  //TODO Animated Avatar
  return (
    <View className="absolute bottom-4 right-4">
      <Image source={require("../../assets/images/companion.png")} />
    </View>
  );
};

export default Companion;
