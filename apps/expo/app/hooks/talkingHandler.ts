import { predictPictograms } from "./huggingFaceHandler";

// TODO Predicting it will be async
export const getPredictedPictograms = async (
  previous?: string[],
  current?: string[],
  category?: string,
) => {
  const response = await predictPictograms(previous, current, category);
  // Dummy response
  return response
    ? response.pictograms
    : ["2617", "6625", "7271", "5441", "36719", "7764", "31859", "36480"];
};
