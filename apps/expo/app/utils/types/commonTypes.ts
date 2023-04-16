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
  keywords: keyword[];
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
  pictograms: Pictogram[];
};

export type BookSettings = {
  columns: number;
  rows: number;
};

export type DiaryPage = {
  date: Date;
  pictograms: Pictogram[];
};
