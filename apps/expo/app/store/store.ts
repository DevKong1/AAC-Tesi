import { randomUUID } from "expo-crypto";
import * as FileSystem from "expo-file-system";
import * as Speech from "expo-speech";
import { sleep } from "@tanstack/query-core/build/lib/utils";
import { create } from "zustand";

import { getPictogram, getPictograms } from "../hooks/pictogramsHandler";
import {
  getIDsFromPictogramsArray,
  getIDsFromPictogramsMatrix,
} from "../utils/commonFunctions";
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
    pictograms: Pictogram[],
  ) => Promise<DiaryPage | undefined>;
  addDiaryPage: (page: DiaryPage) => Promise<boolean>;
  updatePictogramsInPage: (
    date: string,
    entryIndex: number,
    pictograms: Pictogram[],
  ) => Promise<boolean>;
  removeDiaryPage: (date: string) => Promise<boolean>;
  removePictogramFromPages: (pictogram: string) => Promise<void>; // Used when a custom pictogram is removed
}

type SavedDiaryPage = {
  date: string;
  pictograms: string[][];
};

/**
 * Maps each pictogram in a DiaryPage array into a string containing the id
 *
 * @param diary - The diary to map
 */
const getDiaryForJSON = (diary: DiaryPage[]) => {
  return diary.map(
    ({ date, pictograms }) =>
      ({
        date: date,
        pictograms: getIDsFromPictogramsMatrix(pictograms),
      } as SavedDiaryPage),
  );
};

/**
 * Parses a saved diary, mapping all string ids into Pictogram Objects
 *
 * @param saved - The saved Diary
 * @param customPictograms - User defined pictograms
 * @returns - Diary in a DiaryPage[] format
 */
const parseSavedDiary = (
  saved: SavedDiaryPage[],
  customPictograms: Pictogram[],
) => {
  return saved.map(({ date, pictograms }) => ({
    date: date,
    pictograms: pictograms.map((row) => getPictograms(row, customPictograms)),
  })) as DiaryPage[];
};

export const useDiaryStore = create<DiaryState>((set, get) => ({
  diary: [],
  readingSettings: { rows: 3, columns: 4 } as ReadingSettings, // TODO Customizable
  load: async () => {
    const result = await getJSONOrCreate(diaryUri, []);
    if (result)
      set({
        diary: parseSavedDiary(
          result as SavedDiaryPage[],
          usePictogramStore.getState().getCustomPictograms(),
        ),
      });
  },
  save: async () => {
    await saveToJSON(diaryUri, getDiaryForJSON(get().diary));
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
          if (row[i]?._id == toRemove) {
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
  load: () => Promise<void>;
  save: () => Promise<void>;
  getFavouritePictograms: () => Pictogram[];
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

type SavedBook = {
  id: string;
  title: string;
  cover: string;
  pictograms: string[][];
};

/**
 * Maps each pictogram in a Book array into a string containing the id
 *
 * @param diary - The diary to map
 */
const getBooksForJSON = (books: Book[]) => {
  return books.map(
    ({ id, title, cover, pictograms }) =>
      ({
        id: id,
        title: title,
        cover: cover,
        pictograms: getIDsFromPictogramsMatrix(pictograms),
      } as SavedBook),
  );
};

/**
 * Parses a saved diary, mapping all string ids into Pictogram Objects
 *
 * @param saved - The saved Diary
 * @param customPictograms - User defined pictograms
 * @returns - Diary in a DiaryPage[] format
 */
const parseSavedBooks = (saved: SavedBook[], customPictograms: Pictogram[]) => {
  return saved.map(({ id, title, cover, pictograms }) => ({
    id: id,
    title: title,
    cover: cover,
    pictograms: pictograms.map((row) => getPictograms(row, customPictograms)),
    isCustom: true,
  })) as Book[];
};

export const useBookStore = create<BookState>((set, get) => ({
  customBooks: [],
  readingSettings: { rows: 3, columns: 4 } as ReadingSettings,
  load: async () => {
    const result = await getJSONOrCreate(booksUri, []);
    if (result)
      set({
        customBooks: parseSavedBooks(
          result as SavedBook[],
          usePictogramStore.getState().getCustomPictograms(),
        ),
      });
  },
  save: async () => {
    await saveToJSON(booksUri, getBooksForJSON(get().customBooks));
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
