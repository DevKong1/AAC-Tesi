import * as Crypto from "expo-crypto";

import type { WhatsItGameProperties } from "../utils/types/commonTypes";
import { requestWhatsItGame } from "./huggingFaceHandler";
import { getPictogram, getPictograms } from "./pictogramsHandler";

// TODO Predicting it will be async

export const generateWhatsItGame = async (category?: string) => {
  const response = await requestWhatsItGame(category);
  if (response)
    return {
      id: Crypto.randomUUID(),
      text: response.text,
      pictograms: getPictograms(response.pictograms),
      answer: response.answer,
      picture: response.picture,
      isGenerated: true, // Just for development
    } as WhatsItGameProperties;
  // Dummy response
  else
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
