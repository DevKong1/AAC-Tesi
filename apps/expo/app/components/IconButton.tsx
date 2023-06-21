import { type ReactNode } from "react";
import { TouchableOpacity } from "react-native";

import { shadowStyle } from "../utils/shadowStyle";

const IconButton: React.FC<{
  icon: ReactNode;
  color: string;
  squared?: boolean;
  full?: boolean;
  onPress: () => void;
}> = ({ icon, color, squared, full, onPress }) => {
  return (
    <TouchableOpacity
      style={[shadowStyle.light, { backgroundColor: color }]}
      className={`flex ${
        full ? "h-full w-full" : "h-5/6 w-5/6 "
      } flex-col items-center justify-center ${
        squared ? null : "rounded-[30px]"
      }`}
      onPress={onPress}
    >
      {icon}
    </TouchableOpacity>
  );
};

export default IconButton;
