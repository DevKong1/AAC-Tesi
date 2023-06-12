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
      id: "00e0d9f9-aabd-4872-bd54-f3975d75bfc8",
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
      id: "6a24550e-2f3c-4874-a7e2-76453bcc82c0",
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
