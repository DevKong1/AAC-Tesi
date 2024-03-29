import Constants from "expo-constants";
import { HUGGINGFACE_BEARER } from "@env";
import axios from "axios";
import axiosRetry from "axios-retry";

import { type CustomPictogram } from "../utils/types/commonTypes";

const huggingfaceBearer = Constants.expoConfig?.extra?.huggingfaceBearer
  ? Constants.expoConfig?.extra?.huggingfaceBearer
  : HUGGINGFACE_BEARER;

export interface ParsedFileResponse {
  pictograms: string[];
  customPictograms: CustomPictogram[];
}

export interface GeneratedWhatsItGameResponse {
  text: string;
  pictograms: string[];
  answer: string;
  picture: string;
}

export interface PictogramPredictionRequest {
  previous?: string[];
  current?: string[];
  category?: string;
  showAdjectives?: boolean;
}

export interface PredictedPictogramsResponse {
  pictograms: string[];
}

// Axios settings
const reqInstance = axios.create({
  baseURL: "https://api-inference.huggingface.co/models/",
  headers: {
    Authorization: `Bearer ${huggingfaceBearer}`,
  },
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
axiosRetry(reqInstance as any, { retries: 3, retryDelay: () => 3000 });

// DUMMY DATA AND MODELS

// Books
const getPictogramsFromFileRequest = async (body: string) => {
  try {
    const response = await reqInstance.post("HF_USER/HF_MODEL", body);
    return response.data as ParsedFileResponse;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const getPictogramsFromFile = async (uri: string) => {
  const data = await getPictogramsFromFileRequest(uri);
  return data;
};

// Games
const getGeneratedWhatsItGame = async (category?: string) => {
  try {
    const response = await reqInstance.post(
      "HF_USER/HF_MODEL",
      category ? JSON.stringify(category) : undefined,
    );
    return response.data as GeneratedWhatsItGameResponse;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const requestWhatsItGame = async (category?: string) => {
  const data = await getGeneratedWhatsItGame(category);
  return data;
};

// Talking
const getPredictedPictograms = async (data: PictogramPredictionRequest) => {
  try {
    const response = await reqInstance.post(
      "HF_USER/HF_MODEL",
      JSON.stringify(data),
    );
    return response.data as PredictedPictogramsResponse;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

// Now pictograms are formatted as a string but it could change
export const predictPictograms = async (
  previous?: string[],
  current?: string[],
  category?: string,
  showAdjectives?: boolean,
) => {
  const data = await getPredictedPictograms({
    previous: previous,
    current: current,
    category: category,
    showAdjectives: showAdjectives,
  } as PictogramPredictionRequest);
  return data;
};
