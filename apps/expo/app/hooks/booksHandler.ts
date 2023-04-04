import * as Crypto from "expo-crypto";

import dictionary from "../../assets/dictionaries/Dizionario_it.json";
import { type Book, type Pictogram } from "../utils/types/commonTypes";

export const getBooks = async () => {
  //TODO Implement
  return [
    {
      id: Crypto.randomUUID(),
      title: "La bella e la bestia",
      cover: require("../../assets/images/bella.jpg"),
      pictograms: [
        (dictionary as Pictogram[]).find((el) => el._id == 8277),
        (dictionary as Pictogram[]).find((el) => el._id == 8474),
        (dictionary as Pictogram[]).find((el) => el._id == 7114),
        (dictionary as Pictogram[]).find((el) => el._id == 27357),
        (dictionary as Pictogram[]).find((el) => el._id == 2483),
        (dictionary as Pictogram[]).find((el) => el._id == 8277),
        (dictionary as Pictogram[]).find((el) => el._id == 8474),
        (dictionary as Pictogram[]).find((el) => el._id == 7114),
        (dictionary as Pictogram[]).find((el) => el._id == 27357),
        (dictionary as Pictogram[]).find((el) => el._id == 2483),
        (dictionary as Pictogram[]).find((el) => el._id == 8277),
        (dictionary as Pictogram[]).find((el) => el._id == 8474),
        (dictionary as Pictogram[]).find((el) => el._id == 7114),
        (dictionary as Pictogram[]).find((el) => el._id == 27357),
        (dictionary as Pictogram[]).find((el) => el._id == 2483),
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
