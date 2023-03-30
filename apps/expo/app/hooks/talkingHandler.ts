import dictionary from "../../assets/dictionaries/Dizionario_it.json";
import type { Pictogram } from "../utils/types/commonTypes";

// TODO Predicting it will be async
export const getPictograms = async (
  previous?: Pictogram[],
  current?: Pictogram[],
  category?: string,
) => {
  //TODO Implement
  return [
    (dictionary as Pictogram[]).find((el) => el._id == 2617)!,
    (dictionary as Pictogram[]).find((el) => el._id == 6625)!,
    (dictionary as Pictogram[]).find((el) => el._id == 7271)!,
    (dictionary as Pictogram[]).find((el) => el._id == 5441)!,
    (dictionary as Pictogram[]).find((el) => el._id == 36719)!,
    (dictionary as Pictogram[]).find((el) => el._id == 7764)!,
    (dictionary as Pictogram[]).find((el) => el._id == 31859)!,
    (dictionary as Pictogram[]).find((el) => el._id == 36480)!,
  ];
};
