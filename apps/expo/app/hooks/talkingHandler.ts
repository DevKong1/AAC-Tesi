import type { Pictogram } from "../utils/types/commonTypes";
import { predictPictograms } from "./huggingFaceHandler";
import { getPictogram, getPictograms } from "./pictogramsHandler";

// TODO Predicting it will be async
export const getPredictedPictograms = async (
  previous?: Pictogram[],
  current?: Pictogram[],
  category?: string,
) => {
  const response = await predictPictograms(previous, current, category);
  // Dummy response
  return response
    ? getPictograms(response.pictograms)
    : [
        getPictogram("2617")!,
        getPictogram("6625")!,
        getPictogram("7271")!,
        getPictogram("5441")!,
        getPictogram("36719")!,
        getPictogram("7764")!,
        getPictogram("31859")!,
        getPictogram("36480")!,
      ];
};
