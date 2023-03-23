import { type ReactNode } from "react";

export type keyword = {
  type: number;
  meaning: string | null;
  keyword: string;
  hasLocution: boolean;
  plural: string | null;
};

export type Pictogram = {
  schematic?: boolean;
  sex?: boolean;
  violence?: boolean;
  aac?: boolean;
  aacColor?: boolean;
  skin?: boolean;
  hair?: boolean;
  downloads?: number;
  categories?: string[];
  synsets?: string;
  tags?: string[];
  _id: number;
  created?: Date;
  lastUpdated?: Date;
  keywords?: keyword[];
  image?: Blob;
};

export type Board = {
  id: string;
  pictograms: Pictogram[];
};

export type CategoryType = {
  text: string;
  icon: ReactNode;
};

export type WhatsItGameProperties = {
  id: string;
  pictograms: Pictogram[];
  answer: number;
  //TODO
  picture: string;
};
