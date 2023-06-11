import dictionary from "../../assets/dictionaries/Dizionario_it.json";
import { type Pictogram } from "../utils/types/commonTypes";

const dictionaryArray = dictionary as Pictogram[];

export const getPictogram = (id: string, customPictograms?: Pictogram[]) => {
  const custom = customPictograms?.find((el) => el._id == id);
  return custom ? custom : dictionaryArray.find((el) => el._id == id);
};

export const getPictograms = (
  ids: string[],
  customPictograms?: Pictogram[],
) => {
  const result = [] as Pictogram[];
  ids.forEach((id) => {
    const found = getPictogram(id, customPictograms);
    if (found) result.push(found);
  });
  return result;
};

export const findPictograms = (
  text: string,
  customPictograms?: Pictogram[],
) => {
  let result = dictionaryArray.filter((el) =>
    el.keywords?.find((key) => key.keyword.toLowerCase().includes(text)),
  );
  if (customPictograms) {
    result = customPictograms
      .filter((el) => el.customPictogram?.text?.toLowerCase().includes(text))
      .concat(result);
  }
  // WIP search whole word
  // if (whole)
  //   return result.filter(
  //     (el) =>
  //       el.keywords?.findIndex(
  //         (key) => key.keyword.match(new RegExp("\\b" + text + "\\b")) != null,
  //       ) != -1,
  //   );
  return result;
};
