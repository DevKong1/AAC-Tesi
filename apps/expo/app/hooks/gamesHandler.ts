import * as Crypto from "expo-crypto";

import dictionary from "../../assets/dictionaries/Dizionario_it.json";
import type {
  Pictogram,
  WhatsItGameProperties,
} from "../utils/types/commonTypes";

// TODO Predicting it will be async
export const generateWhatsItGame = async () => {
  //TODO Implement
  return {
    id: Crypto.randomUUID(),
    text: "Indovina cos'ha in mano il bambino!",
    pictograms: [
      (dictionary as Pictogram[]).find((el) => el._id == 2462),
      (dictionary as Pictogram[]).find((el) => el._id == 4918),
      (dictionary as Pictogram[]).find((el) => el._id == 2561),
      (dictionary as Pictogram[]).find((el) => el._id == 2483),
      (dictionary as Pictogram[]).find((el) => el._id == 2530),
      (dictionary as Pictogram[]).find((el) => el._id == 4933),
    ],
    answer: 2462,
    picture: require("../../assets/images/whatsItExample.jpg"),
  } as WhatsItGameProperties;
};
