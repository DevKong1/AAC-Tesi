import { type ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { shadowStyle } from "../utils/shadowStyle";

const MenuCard: React.FC<{
  text: string;
  fontSize: number;
  icon: ReactNode;
  bgcolor: string;
  onPress: () => void;
}> = ({ text, icon, fontSize, bgcolor, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        shadowStyle.light,
        {
          backgroundColor: bgcolor,
        },
      ]}
      className="mx-auto flex h-full w-full flex-col items-center justify-center rounded-[30px]"
      onPress={onPress}
    >
      <View className="flex h-[70%] w-full items-center justify-center">
        {icon}
      </View>
      <View className="flex h-[30%] w-full items-center justify-center">
        <Text
          style={{ fontSize: fontSize }}
          className={`text-default font-text text-center`}
        >
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default MenuCard;
