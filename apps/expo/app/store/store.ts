import { randomUUID } from "expo-crypto";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sleep } from "@tanstack/query-core/build/lib/utils";
import { create } from "zustand";

import { getPictogram, getPictograms } from "../hooks/pictogramsHandler";
import {
  type Book,
  type CustomPictogram,
  type DiaryPage,
  type Pictogram,
  type ReadingSettings,
} from "../utils/types/commonTypes";

interface CompanionState {
  isVisible: boolean;
  currentMood: string;
  currentText: string;
  position: string;
  bubblePosition: string;
  volumeOn: boolean;
  bubbleOn: boolean;
  reset: () => void;
  speak: (
    text: string,
    bubblePosition?: string,
    onBoundary?: (e: any) => void,
  ) => Promise<void>;
  changeVolume: () => Promise<void>;
  changeBubble: () => void;
  setPosition: (newPosition: string) => void;
  setVisible: (value: boolean) => void;
}

export const useCompanionStore = create<CompanionState>((set, get) => ({
  isVisible: true,
  currentMood: "",
  currentText: "",
  position: "default",
  bubblePosition: "left",
  volumeOn: true,
  bubbleOn: true,
  reset: () => {
    set({ currentText: "", bubblePosition: "left" });
  },
  speak: async (text, bubblePosition?, onBoundary?) => {
    if (!get().isVisible) return;

    if (bubblePosition && ["top", "left"].includes(bubblePosition)) {
      set({ bubblePosition: bubblePosition });
    }
    await Speech.stop();
    set({ currentText: text });
    // Just show bubble if no volume
    if (!get().volumeOn) {
      await sleep(5000);
      get().reset();
    } else {
      Speech.speak(text, {
        language: "it-IT",
        // TODO Is this ok (?)
        onDone: (async () => {
          await sleep(1000);
          // We dont want to reset another text
          if (!(await Speech.isSpeakingAsync())) get().reset();
          return;
        }) as () => void,
        onBoundary: onBoundary,
      });
    }
  },
  changeVolume: async () => {
    await Speech.stop();
    set({ currentText: "", volumeOn: !get().volumeOn });
  },
  changeBubble: () => set({ bubbleOn: !get().bubbleOn }),
  setPosition: (newPosition) => {
    ["default", "center"].includes(newPosition)
      ? set({ position: newPosition })
      : null;
  },
  setVisible: (value) => set({ isVisible: value }),
}));

interface DiaryState {
  diary: DiaryPage[];
  readingSettings: ReadingSettings;
  load: () => Promise<void>;
  getDiaryPage: (date: string) => DiaryPage | undefined;
  getPreviousPage: (date: string) => DiaryPage | undefined;
  getNextPage: (date: string) => DiaryPage | undefined;
  addPictogramsToPage: (
    date: string,
    pictograms: Pictogram[],
  ) => Promise<DiaryPage | undefined>;
  addDiaryPage: (page: DiaryPage) => Promise<boolean>;
  updatePictogramsInPage: (
    date: string,
    entryIndex: number,
    pictograms: Pictogram[],
  ) => Promise<boolean>;
  removeDiaryPage: (date: string) => Promise<boolean>;
}

export const useDiaryStore = create<DiaryState>((set, get) => ({
  //TODO TEST BACKUP!
  diary: [],
  readingSettings: { rows: 3, columns: 4 } as ReadingSettings, // TODO Customizable
  load: async () => {
    try {
      const diaryValue = await AsyncStorage.getItem("@diary");

      if (diaryValue !== null) {
        set({ diary: JSON.parse(diaryValue) });
        console.log("AsyncStorage: Loaded diary");
      } else {
        console.log("AsyncStorage: Null diary value");
        await AsyncStorage.setItem("@diary", JSON.stringify([]));
      }
    } catch (e) {
      console.log("AsyncStorage: ERROR");
    }
  },
  getDiaryPage: (date) => {
    return get().diary.find((el) => el.date == date);
  },
  getPreviousPage: (date) => {
    return get().diary.find((el) => new Date(el.date) < new Date(date));
  },
  getNextPage: (date) => {
    return get().diary.find((el) => new Date(el.date) > new Date(date));
  },
  addDiaryPage: async (page) => {
    if (!get().getDiaryPage(page.date)) {
      set((state) => ({ diary: [...state.diary, page] }));
      return true;
    } else return false;
  },
  addPictogramsToPage: async (date, pictograms) => {
    const pageIndex = get().diary.findIndex((el) => el.date == date);
    if (pageIndex != -1) {
      const newDiary = get().diary;
      newDiary[pageIndex]!.pictograms.push(pictograms);
      set({ diary: newDiary });
      return get().getDiaryPage(date);
    } else return undefined;
  },
  updatePictogramsInPage: async (date, entryIndex, pictograms) => {
    const pageIndex = get().diary.findIndex((el) => el.date == date);
    if (pageIndex != -1) {
      const newDiary = get().diary;
      if (pictograms.length > 0)
        newDiary[pageIndex]!.pictograms[entryIndex] = pictograms;
      else newDiary[pageIndex]!.pictograms.splice(entryIndex, 1);
      set({ diary: newDiary });
      // If the page is empty of pictograms we remove it
      if (newDiary[pageIndex]!.pictograms.length <= 0)
        return get().removeDiaryPage(date);
      return true;
    } else return false;
  },
  removeDiaryPage: async (date) => {
    const pageIndex = get().diary.findIndex((el) => el.date == date);
    if (pageIndex != -1) {
      set((state) => ({
        diary: [
          ...state.diary.slice(0, pageIndex),
          ...state.diary.slice(pageIndex + 1),
        ],
      }));
      return true;
    } else return false;
  },
}));

