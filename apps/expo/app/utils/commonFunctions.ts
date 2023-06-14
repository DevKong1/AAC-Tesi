import { Dimensions } from "react-native";

import { type Pictogram } from "./types/commonTypes";

export const isDeviceLarge = () => {
  return Dimensions.get("window").width >= 1024;
};

export const formatToMatchColumns = (
  pictograms: Pictogram[],
  columns: number,
) => {
  if (pictograms.length <= columns) return [pictograms];
  const result = [] as Pictogram[][];
  const nRows = Math.ceil(pictograms.length / columns);
  for (let i = 0; i < nRows; i++) {
    result.push(pictograms.slice(i * columns, (i + 1) * columns));
  }
  return result;
};

export const getTextFromPictogramsMatrix = (pictograms: Pictogram[][]) => {
  let text = "";
  pictograms.forEach((row) => {
    text += getTextFromPictogramsArray(row);
  });
  return text;
};

export const getTextFromPictogramsArray = (pictograms: Pictogram[]) => {
  let text = "";
  pictograms.forEach((el) => {
    if (el.customPictogram?.text) text += el.customPictogram.text;
    else if (el.keywords[0]?.keyword) text += el.keywords[0]?.keyword;
    text += " ";
  });
  return text;
};

export const getIDsFromPictogramsArray = (pictograms: Pictogram[]) => {
  return pictograms.flatMap((el) => el._id);
};

export const getIDsFromPictogramsMatrix = (pictograms: Pictogram[][]) => {
  return pictograms.map((el) => getIDsFromPictogramsArray(el));
};
