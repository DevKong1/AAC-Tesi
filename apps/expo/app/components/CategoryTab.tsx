import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const CategoryTab: React.FC<{
  text: string;
  width: string | number;
}> = ({ text, width }) => {
  return (
    <TouchableOpacity
      style={{ width: width }}
      className="bg-default flex h-full flex-col justify-center align-middle"
    >
      <View className="flex-row justify-center">
        <Text className="text-2xl">{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const CategoryTabs: React.FC = () => {
  return (
    <View className="flex h-full w-full flex-row justify-center align-middle">
      <CategoryTab text="Tutto" width="20%" />
      <CategoryTab text="Frutta" width="20%" />
      <CategoryTab text="Animali" width="20%" />
      <CategoryTab text="Oggetti" width="20%" />
      <CategoryTab text="Azioni" width="20%" />
    </View>
  );
};

export default CategoryTabs;
