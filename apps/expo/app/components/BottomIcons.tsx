import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { useCompanionStore } from "../store/store";
import { isDeviceLarge } from "../utils/commonFunctions";
import { shadowStyle } from "../utils/shadowStyle";

const BottomIcons: React.FC<{
  onMute?: () => void;
}> = ({ onMute }) => {
  const companionStore = useCompanionStore();
  const router = useRouter();
  const iconSize = isDeviceLarge() ? 60 : 36;
  const iconColor = "#5C5C5C";

  return (
    <View className="absolute left-4 bottom-4 flex-row">
      <TouchableOpacity onPress={() => router.push("/views/SettingsPage")}>
        <MaterialIcons
          style={shadowStyle.icon}
          name="settings"
          size={iconSize}
          color={iconColor}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          if (onMute) onMute();
          await companionStore.changeVolume();
        }}
      >
        <MaterialIcons
          style={shadowStyle.icon}
          name={companionStore.volumeOn ? "volume-up" : "volume-off"}
          size={iconSize}
          color={iconColor}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => await companionStore.changeBubble()}
      >
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
