import {
  AntDesign,
  Entypo,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { isDeviceLarge } from "./commonFunctions";
import { type CategoryType } from "./types/commonTypes";

const categoryIconSize = isDeviceLarge() ? 28 : 20;
const iconColor = "#5C5C5C";
const categories: CategoryType[] = [
  {
    text: "Tutto",
    icon: (
      <Ionicons name="infinite" size={categoryIconSize} color={iconColor} />
    ),
  },
  {
    text: "Frutta",
    icon: <AntDesign name="apple1" size={categoryIconSize} color={iconColor} />,
  },
  {
    text: "Animali",
    icon: <FontAwesome5 name="cat" size={categoryIconSize} color={iconColor} />,
  },
  {
    text: "Oggetti",
    icon: <Entypo name="pencil" size={categoryIconSize} color={iconColor} />,
  },
  {
    text: "Azioni",
    icon: (
      <MaterialCommunityIcons
        name="hand-wave"
        size={categoryIconSize}
        color={iconColor}
      />
    ),
  },
];

export default categories;
