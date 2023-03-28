import { type ReactNode } from "react";
import { Text, TouchableOpacity } from "react-native";

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
      {icon}
      <Text
        style={{ fontSize: fontSize }}
        className={`text-default font-text pt-8 text-center`}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default MenuCard;
