import { Dimensions } from "react-native";

import { type Pictogram } from "./types/commonTypes";

export const isDeviceLarge = () => {
  return Dimensions.get("window").width >= 1024;
};

export const defaultPictogram: Pictogram = {
  _id: 3418,
  keywords: [
    {
      keyword: "?",
      hasLocution: false,
      type: 6,
    },
  ],
};
