import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { shadowStyle } from "../../src/utils/shadowStyle";
import { useCompanionStore } from "../store/store";

const BottomIcons: React.FC = () => {
  const companionStore = useCompanionStore();
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
      <TouchableOpacity onPress={() => companionStore.changeVolume()}>
        <MaterialIcons
          style={shadowStyle.icon}
          name={companionStore.volumeOn ? "volume-up" : "volume-off"}
          size={iconSize}
          color={iconColor}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => companionStore.changeBubble()}>
        <MaterialIcons
          style={shadowStyle.icon}
          name={companionStore.bubbleOn ? "chat" : "chat-bubble"}
          size={iconSize}
          color={iconColor}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BottomIcons;
