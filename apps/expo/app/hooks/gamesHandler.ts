import * as Crypto from "expo-crypto";

import type { WhatsItGameProperties } from "../utils/types/commonTypes";
import { requestWhatsItGame } from "./huggingFaceHandler";

export const generateWhatsItGame = async (category?: string) => {
  const response = await requestWhatsItGame(category);
  if (response)
    return {
      id: Crypto.randomUUID(),
      text: response.text,
      pictograms: response.pictograms,
      answer: response.answer,
      picture: response.picture,
      isGenerated: true, // Just for development
    } as WhatsItGameProperties;
  // Dummy response
  else
    return {
      id: Crypto.randomUUID(),
      text: "Indovina cos'ha in mano il bambino!",
      pictograms: ["2462", "4918", "2561", "2483", "2530", "4933"],
      answer: "2462",
      picture: require("../../assets/images/whatsItExample.jpg"),
    } as WhatsItGameProperties;
};
