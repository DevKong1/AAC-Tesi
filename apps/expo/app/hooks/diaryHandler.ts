import { type DiaryPage, type Pictogram } from "../utils/types/commonTypes";
import dictionary from "../../assets/dictionaries/Dizionario_it.json";

export const getPages = async () => {
  //TODO Implement
  return [
    {
      date: new Date(),
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
      date: new Date(),
      pictograms: [
        (dictionary as Pictogram[]).find((el) => el._id == 1233),
        (dictionary as Pictogram[]).find((el) => el._id == 1322),
        (dictionary as Pictogram[]).find((el) => el._id == 2483),
      ],
    },
  ] as DiaryPage[];
};
