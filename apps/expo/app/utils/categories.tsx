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

// Colors are given so that similar concepts are categorized together, such as [fruit,food,beverage] or [object,furniture,clothing]
export const allCategories: CategoryType[] = [
  {
    textARASAAC: "fruit",
    text: "Frutta",
    icon: <AntDesign name="apple1" size={categoryIconSize} color={iconColor} />,
    color: "#ffd6a5",
  },
  {
    textARASAAC: "animal",
    text: "Animali",
    icon: <FontAwesome5 name="cat" size={categoryIconSize} color={iconColor} />,
    color: "#e8caca",
  },
  {
    textARASAAC: "object",
    text: "Oggetti",
    icon: <Entypo name="pencil" size={categoryIconSize} color={iconColor} />,
    color: "#caffbf",
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
    color: "#ffadad",
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
    color: "#bdb2ff",
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
    color: "#fdffb6",
  },
  {
    textARASAAC: "place",
    text: "Posti",
    icon: (
      <FontAwesome5 name="landmark" size={categoryIconSize} color={iconColor} />
    ),
    color: "#caffbf",
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
    color: "#ffd6a5",
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
    color: "#ffd6a5",
  },
  {
    textARASAAC: "health",
    text: "Salute",
    icon: <AntDesign name="heart" size={categoryIconSize} color={iconColor} />,
    color: "#fdffb6",
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
    color: "#c7ede1",
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
    color: "#bdb2ff",
  },
  {
    textARASAAC: "pronoun",
    text: "Pronomi",
    icon: <Ionicons name="person" size={categoryIconSize} color={iconColor} />,
    color: "#a0c4ff",
  },
  {
    textARASAAC: "work",
    text: "Lavoro",
    icon: (
      <MaterialIcons name="work" size={categoryIconSize} color={iconColor} />
    ),
    color: "#bdb2ff",
  },
  {
    textARASAAC: "education",
    text: "Educazione",
    icon: <Ionicons name="school" size={categoryIconSize} color={iconColor} />,
    color: "#fffffc",
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
    color: "#caffbf",
  },
  {
    textARASAAC: "human body",
    text: "Corpo umano",
    icon: <Ionicons name="body" size={categoryIconSize} color={iconColor} />,
    color: "#fdffb6",
  },
  {
    textARASAAC: "adjective",
    text: "Aggettivi",
    icon: <Entypo name="text" size={categoryIconSize} color={iconColor} />,
    color: "#a0c4ff",
  },
  {
    textARASAAC: "expression",
    text: "Espressioni",
    icon: (
      <MaterialIcons name="textsms" size={categoryIconSize} color={iconColor} />
    ),
    color: "#a0c4ff",
  },
  {
    textARASAAC: "adverb",
    text: "Avverbi",
    icon: <Entypo name="text" size={categoryIconSize} color={iconColor} />,
    color: "#a0c4ff",
  },
  {
    textARASAAC: "mathematics",
    text: "Matematica",
    icon: <Octicons name="number" size={categoryIconSize} color={iconColor} />,
    color: "#fffffc",
  },
  {
    textARASAAC: "clothes",
    text: "Vestiti",
    icon: <Ionicons name="shirt" size={categoryIconSize} color={iconColor} />,
    color: "#caffbf",
  },
];

export const baseCategories: string[] = ["fruit", "animal", "object", "verb"];