interface inputState {
  id: string | undefined;
  command: string | undefined;
  inputPictograms: Pictogram[] | undefined;
  requestCompleted: boolean;
  args: any | undefined;
  inputRequest: (id: string, command: string, args?: any) => void;
  setInput: (reqID: string, inputPictograms: Pictogram[]) => void;
  clear: () => void;
}

export const useInputStore = create<inputState>((set, get) => ({
  id: undefined,
  command: undefined,
  inputPictograms: undefined,
  requestCompleted: false,
  args: undefined,
  inputRequest: (id: string, command: string, args?: any) => {
    set({ id: id, command: command, requestCompleted: false, args: args });
  },
  setInput: (reqID: string, inputPictograms: Pictogram[]) => {
    if (reqID == get().id)
      set({ inputPictograms: inputPictograms, requestCompleted: true });
  },
  clear: () => {
    set({
      id: undefined,
      command: undefined,
      inputPictograms: undefined,
      requestCompleted: false,
      args: undefined,
    });
  },
}));

interface PictogramState {
  favourites: string[];
  customPictograms: CustomPictogram[];
  getFavouritePictograms: () => Pictogram[];
  getCustomPictograms: () => Pictogram[];
  addFavourite: (id: string) => Promise<void>;
  removeFavourite: (id: string) => Promise<void>;
  addCustomPictogram: (
    oldId?: string,
    text?: string,
    image?: string,
  ) => Promise<void>;
  removeCustomPictogram: (id: string) => Promise<void>;
}

export const usePictogramStore = create<PictogramState>((set, get) => ({
  favourites: [],
  customPictograms: [],
  getFavouritePictograms: () => {
    return getPictograms(get().favourites, get().getCustomPictograms());
  },
  getCustomPictograms: () => {
    const result = [] as Pictogram[];
    get().customPictograms.forEach((pictogram) => {
      if (pictogram.oldId) {
        const oldValue = getPictogram(pictogram.oldId);
        oldValue
          ? result.push({
              ...oldValue,
              customPictogram: pictogram,
            })
          : null;
      } else {
        result.push({
          _id: pictogram._id,
          keywords: [],
          customPictogram: pictogram,
        });
      }
    });
    return result;
  },
  addFavourite: async (id) => {
    if (!get().favourites.find((el) => el == id))
      set((state) => ({ favourites: [...state.favourites, id] }));
  },
  removeFavourite: async (id) => {
    const index = get().favourites.findIndex((el) => el == id);
    if (index != -1)
      set((state) => ({
        favourites: [
          ...state.favourites.slice(0, index),
          ...state.favourites.slice(index + 1),
        ],
      }));
  },
  addCustomPictogram: async (oldId?, text?, image?) => {
    const id = randomUUID();
    const newPictogram = {
      _id: id,
      oldId: oldId,
      text: text,
      image: image,
    } as CustomPictogram;
    set((state) => ({
      customPictograms: [...state.customPictograms, newPictogram],
    }));
  },
  removeCustomPictogram: async (id) => {
    const index = get().customPictograms.findIndex((el) => el._id == id);
    if (index != -1) {
      if (get().favourites.find((el) => el == id)) get().removeFavourite(id);
      set((state) => ({
        customPictograms: [
          ...state.customPictograms.slice(0, index),
          ...state.customPictograms.slice(index + 1),
        ],
      }));
    }
  },
}));

interface BookState {
  customBooks: Book[];
  readingSettings: ReadingSettings;
  load: () => Promise<boolean>;
  getBook: (id: string) => Book | undefined;
  addBook: (book: Book) => Promise<boolean>;
  removeBook: (id: string) => Promise<boolean>;
}

export const useBookStore = create<BookState>((set, get) => ({
  customBooks: [],
  readingSettings: { rows: 3, columns: 4 } as ReadingSettings, // TODO Customizable
  load: async () => {
    return true;
  },
  getBook: (id) => {
    return get().customBooks.find((el) => el.id == id);
  },
  addBook: async (book) => {
    if (!get().getBook(book.id)) {
      set((state) => ({
        customBooks: [...state.customBooks, book],
      }));
      return true;
    }
    return false;
  },
  removeBook: async (id) => {
    const index = get().customBooks.findIndex((el) => el.id == id);
    if (index != -1) {
      set((state) => ({
        customBooks: [
          ...state.customBooks.slice(0, index),
          ...state.customBooks.slice(index + 1),
        ],
      }));
      return true;
    }
    return false;
  },
}));
