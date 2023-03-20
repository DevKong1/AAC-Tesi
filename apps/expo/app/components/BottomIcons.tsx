import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { shadowStyle } from "../../src/utils/shadowStyle";

const BottomIcons: React.FC = () => {
  const router = useRouter();
  const iconSize = 60;
  const iconColor = "#5C5C5C";

  return (
    <View className="absolute left-4 bottom-4 flex-row">
      <TouchableOpacity onPress={() => router.push("/settings")}>
        <MaterialIcons
          style={shadowStyle.icon}
          name="settings"
          size={iconSize}
          color={iconColor}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <MaterialIcons
          style={shadowStyle.icon}
          name="volume-up"
          size={iconSize}
          color={iconColor}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <MaterialIcons
          style={shadowStyle.icon}
          name="chat"
          size={iconSize}
          color={iconColor}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BottomIcons;
