/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Dimensions } from "react-native";

import { type Page, type Pictogram } from "./types/commonTypes";

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

const getPunctuatedText = (pictogram: Pictogram) => {
  return `${pictogram.keywords[0]?.keyword}${
    pictogram.followingPunctation ? pictogram.followingPunctation : ""
  } `;
};

export const getPage = (
  pictograms: Pictogram[],
  page: number,
  rows: number,
  columns: number,
) => {
  const fittedPictograms: Pictogram[][] = [];
  const pictogramsPerPage = rows * columns;

  let allPictogramsN = 0; // Total number of pictograms counting ALSO spaces after newLine
  let count = 0; // Used to count the empty spaces in line

  let first = 0; // Index of the first pictogram to consider
  let foundFirst = false;

  pictograms.forEach((el, i) => {
    // Check if the index equals the first one of the considered page
    if (!foundFirst && allPictogramsN >= pictogramsPerPage * (page - 1)) {
      first = i;
      foundFirst = true;
    }
    // If its a newLine we sum the empty spaces
    if (el.isNewLine) {
      allPictogramsN += columns - (count % columns);
      count = 0;
    } else {
      allPictogramsN++;
      count++;
    }
  });
  console.log(allPictogramsN, pictogramsPerPage * page, first);

  // Check if the page is in range, also pages should start from 1
  if (pictogramsPerPage * page > allPictogramsN || page == 0)
    return { pageN: 0, text: "", pictograms: [] } as Page;

  let text = "";
  let last = first + pictogramsPerPage;
  let newRow = [] as Pictogram[];
  let currentCol = 0;

  // Prepare the formatted rows and cols
  for (let i = first; i < last; ) {
    console.log(text, i, last, columns - newRow.length);
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
