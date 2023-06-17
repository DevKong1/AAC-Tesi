import { randomUUID } from "expo-crypto";

import { type Book, type WhatsItGameProperties } from "./types/commonTypes";

export const dummyBooks = [
  {
    id: "00e0d9f9-aabd-4872-bd54-f3975d75bfc8",
    title: "La bella e la bestia",
    cover: require("../../assets/images/bella.jpg"),
    pictograms: [
      ["8277", "8474", "7114", "27357"],
      ["2483", "8277", "8474", "7114"],
      ["27357", "2483", "8277", "8474"],
      ["7114", "27357", "2483"],
    ],
  },
  {
    id: "6a24550e-2f3c-4874-a7e2-76453bcc82c0",
    title: "Harry Potter e la Pietra Filosofale",
    cover: require("../../assets/images/harry.jpg"),
    pictograms: [
      ["8277", "8474", "7114", "27357"],
      ["2483", "8277", "8474", "7114"],
      ["27357", "2483", "8277", "8474"],
      ["7114", "27357", "2483"],
    ],
  },
] as Book[];

export const dummyPredictedPictograms = [
  "2617",
  "6625",
  "7271",
  "5441",
  "36719",
  "7764",
  "31859",
  "36480",
];

export const dummyGame = {
  id: randomUUID(),
  text: "Indovina cos'ha in mano il bambino!",
  pictograms: ["2462", "4918", "2561", "2483", "2530", "4933"],
  answer: "2462",
  picture: require("../../assets/images/whatsItExample.jpg"),
} as WhatsItGameProperties;
