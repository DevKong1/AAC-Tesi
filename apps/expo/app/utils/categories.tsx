import {
  AntDesign,
  Entypo,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";

import { isDeviceLarge } from "./commonFunctions";
import { type CategoryType } from "./types/commonTypes";

const categoryIconSize = isDeviceLarge() ? 26 : 16;
const iconColor = "#5C5C5C";

export const allCategories: CategoryType[] = [
  {
    textARASAAC: "fruit",
    text: "Frutta",
    icon: <AntDesign name="apple1" size={categoryIconSize} color={iconColor} />,
  },
  {
    textARASAAC: "animal",
    text: "Animali",
    icon: <FontAwesome5 name="cat" size={categoryIconSize} color={iconColor} />,
  },
  {
    textARASAAC: "object",
    text: "Oggetti",
    icon: <Entypo name="pencil" size={categoryIconSize} color={iconColor} />,
  },
  {
    textARASAAC: "verb",
    text: "Azioni",
    icon: (
      <MaterialCommunityIcons
        name="hand-wave"
        size={categoryIconSize}
        color={iconColor}
      />
    ),
  },
  {
    textARASAAC: "basic needs",
    text: "Bisogni",
    icon: (
      <AntDesign
        name="exclamationcircleo"
        size={categoryIconSize}
        color={iconColor}
      />
    ),
  },
  {
    textARASAAC: "senses",
    text: "Sensi",
    icon: (
      <MaterialCommunityIcons
        name="ear-hearing"
        size={categoryIconSize}
        color={iconColor}
      />
    ),
  },
  {
    textARASAAC: "place",
    text: "Posti",
    icon: (
      <FontAwesome5 name="landmark" size={categoryIconSize} color={iconColor} />
    ),
  },
  {
    textARASAAC: "food",
    text: "Cibi",
    icon: (
      <MaterialIcons
        name="fastfood"
        size={categoryIconSize}
        color={iconColor}
      />
    ),
  },
  {
    textARASAAC: "beverage",
    text: "Bevande",
    icon: (
      <MaterialIcons
        name="local-drink"
        size={categoryIconSize}
        color={iconColor}
      />
    ),
  },
  {
    textARASAAC: "health",
    text: "Salute",
    icon: <AntDesign name="heart" size={categoryIconSize} color={iconColor} />,
  },
  {
    textARASAAC: "sport",
    text: "Sport",
    icon: (
      <MaterialIcons
        name="sports-soccer"
        size={categoryIconSize}
        color={iconColor}
      />
    ),
  },
  {
    textARASAAC: "core vocabulary",
    text: "Basilari",
    icon: (
      <MaterialCommunityIcons
        name="alphabet-latin"
        size={categoryIconSize}
        color={iconColor}
      />
    ),
  },
  {
    textARASAAC: "work",
    text: "Lavoro",
    icon: (
      <MaterialIcons name="work" size={categoryIconSize} color={iconColor} />
    ),
  },
  {
    textARASAAC: "education",
    text: "Educazione",
    icon: <Ionicons name="school" size={categoryIconSize} color={iconColor} />,
  },
  {
    textARASAAC: "furniture",
    text: "Arredamento",
    icon: (
      <MaterialCommunityIcons
        name="table-furniture"
        size={categoryIconSize}
        color={iconColor}
      />
    ),
  },
  {
    textARASAAC: "human body",
    text: "Corpo umano",
    icon: <Ionicons name="body" size={categoryIconSize} color={iconColor} />,
  },
  {
    textARASAAC: "adjective",
    text: "Aggettivi",
    icon: <Entypo name="text" size={categoryIconSize} color={iconColor} />,
  },
  {
    textARASAAC: "expression",
    text: "Espressioni",
    icon: (
      <MaterialIcons name="textsms" size={categoryIconSize} color={iconColor} />
    ),
  },
  {
    textARASAAC: "adverb",
    text: "Avverbi",
    icon: <Entypo name="text" size={categoryIconSize} color={iconColor} />,
  },
  {
    textARASAAC: "mathematics",
    text: "Matematica",
    icon: <Octicons name="number" size={categoryIconSize} color={iconColor} />,
  },
  {
    textARASAAC: "clothes",
    text: "Vestiti",
    icon: <Ionicons name="shirt" size={categoryIconSize} color={iconColor} />,
  },
];

export const baseCategories: CategoryType[] = [
  {
    textARASAAC: "fruit",
    text: "Frutta",
    icon: <AntDesign name="apple1" size={categoryIconSize} color={iconColor} />,
  },
  {
    textARASAAC: "animal",
    text: "Animali",
    icon: <FontAwesome5 name="cat" size={categoryIconSize} color={iconColor} />,
  },
  {
    textARASAAC: "object",
    text: "Oggetti",
    icon: <Entypo name="pencil" size={categoryIconSize} color={iconColor} />,
  },
  {
    textARASAAC: "verb",
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
