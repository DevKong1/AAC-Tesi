import dictionary from "../../assets/dictionaries/Dizionario_it.json";
import { type Pictogram } from "../utils/types/commonTypes";

const dictionaryArray = dictionary as Pictogram[];

const notFound: Pictogram = {
  _id: 3418,
  keywords: [
    {
      keyword: "?",
      hasLocution: false,
      type: 6,
    },
  ],
};

// TODO Predicting it will be async
export const getPictogram = (id: number) => {
  const pictogram = dictionaryArray.find((el) => el._id == id);
  return pictogram ? pictogram : notFound;
};
