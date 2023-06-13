import { type ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { shadowStyle } from "../utils/shadowStyle";

const SettingsButton: React.FC<{
  icon?: ReactNode;
  textColor?: string;
  text: string;
  color: string;
  onPress: () => void;
}> = ({ icon, textColor, text, color, onPress }) => {
  return (
    <TouchableOpacity
      style={[shadowStyle.light, { backgroundColor: color }]}
      className="flex h-full w-full flex-row items-center justify-center rounded-[30px]"
      onPress={onPress}
    >
      <Text
        style={{ color: textColor ? textColor : "#5C5C5C" }}
        className={`font-text ${
          icon ? "pr-2" : "px-2"
        } text-center text-base lg:text-lg`}
      >
        {text}
      </Text>
      {icon && <View className="pt-1">{icon}</View>}
    </TouchableOpacity>
  );
};

export default SettingsButton;
