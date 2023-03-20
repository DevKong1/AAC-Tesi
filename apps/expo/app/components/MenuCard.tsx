import { type ReactNode } from "react";
import { Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { type Href } from "expo-router/src/link/href";
import { MaterialIcons } from "@expo/vector-icons";

import { shadowStyle } from "../../src/utils/shadowStyle";

const MenuCard: React.FC<{
  text: string;
  fontSize: number;
  icon: ReactNode;
  bgcolor: string;
  height: string | number;
  width: string | number;
  path: Href;
}> = ({ text, icon, bgcolor, path, height, width, fontSize }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[
        shadowStyle.light,
        {
          backgroundColor: bgcolor,
          height: height,
          width: width,
        },
      ]}
      className="m-auto flex flex-col items-center justify-center rounded-[30px]"
      onPress={() => router.push(path)}
    >
      <MaterialIcons>{icon}</MaterialIcons>
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
