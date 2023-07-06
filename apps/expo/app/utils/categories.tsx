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
    pictogram: "28339",
  },
  {
    textARASAAC: "animal",
    text: "Animali",
    icon: <FontAwesome5 name="cat" size={categoryIconSize} color={iconColor} />,
    color: "#e8caca",
    pictogram: "6901",
  },
  {
    textARASAAC: "object",
    text: "Oggetti",
    icon: <Entypo name="pencil" size={categoryIconSize} color={iconColor} />,
    color: "#caffbf",
    pictogram: "11318",
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
    pictogram: "32067",
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
    pictogram: "37160",
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
    pictogram: "2381",
  },
  {
    textARASAAC: "place",
    text: "Posti",
    icon: (
      <FontAwesome5 name="landmark" size={categoryIconSize} color={iconColor} />
    ),
    color: "#caffbf",
    pictogram: "9819",
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
    pictogram: "2349",
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
    pictogram: "6061",
  },
  {
    textARASAAC: "health",
    text: "Salute",
    icon: <AntDesign name="heart" size={categoryIconSize} color={iconColor} />,
    color: "#c79750",
    pictogram: "14264",
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
    pictogram: "7010",
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
    pictogram: "37029",
  },
  {
    textARASAAC: "work",
    text: "Lavoro",
    icon: (
      <MaterialIcons name="work" size={categoryIconSize} color={iconColor} />
    ),
    color: "#bdb2ff",
    pictogram: "37038",
  },
  {
    textARASAAC: "education",
    text: "Educazione",
    icon: <Ionicons name="school" size={categoryIconSize} color={iconColor} />,
    color: "#fffffc",
    pictogram: "3082",
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
    pictogram: "32578",
  },
  {
    textARASAAC: "human body",
    text: "Corpo umano",
    icon: <Ionicons name="body" size={categoryIconSize} color={iconColor} />,
    color: "#fdffb6",
    pictogram: "2728",
  },
  {
    textARASAAC: "adjective",
    text: "Aggettivi",
    icon: <Entypo name="text" size={categoryIconSize} color={iconColor} />,
    color: "#a0c4ff",
    pictogram: "32584",
  },
  {
    textARASAAC: "expression",
    text: "Espressioni",
    icon: (
      <MaterialIcons name="textsms" size={categoryIconSize} color={iconColor} />
    ),
    color: "#a0c4ff",
    pictogram: "32592",
  },
  {
    textARASAAC: "mathematics",
    text: "Matematica",
    icon: <Octicons name="number" size={categoryIconSize} color={iconColor} />,
    color: "#fffffc",
    pictogram: "10260",
  },
  {
    textARASAAC: "clothes",
    text: "Vestiti",
    icon: <Ionicons name="shirt" size={categoryIconSize} color={iconColor} />,
    color: "#caffbf",
    pictogram: "2613",
  },
];

export const favouriteCategory: CategoryType = {
  textARASAAC: "favourites",
  text: "Preferiti",
  icon: <MaterialIcons name="star" size={categoryIconSize} color={iconColor} />,
  color: "",
  pictogram: "30012",
};

export const baseCategories: string[] = ["fruit", "animal", "object", "verb"];
