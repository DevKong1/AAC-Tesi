import * as Crypto from "expo-crypto";

import { type Book, type Pictogram } from "../utils/types/commonTypes";
import { getPictogram } from "./pictogramsHandler";

// eslint-disable-next-line @typescript-eslint/require-await
export const getBooks = async () => {
  const emptyPic = { isNewLine: true } as Pictogram;
  //TODO Implement
  return [
    {
      id: Crypto.randomUUID(),
      title: "La bella e la bestia",
      cover: require("../../assets/images/bella.jpg"),
      pictograms: [
        getPictogram(8277),
        getPictogram(8474),
        getPictogram(7114),
        getPictogram(27357),
        { ...getPictogram(2483), followingPunctation: "." },
        emptyPic,
        getPictogram(8277),
        getPictogram(8474),
        getPictogram(7114),
        getPictogram(27357),
        { ...getPictogram(2483), followingPunctation: "." },
        emptyPic,
        getPictogram(8277),
        getPictogram(8474),
        getPictogram(7114),
        getPictogram(27357),
        { ...getPictogram(2483), followingPunctation: "." },
      ],
    },
    {
      id: Crypto.randomUUID(),
      title: "Harry Potter e la Pietra Filosofale",
      cover: require("../../assets/images/harry.jpg"),
      pictograms: [],
    },
  ] as Book[];
};
