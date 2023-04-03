import * as Crypto from "expo-crypto";

import { type Book } from "../utils/types/commonTypes";

export const getBooks = async () => {
  //TODO Implement
  return [
    {
      id: Crypto.randomUUID(),
      title: "La bella e la bestia",
      cover: require("../../assets/images/bella.jpg"),
      settings: { rows: 4, columns: 5 },
    },
    {
      id: Crypto.randomUUID(),
      title: "Harry Potter e la Pietra Filosofale",
      cover: require("../../assets/images/harry.jpg"),
      settings: { rows: 4, columns: 5 },
    },
  ] as Book[];
};
