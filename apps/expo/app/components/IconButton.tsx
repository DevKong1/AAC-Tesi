import { type ReactNode } from "react";
import { TouchableOpacity } from "react-native";

import { shadowStyle } from "../utils/shadowStyle";

const IconButton: React.FC<{
  icon: ReactNode;
  color: string;
  onPress: () => void;
}> = ({ icon, color, onPress }) => {
  return (
    <TouchableOpacity
      style={[shadowStyle.light, { backgroundColor: color }]}
      className="flex h-5/6 w-5/6 flex-col items-center justify-center rounded-[30px]"
      onPress={onPress}
    >
      {icon}
    </TouchableOpacity>
  );
};

export default IconButton;
