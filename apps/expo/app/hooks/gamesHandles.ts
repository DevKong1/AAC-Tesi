import * as Crypto from "expo-crypto";

import {
  Pictogram,
  type WhatsItGameProperties,
} from "../../src/types/commonTypes";

// TODO Predicting it will be async
export const generateWhatsItGame = async () => {
  //TODO Implement
  return {
    id: Crypto.randomUUID(),
    pictograms: [
      { _id: 2462 },
      { _id: 4918 },
      { _id: 2561 },
      { _id: 2483 },
      { _id: 2530 },
      { _id: 4933 },
    ],
    answer: 2462,
    picture: "whatsItExample.jpg",
  } as WhatsItGameProperties;
};
