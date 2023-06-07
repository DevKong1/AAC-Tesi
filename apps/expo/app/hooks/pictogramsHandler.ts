import dictionary from "../../assets/dictionaries/Dizionario_it.json";
import { defaultPictogram } from "../utils/commonFunctions";
import { type Pictogram } from "../utils/types/commonTypes";

const dictionaryArray = dictionary as Pictogram[];

export const getPictogram = (id: number) => {
  const pictogram = dictionaryArray.find((el) => el._id == id);
  return pictogram ? pictogram : defaultPictogram;
};

export const getPictograms = (ids: number[]) => {
  const result = [] as Pictogram[];
  ids.forEach((id) => {
    const found = getPictogram(id);
    found._id != -1 ? result.push(found) : null;
  });
  return result;
};

export const findPictograms = (text: string, whole = false) => {
  const result = dictionaryArray.filter(
    (el) => el.keywords?.findIndex((key) => key.keyword.includes(text)) != -1,
  );
  if (whole)
    return result.filter(
      (el) =>
        el.keywords?.findIndex(
          (key) => key.keyword.match(new RegExp("\\b" + text + "\\b")) != null,
        ) != -1,
    );
  return result;
};
