import * as Crypto from "expo-crypto";

import type { WhatsItGameProperties } from "../utils/types/commonTypes";
import { getPictogram } from "./pictogramsHandler";

// TODO Predicting it will be async
// eslint-disable-next-line @typescript-eslint/require-await
export const generateWhatsItGame = async () => {
  //TODO Implement
  return {
    id: Crypto.randomUUID(),
    text: "Indovina cos'ha in mano il bambino!",
    pictograms: [
      getPictogram("2462"),
      getPictogram("4918"),
      getPictogram("2561"),
      getPictogram("2483"),
      getPictogram("2530"),
      getPictogram("4933"),
    ],
    answer: "2462",
    picture: require("../../assets/images/whatsItExample.jpg"),
  } as WhatsItGameProperties;
};
