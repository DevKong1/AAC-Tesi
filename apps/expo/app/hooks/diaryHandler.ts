/* eslint-disable @typescript-eslint/no-unused-vars */
import dictionary from "../../assets/dictionaries/Dizionario_it.json";
import { type DiaryPage, type Pictogram } from "../utils/types/commonTypes";

export const getPage = (date: Date) => {
  //TODO Implement
  return undefined;
  /* {
    date: date,
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
  } as DiaryPage; */
};

export const isDiaryEmpty = () => {
  return true;
};

export const isLast = (date: Date) => {
  return false;
};
