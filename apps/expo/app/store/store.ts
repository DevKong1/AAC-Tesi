import { randomUUID } from "expo-crypto";
import * as FileSystem from "expo-file-system";
import * as Speech from "expo-speech";
import { sleep } from "@tanstack/query-core/build/lib/utils";
import { create } from "zustand";

import dictionary from "../../assets/dictionaries/Dizionario_it.json";
import { getIDsFromPictogramsMatrix } from "../utils/commonFunctions";
import pictograms from "../utils/pictograms";
import {
  type Book,
  type CustomPictogram,
  type DiaryPage,
  type Pictogram,
  type ReadingSettings,
} from "../utils/types/commonTypes";

const companionUri = `${FileSystem.documentDirectory}companion.json`;
const diaryUri = `${FileSystem.documentDirectory}diary.json`;
const pictogramUri = `${FileSystem.documentDirectory}pictograms.json`;
const booksUri = `${FileSystem.documentDirectory}books.json`;

/**
 * Saves given date to given path
 *
 * @param file - Path to the file
 * @param data - Data to save
 */
const saveToJSON = async (file: string, data: any) => {
  return await FileSystem.writeAsStringAsync(file, JSON.stringify(data));
};

/**
 * Checks if a JSON file exists, if not creates it with given data, otherwise reads it and returns Parsed data
 *
 * @param file - Path to the file
 * @param data - Data to save if the file doesnt exist
 * @returns - undefined if the file didnt exist, Parsed JSON data otherwise
 */
const getJSONOrCreate = async (file: string, data: any) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(file);
    if (!fileInfo.exists) {
      console.log(`${file}: File doesnt exist, creating...`);
      await saveToJSON(file, data);
    } else {
      const result = await FileSystem.readAsStringAsync(file);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(result);
    }
  } catch (e) {
    console.log("Storage: ERROR");
    return undefined;
  }
};

interface CompanionState {
  isVisible: boolean;
  currentText: string;
  position: string;
  bubblePosition: string;
  volumeOn: boolean;
  bubbleOn: boolean;
  load: () => Promise<void>;
  reset: () => void;
  speak: (
    text: string,
    bubblePosition?: string,
    onBoundary?: (e: any) => void,
  ) => Promise<void>;
  stopSpeak: () => void;
  changeVolume: () => Promise<void>;
  changeBubble: () => Promise<void>;
  setPosition: (newPosition: string) => void;
  setVisible: (value: boolean) => void;
}

type CompanionSettings = {
  volumeOn: boolean;
  bubbleOn: boolean;
};

