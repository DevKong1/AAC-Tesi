import { Text, View } from "react-native";
import Icons from "@expo/vector-icons/MaterialCommunityIcons";

const AddPictogramButton = () => {
  return (
    <View className="flex flex-col items-center justify-center rounded-lg  bg-white/10 p-4">
      <Icons className="flex-row" name="plus-thick" size={32} color="white" />
      <Text className="color-white flex-row">Add Pictogram</Text>
    </View>
  );
};

export default AddPictogramButton;
