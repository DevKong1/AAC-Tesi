import * as Crypto from "expo-crypto";

import { formatToMatchColumns } from "../utils/commonFunctions";
import { type Book } from "../utils/types/commonTypes";
import { getPictogramsFromFile } from "./huggingFaceHandler";
import { getPictogram, getPictograms } from "./pictogramsHandler";

export const parseDocument = async (uri: string, columns: number) => {
  const response = await getPictogramsFromFile(uri);
  return response
    ? formatToMatchColumns(getPictograms(response.pictograms), columns)
    : undefined;
};

export const getDummyBooks = () => {
  return [
    {
      id: Crypto.randomUUID(),
      title: "La bella e la bestia",
      cover: require("../../assets/images/bella.jpg"),
      pictograms: [
        [
          getPictogram("8277"),
          getPictogram("8474"),
          getPictogram("7114"),
          getPictogram("27357"),
        ],
        [
          getPictogram("2483"),
          getPictogram("8277"),
          getPictogram("8474"),
          getPictogram("7114"),
        ],
        [
          getPictogram("27357"),
          getPictogram("2483"),
          getPictogram("8277"),
          getPictogram("8474"),
        ],
        [getPictogram("7114"), getPictogram("27357"), getPictogram("2483")],
      ],
    },
    {
      id: Crypto.randomUUID(),
      title: "Harry Potter e la Pietra Filosofale",
      cover: require("../../assets/images/harry.jpg"),
      pictograms: [
        [
          getPictogram("8277"),
          getPictogram("8474"),
          getPictogram("7114"),
          getPictogram("27357"),
        ],
        [
          getPictogram("2483"),
          getPictogram("8277"),
          getPictogram("8474"),
          getPictogram("7114"),
        ],
        [
          getPictogram("27357"),
          getPictogram("2483"),
          getPictogram("8277"),
          getPictogram("8474"),
        ],
        [getPictogram("7114"), getPictogram("27357"), getPictogram("2483")],
      ],
    },
  ] as Book[];
};