export const useCompanionStore = create<CompanionState>((set, get) => ({
  isVisible: true,
  currentText: "",
  position: "default",
  bubblePosition: "left",
  volumeOn: true,
  bubbleOn: true,
  load: async () => {
    const result = (await getJSONOrCreate(companionUri, {
      volumeOn: get().volumeOn,
      bubbleOn: get().bubbleOn,
    })) as CompanionSettings;
    if (result) set({ volumeOn: result.volumeOn, bubbleOn: result.bubbleOn });
  },
  reset: () => {
    set({ currentText: "", bubblePosition: "left" });
  },
  stopSpeak: async () => {
    set({ currentText: "" });
    await Speech.stop();
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
    await saveToJSON(companionUri, {
      volumeOn: get().volumeOn,
      bubbleOn: get().bubbleOn,
    });
  },
  changeBubble: async () => {
    set({ bubbleOn: !get().bubbleOn });
    await saveToJSON(companionUri, {
      volumeOn: get().volumeOn,
      bubbleOn: get().bubbleOn,
    });
  },
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
  save: () => Promise<void>;
  getDiaryPage: (date: string) => DiaryPage | undefined;
  getPreviousPage: (date: string) => DiaryPage | undefined;
  getNextPage: (date: string) => DiaryPage | undefined;
  addPictogramsToPage: (
    date: string,
    pictograms: string[],
  ) => Promise<DiaryPage | undefined>;
  addDiaryPage: (page: DiaryPage) => Promise<boolean>;
  updatePictogramsInPage: (
    date: string,
    entryIndex: number,
    pictograms: string[],
  ) => Promise<boolean>;
  removeDiaryPage: (date: string) => Promise<boolean>;
  removePictogramFromPages: (pictogram: string) => Promise<void>; // Used when a custom pictogram is removed
}

export const useDiaryStore = create<DiaryState>((set, get) => ({
  diary: [],
  readingSettings: { rows: 3, columns: 4 } as ReadingSettings, // TODO Customizable
  load: async () => {
    const result = await getJSONOrCreate(diaryUri, []);
    if (result)
      set({
        diary: result,
      });
  },
  save: async () => {
    await saveToJSON(diaryUri, get().diary);
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
      await get().save();
      return true;
    } else return false;
  },
  addPictogramsToPage: async (date, pictograms) => {
    const pageIndex = get().diary.findIndex((el) => el.date == date);
    if (pageIndex != -1) {
      const newDiary = get().diary;
      newDiary[pageIndex]!.pictograms.push(pictograms);
      set({ diary: newDiary });
      await get().save();
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
      await get().save();
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
      await get().save();
      return true;
    } else return false;
  },
  removePictogramFromPages: async (toRemove) => {
    // Remove each occurency of given id
    get().diary.forEach((page) => {
      page.pictograms.forEach((row) => {
        let i = row.length;
        while (i--) {
          if (row[i] == toRemove) {
            row.splice(i, 1);
          }
        }
      });

      // Remove empty rows
      let i = page.pictograms.length;
      while (i--) {
        if (page.pictograms[i]!.length <= 0) {
          page.pictograms.splice(i, 1);
        }
      }
    });
    await get().save();
  },
}));

interface inputState {
  id: string | undefined;
  command: string | undefined;
  inputPictograms: string[] | undefined;
  requestCompleted: boolean;
  args: any | undefined;
  inputRequest: (id: string, command: string, args?: any) => void;
  setInput: (reqID: string, inputPictograms: string[]) => void;
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
  setInput: (reqID: string, inputPictograms: string[]) => {
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
  pictograms: Pictogram[];
  favourites: string[];
  customPictograms: CustomPictogram[];
  load: () => Promise<void>;
  save: () => Promise<void>;
  getPictogram: (id: string) => Pictogram | undefined;
  getPictograms: (ids: string[]) => Pictogram[];
  getTextFromPictogram: (pictogram: Pictogram) => string;
  getPictogramByText: (text: string) => Pictogram[];
  getFavouritePictograms: () => Pictogram[];
  getPictogramFromCustom: (
    customPictogram: CustomPictogram,
  ) => Pictogram | undefined;
  getCustomPictograms: () => Pictogram[];
  addFavourite: (id: string) => Promise<boolean>;
  removeFavourite: (id: string) => Promise<boolean>;
  addCustomPictogram: (
    oldId?: string,
    text?: string,
    image?: string,
  ) => Promise<boolean>;
  removeCustomPictogram: (id: string) => Promise<boolean>;
}

type SavedPictograms = {
  favourites: string[];
  customPictograms: CustomPictogram[];
};

export const usePictogramStore = create<PictogramState>((set, get) => ({
  pictograms: dictionary as Pictogram[],
  favourites: [],
  customPictograms: [],
  load: async () => {
    const result = (await getJSONOrCreate(pictogramUri, {
      favourites: [],
      customPictograms: [],
    } as SavedPictograms)) as SavedPictograms;
    if (result && result.favourites && result.customPictograms)
      set({
        favourites: result.favourites,
        customPictograms: result.customPictograms,
      });
  },
  save: async () => {
    await saveToJSON(pictogramUri, {
      favourites: get().favourites,
      customPictograms: get().customPictograms,
    } as SavedPictograms);
  },
  getPictogram: (id) => {
    const custom = get().customPictograms.find((el) => el._id == id);
    return custom
      ? get().getPictogramFromCustom(custom)
      : get().pictograms.find((el) => el._id == id);
  },
  getPictograms: (ids) => {
    const result = [] as Pictogram[];
    ids.forEach((id) => {
      const found = get().getPictogram(id);
      if (found) result.push(found);
    });
    return result;
  },
  getFavouritePictograms: () => {
    return get().getPictograms(get().favourites);
  },
  getPictogramByText: (text) => {
    const result = get().pictograms.filter((el) =>
      el.keywords?.find((key) => key.keyword.toLowerCase().includes(text)),
    );
    return get()
      .getCustomPictograms()
      .filter((el) => el.customPictogram?.text?.toLowerCase().includes(text))
      .concat(result);
  },
  getTextFromPictogram: (pictogram) => {
    if (pictogram.customPictogram?.text) return pictogram.customPictogram.text;
    if (pictogram.keywords[0]?.keyword) return pictogram.keywords[0].keyword;
    return "";
  },
  getPictogramFromCustom: (customPictogram) => {
    if (customPictogram.oldId) {
      const oldValue = get().pictograms.find(
        (el) => el._id == customPictogram.oldId,
      );
      return oldValue
        ? ({
            ...oldValue,
            customPictogram: customPictogram,
          } as Pictogram)
        : undefined;
    }
    return {
      _id: customPictogram._id,
      keywords: [],
      customPictogram: customPictogram,
    } as Pictogram;
  },
  getCustomPictograms: () => {
    return get()
      .customPictograms.flatMap((custom) =>
        get().getPictogramFromCustom(custom),
      )
      .filter((el) => el) as Pictogram[];
  },
  addFavourite: async (id) => {
    if (!get().favourites.find((el) => el == id)) {
      set((state) => ({ favourites: [...state.favourites, id] }));
      await get().save();
      return true;
    }
    return false;
  },
  removeFavourite: async (id) => {
    const index = get().favourites.findIndex((el) => el == id);
    if (index != -1) {
      set((state) => ({
        favourites: [
          ...state.favourites.slice(0, index),
          ...state.favourites.slice(index + 1),
        ],
      }));
      await get().save();
      return true;
    }
    return false;
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
    await get().save();
    return true;
  },
  removeCustomPictogram: async (id) => {
    const index = get().customPictograms.findIndex((el) => el._id == id);
    if (index != -1) {
      if (get().favourites.find((el) => el == id)) get().removeFavourite(id);
      useDiaryStore.getState().removePictogramFromPages(id);
      set((state) => ({
        customPictograms: [
          ...state.customPictograms.slice(0, index),
          ...state.customPictograms.slice(index + 1),
        ],
      }));
      await get().save();
      return true;
    }
    return false;
  },
}));

interface BookState {
  customBooks: Book[];
  readingSettings: ReadingSettings;
  load: () => Promise<void>;
  save: () => Promise<void>;
  getBook: (id: string) => Book | undefined;
  addBook: (book: Book) => Promise<boolean>;
  removeBook: (id: string) => Promise<boolean>;
}

export const useBookStore = create<BookState>((set, get) => ({
  customBooks: [],
  readingSettings: { rows: 3, columns: 4 } as ReadingSettings,
  load: async () => {
    const result = await getJSONOrCreate(booksUri, []);
    if (result)
      set({
        customBooks: result,
      });
  },
  save: async () => {
    await saveToJSON(booksUri, get().customBooks);
  },
  getBook: (id) => {
    return get().customBooks.find((el) => el.id == id);
  },
  addBook: async (book) => {
    if (!get().getBook(book.id)) {
      set((state) => ({
        customBooks: [...state.customBooks, book],
      }));
      await get().save();
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
      await get().save();
      return true;
    }
    return false;
  },
}));
