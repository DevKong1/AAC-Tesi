import { type ReactNode } from "react";
import { Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { type Href } from "expo-router/src/link/href";
import { MaterialIcons } from "@expo/vector-icons";

const MenuCard: React.FC<{
  text: string;
  fontSize: number;
  icon: ReactNode;
  bgcolor: string;
  height: string;
  width: string;
  path: Href;
}> = ({ text, icon, bgcolor, path, height, width, fontSize }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={{
        backgroundColor: bgcolor,
        height: height,
        width: width,
        //iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        //Android
        elevation: 5,
      }}
      className="m-auto flex flex-col items-center justify-center rounded-[30px]"
      onPress={() => router.push(path)}
    >
      <MaterialIcons>{icon}</MaterialIcons>
      <Text
        style={{ fontSize: fontSize }}
        className={`text-default font-text pt-8`}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default MenuCard;
