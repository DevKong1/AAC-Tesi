import dictionary from "../../assets/dictionaries/Dizionario_it.json";
import { defaultPictogram } from "../utils/commonFunctions";
import { type Pictogram } from "../utils/types/commonTypes";

const dictionaryArray = dictionary as Pictogram[];

// TODO Predicting it will be async
export const getPictogram = (id: number) => {
  const pictogram = dictionaryArray.find((el) => el._id == id);
  return pictogram ? pictogram : defaultPictogram;
};
