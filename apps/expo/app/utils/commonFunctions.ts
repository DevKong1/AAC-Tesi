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

/* TODO implement user preferences for N columns and rows
const getPunctuatedText = (pictogram: Pictogram) => {
  return `${pictogram.keywords[0]?.keyword}${
    pictogram.followingPunctation ? pictogram.followingPunctation : ""
  } `;
};

const getCountAndFirstOfPage = (
  pictograms: Pictogram[],
  page: number,
  rows: number,
  columns: number,
) => {
  let allPictogramsN = 0; // Total number of pictograms counting ALSO spaces after newLine
  let count = 0; // Used to count the empty spaces in line

  let foundFirst = false;
  let first = 0; // Index of the first pictogram to consider

  pictograms.forEach((el, i) => {
    // Check if the index equals the first one of the considered page
    if (!foundFirst && allPictogramsN >= rows * columns * (page - 1)) {
      first = i;
      foundFirst = true;
    }
    // If its a newLine we sum the empty spaces
    if (el.isNewLine) {
      if (count != columns - 1) allPictogramsN += columns - (count % columns);
      else allPictogramsN++;
      count = 0;
    } else {
      allPictogramsN++;
      count++;
    }
  });

  return [allPictogramsN, first];
};

export const getPage = (
  pictograms: Pictogram[],
  page: number,
  rows: number,
  columns: number,
) => {
  const fittedPictograms: Pictogram[][] = [];
  const pictogramsPerPage = rows * columns;

  let [allPictogramsN, first] = getCountAndFirstOfPage(
    pictograms,
    page,
    rows,
    columns,
  );
  if (!allPictogramsN) allPictogramsN = 0;
  if (!first) first = 0;

  // Check if the page is in range, also pages should start from 1
  if (pictogramsPerPage * (page - 1) > allPictogramsN || page == 0)
    return { pageN: 0, text: "", pictograms: [] } as Page;

  let text = "";
  let last = first + pictogramsPerPage;
  let newRow = [] as Pictogram[];
  let currentCol = 0;

  // Prepare the formatted rows and cols
  for (let i = first; i < last; ) {
    if (pictograms[i]) {
      if (pictograms[i]!.isNewLine) {
        fittedPictograms.push(newRow);
        last -= columns - newRow.length - 1; // -1 since the newLine doesnt count
        newRow = [];
        currentCol = 0;
      } // If we didnt reach the desired column size we add it
      else if (currentCol < columns) {
        if (pictograms[i]!.keywords[0])
          text += getPunctuatedText(pictograms[i]!);
        newRow.push(pictograms[i]!);
        currentCol++;
      } // Else we add the current row and reset
      else {
        if (pictograms[i]!.keywords[0])
          text += getPunctuatedText(pictograms[i]!);
        fittedPictograms.push(newRow);
        newRow = [pictograms[i]!];
        currentCol = 1;
      }
    }
    i++;
  }
  if (fittedPictograms.length < rows && newRow.length > 0)
    fittedPictograms.push(newRow);
  return { text: text, pageN: page, pictograms: fittedPictograms } as Page;
};

export const isPageEmpty = (
  pictograms: Pictogram[],
  page: number,
  rows: number,
  columns: number,
) => {
  const [allPictogramsN, _] = getCountAndFirstOfPage(
    pictograms,
    page,
    rows,
    columns,
  );
  console.log(rows * columns * (page - 1), allPictogramsN);
  if (!allPictogramsN) return true;
  if (rows * columns * (page - 1) > allPictogramsN || page == 0) return true;
  return false;
}; */
