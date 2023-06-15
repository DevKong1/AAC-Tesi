import { Dimensions } from "react-native";

import { type Pictogram } from "./types/commonTypes";

export const isDeviceLarge = () => {
  return Dimensions.get("window").width >= 1024;
};

export const formatToMatchColumns = (pictograms: string[], columns: number) => {
  if (pictograms.length <= columns) return [pictograms];
  const result = [] as string[][];
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

function levenshteinDistance(a: string, b: string): number {
  // Create a 2D array to store the distances
  const distances = new Array(a.length + 1);
  for (let i = 0; i <= a.length; i++) {
    distances[i] = new Array(b.length + 1);
  }

  // Initialize the first row and column
  for (let i = 0; i <= a.length; i++) {
    distances[i][0] = i;
  }
  for (let j = 0; j <= b.length; j++) {
    distances[0][j] = j;
  }

  // Fill in the rest of the array
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        distances[i][j] = distances[i - 1][j - 1];
      } else {
        distances[i][j] =
          Math.min(
            distances[i - 1][j],
            distances[i][j - 1],
            distances[i - 1][j - 1],
          ) + 1;
      }
    }
  }

  // Return the final distance
  return distances[a.length][b.length];
}

export function sortBySimilarity(
  pictograms: Pictogram[],
  singleWord: string,
): Pictogram[] {
  // Create an array of objects to store the words and their distances
  const wordDistances = pictograms.map((pictogram) => {
    const smallest = Math.min(
      ...pictogram.keywords.flatMap((keyword) =>
        levenshteinDistance(keyword.keyword, singleWord),
      ),
    );
    return {
      pictogram: pictogram,
      distance: smallest,
    };
  });

  // Sort the array by distance
  wordDistances.sort((a, b) => a.distance - b.distance);

  // Return the sorted list of words
  return wordDistances.map((wd) => wd.pictogram);
}
