/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Pictogram } from "../utils/types/commonTypes";
import { getPictogram } from "./pictogramsHandler";

// TODO Predicting it will be async
export const getPictograms = async (
  previous?: Pictogram[],
  current?: Pictogram[],
  category?: string,
  // eslint-disable-next-line @typescript-eslint/require-await
) => {
  //TODO Implement
  return [
    getPictogram(2617),
    getPictogram(6625),
    getPictogram(7271),
    getPictogram(5441),
    getPictogram(36719),
    getPictogram(7764),
    getPictogram(31859),
    getPictogram(36480),
  ];
};
