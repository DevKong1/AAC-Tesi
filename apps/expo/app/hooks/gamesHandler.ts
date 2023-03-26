import * as Crypto from "expo-crypto";

import dictionary from "../../assets/dictionaries/Dizionario_it.json";
import pictograms from "../utils/pictograms";
import {
  Pictogram,
  type WhatsItGameProperties,
} from "../utils/types/commonTypes";

// TODO Predicting it will be async
export const generateWhatsItGame = async () => {
  //TODO Implement
  return {
    id: Crypto.randomUUID(),
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
