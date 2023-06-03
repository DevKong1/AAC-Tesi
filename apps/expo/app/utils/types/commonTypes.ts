import { type ReactNode } from "react";

export type keyword = {
  type: number;
  meaning?: string;
  keyword: string;
  hasLocution: boolean;
  plural?: string;
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
  synsets?: string[];
  tags?: string[];
  _id: number;
  created?: string;
  lastUpdated?: string;
  keywords: keyword[];
  followingPunctation?: string;
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
  text: string;
  pictograms: Pictogram[];
  answer: number;
  picture: any;
};

export type Book = {
  id: string;
  title: string;
  cover: any;
  pictograms: Pictogram[][];
};

export type DiaryPage = {
  date: string;
  pictograms: Pictogram[][];
};

export type ReadingSettings = {
  rows: number;
  columns: number;
};
