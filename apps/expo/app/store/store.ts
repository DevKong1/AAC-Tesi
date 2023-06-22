import { randomUUID } from "expo-crypto";
import * as FileSystem from "expo-file-system";
import * as Speech from "expo-speech";
import { sleep } from "@tanstack/query-core/build/lib/utils";
import { create } from "zustand";

import dictionary from "../../assets/dictionaries/Dizionario_it.json";
import { getJSONOrCreate, saveToJSON } from "../hooks/useStorage";
import { allCategories, baseCategories } from "../utils/categories";
import { sortBySimilarity } from "../utils/commonFunctions";
import {
  CategoryType,
  type Book,
  type CustomPictogram,
  type DiaryPage,
  type Pictogram,
  type ReadingSettings,
} from "../utils/types/commonTypes";

const diaryUri = `${FileSystem.documentDirectory}diary.json`;
const pictogramUri = `${FileSystem.documentDirectory}pictograms.json`;
const booksUri = `${FileSystem.documentDirectory}books.json`;
const categoriesUri = `${FileSystem.documentDirectory}categories.json`;

interface CompanionState {
  isVisible: boolean;
  currentText: string;
  position: string;
  bubblePosition: string;
  volumeOn: boolean;
  bubbleOn: boolean;
  speak: (
    text: string,
    bubblePosition?: string,
    onBoundary?: (e: any) => void,
    onDone?: () => void,
  ) => Promise<void>;
  resume: () => void;
  pause: () => void;
  resetSpeech: () => Promise<void>;
  changeVolume: () => Promise<void>;
  changeBubble: () => void;
  setPosition: (newPosition: string) => void;
  setVisible: (value: boolean) => void;
  hideAll: () => void;
  showAll: () => void;
}

export const useCompanionStore = create<CompanionState>((set, get) => ({
  isVisible: true,
  currentText: "",
  position: "default",
  bubblePosition: "left",
  volumeOn: true,
  bubbleOn: true,
  resetSpeech: async () => {
    set({ currentText: "" });
    await Speech.stop();
  },
  speak: async (text, bubblePosition?, onBoundary?, onDone?) => {
    if (bubblePosition && ["top", "left"].includes(bubblePosition)) {
      set({ bubblePosition: bubblePosition });
    }
    await Speech.stop();
    set({ currentText: text });
    // Just show bubble if no volume
    if (!get().volumeOn) {
      await sleep(5000);
      set({ currentText: "", bubblePosition: "left" });
    } else {
      Speech.speak(text, {
        rate: 0.9,
        language: "it-IT",
        // TODO Is this ok (?)
        onDone: onDone
          ? onDone
          : ((async () => {
              await sleep(1000);
              // We dont want to reset another text
              if (!(await Speech.isSpeakingAsync()))
                set({ currentText: "", bubblePosition: "left" });
              return;
            }) as () => void),
        onBoundary: onBoundary,
      });
    }
  },
  pause: async () => {
    await Speech.pause();
  },
  resume: async () => {
    await Speech.resume();
  },
  changeVolume: async () => {
    await Speech.stop();
    set({ currentText: "", volumeOn: !get().volumeOn });
  },
  changeBubble: () => {
    set({ bubbleOn: !get().bubbleOn });
  },
  setPosition: (newPosition) => {
    ["default", "center"].includes(newPosition)
      ? set({ position: newPosition })
      : null;
  },
  setVisible: (value) => set({ isVisible: value }),
  hideAll: () => set({ isVisible: false, bubbleOn: false }),
  showAll: () => set({ isVisible: true, bubbleOn: true }),
}));

interface DiaryState {
  diary: DiaryPage[];
  readingSettings: ReadingSettings;
  load: () => Promise<void>;
  save: () => Promise<void>;
  getDiaryPage: (date: string) => DiaryPage | undefined;
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
  readingSettings: { rows: 3, columns: 5 } as ReadingSettings, // TODO Customizable
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
      // If the page is empty we remove it
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
  getTextFromPictogram: (pictogram: Pictogram) => string | undefined;
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
    tags?: string[],
  ) => Promise<boolean>;
  removeCustomPictogram: (id: string) => Promise<boolean>;
}

type SavedPictograms = {
  favourites: string[];
  customPictograms: CustomPictogram[];
};

const getPictogramsWithColor = (pictograms: Pictogram[]) => {
  const mapped = pictograms.map((el) => {
    return {
      ...el,
      categoryColor: useCategoryStore
        .getState()
        .allCategories.find((category) =>
          el.tags?.includes(category.textARASAAC),
        )?.color,
    } as Pictogram;
  });
  return mapped;
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
    if (result && result.favourites && result.customPictograms) {
      set({
        favourites: result.favourites,
        customPictograms: result.customPictograms,
      });
      result.customPictograms.forEach((customPictogram) => {
        if (customPictogram.oldId)
          set((state) => ({
            pictograms: state.pictograms.map((pictogram) =>
              pictogram._id == customPictogram.oldId
                ? { ...pictogram, customPictogram: customPictogram }
                : pictogram,
            ),
          }));
      });
    }
  },
  save: async () => {
    await saveToJSON(pictogramUri, {
      favourites: get().favourites,
      customPictograms: get().customPictograms,
    } as SavedPictograms);
  },
  getPictogram: (id) => {
    const custom = get().customPictograms.find((el) => el._id == id);
    const result = custom
      ? get().getPictogramFromCustom(custom)
      : get().pictograms.find((el) => el._id == id);
    return result ? getPictogramsWithColor([result])[0] : undefined;
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
    let result = get().pictograms.filter((el) =>
      el.keywords?.find((key) => key.keyword.toLowerCase().includes(text)),
    );
    result = sortBySimilarity(result, text);
    const mapped = getPictogramsWithColor(
      get()
        .getCustomPictograms()
        .filter((el) => el.customPictogram?.text?.toLowerCase().includes(text))
        .concat(result),
    );
    return mapped ? mapped : [];
  },
  getTextFromPictogram: (pictogram) => {
    if (pictogram.customPictogram?.text) return pictogram.customPictogram.text;
    else if (pictogram.keywords[0]?.keyword)
      return pictogram.keywords[0]?.keyword;
    return undefined;
  },
  getPictogramFromCustom: (customPictogram) => {
    if (!customPictogram) return undefined;
    if (customPictogram.oldId) {
      const oldValue = get().pictograms.find(
        (el) => el._id == customPictogram.oldId,
      );
      return oldValue
        ? ({
            ...getPictogramsWithColor([oldValue])[0],
            customPictogram: customPictogram,
          } as Pictogram)
        : undefined;
    }
    return {
      _id: customPictogram._id,
      keywords: [],
      customPictogram: customPictogram,
      tags: customPictogram.tags,
      categoryColor: useCategoryStore
        .getState()
        .allCategories.find((el) =>
          customPictogram.tags?.includes(el.textARASAAC),
        )?.color,
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
  addCustomPictogram: async (oldId?, text?, image?, tags?) => {
    // Only one customization per existing pictogram allowed
    if (oldId) {
      const oldPictogram = get().pictograms.find((el) => el._id == oldId);
      if (oldPictogram?.customPictogram) return false;
    }
    const id = randomUUID();
    const newCustomPictogram = {
      _id: id,
      oldId: oldId,
      text: text,
      image: image,
      tags: tags,
    } as CustomPictogram;
    set((state) => ({
      customPictograms: [...state.customPictograms, newCustomPictogram],
    }));
    if (oldId)
      set((state) => ({
        pictograms: state.pictograms.map((pictogram) =>
          pictogram._id == oldId
            ? { ...pictogram, customPictogram: newCustomPictogram }
            : pictogram,
        ),
      }));
    await get().save();
    return true;
  },
  removeCustomPictogram: async (id) => {
    const index = get().customPictograms.findIndex((el) => el._id == id);
    if (index != -1) {
      const customPictogram = get().customPictograms[index]!;
      // If it was also a favorite remove
      if (get().favourites.find((el) => el == id)) get().removeFavourite(id);
      // If it was a new pictogram also remove all references, otherwise swap it back to the normal one
      if (customPictogram.oldId) {
        set((state) => ({
          pictograms: state.pictograms.map((pictogram) =>
            pictogram._id == customPictogram.oldId
              ? { ...pictogram, customPictogram: undefined }
              : pictogram,
          ),
        }));
      } else useDiaryStore.getState().removePictogramFromPages(id);
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
  readingSettings: { rows: 2, columns: 4 } as ReadingSettings,
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

interface CategoryState {
  currentCategories: CategoryType[];
  defaultCategory: string | undefined;
  maxCategories: number;
  allCategories: CategoryType[];
  load: () => Promise<void>;
  save: () => Promise<void>;
  addCategory: (toAdd: string) => Promise<void>;
  removeCategory: (toRemove: string) => Promise<void>;
  setDefault: (text?: string) => Promise<void>;
}

type SavedCategories = {
  defaultCategory: string;
  current: string[];
};

export const useCategoryStore = create<CategoryState>((set, get) => ({
  defaultCategory: undefined,
  allCategories: allCategories,
  currentCategories: baseCategories
    .map((text) => allCategories.find((el) => el.textARASAAC == text))
    .filter((el) => el) as CategoryType[],
  maxCategories: 6,
  load: async () => {
    const result = (await getJSONOrCreate(
      categoriesUri,
      baseCategories,
    )) as SavedCategories;
    if (result) {
      set({
        defaultCategory: result.defaultCategory,
        currentCategories: result.current
          .map((savedARASAAC) =>
            get().allCategories.find((el) => el.textARASAAC == savedARASAAC),
          )
          .filter((el) => el) as CategoryType[],
      });
    }
  },
  save: async () => {
    await saveToJSON(categoriesUri, {
      defaultCategory: get().defaultCategory,
      current: get().currentCategories.map((el) => el.textARASAAC),
    } as SavedCategories);
  },
  addCategory: async (toAdd) => {
    const category = get().allCategories.find((el) => el.textARASAAC === toAdd);
    if (
      !category ||
      get().currentCategories.length >= get().maxCategories ||
      get().currentCategories.find((el) => el.textARASAAC == toAdd)
    )
      return;
    set((state) => ({
      currentCategories: [...state.currentCategories, category],
    }));
    await get().save();
  },
  removeCategory: async (toRemove) => {
    const index = get().currentCategories.findIndex(
      (el) => el.textARASAAC === toRemove,
    );
    if (index === -1 || get().currentCategories.length <= 1) return;
    set((state) => ({
      currentCategories: [
        ...state.currentCategories.slice(0, index),
        ...state.currentCategories.slice(index + 1),
      ],
    }));
    await get().save();
  },
  setDefault: async (text) => {
    if (!text) {
      set({ defaultCategory: undefined });
      await get().save();
      return;
    }
    const index = get().allCategories.findIndex(
      (el) => el.textARASAAC === text,
    );
    if (index === -1) return;
    set({ defaultCategory: get().allCategories[index]!.textARASAAC });
    await get().save();
  },
}));

/* import { randomUUID } from "expo-crypto";
import * as FileSystem from "expo-file-system";
import * as Speech from "expo-speech";
import { sleep } from "@tanstack/query-core/build/lib/utils";
import { create } from "zustand";

import dictionary from "../../assets/dictionaries/Dizionario_it.json";
import { deleteDiaryPage, postDiaryPage } from "../hooks/useBackend";
import { getJSONOrCreate, saveToJSON } from "../hooks/useStorage";
import { sortBySimilarity } from "../utils/commonFunctions";
import {
  type Book,
  type CustomPictogram,
  type DiaryPage,
  type Pictogram,
  type ReadingSettings,
} from "../utils/types/commonTypes";

const companionUri = `${FileSystem.documentDirectory}companion.json`;

interface ApiState {
  loaded: boolean;
  setLoaded: (value: boolean) => void;
}

export const useApiStore = create<ApiState>((set) => ({
  loaded: false,
  setLoaded: (value) => {
    set({ loaded: value });
  },
}));

interface CompanionState {
  isVisible: boolean;
  currentText: string;
  position: string;
  bubblePosition: string;
  volumeOn: boolean;
  bubbleOn: boolean;
  started: boolean;
  start: () => void;
  stop: () => void;
  load: () => Promise<void>;
  speak: (
    text: string,
    bubblePosition?: string,
    onBoundary?: (e: any) => void,
    onDone?: () => void,
  ) => Promise<void>;
  resetSpeech: () => Promise<void>;
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
  volumeOn: false,
  bubbleOn: false,
  started: false,
  start: () => {
    set({ started: true, isVisible: true, volumeOn: true, bubbleOn: true });
  },
  stop: () => {
    set({ started: false, isVisible: false, volumeOn: false, bubbleOn: false });
  },
  load: async () => {
    const result = (await getJSONOrCreate(companionUri, {
      volumeOn: get().volumeOn,
      bubbleOn: get().bubbleOn,
    })) as CompanionSettings;
    if (result) set({ volumeOn: result.volumeOn, bubbleOn: result.bubbleOn });
  },
  resetSpeech: async () => {
    await Speech.stop();
    set({ currentText: "" });
  },
  speak: async (text, bubblePosition?, onBoundary?, onDone?) => {
    if (!get().isVisible) return;

    if (bubblePosition && ["top", "left"].includes(bubblePosition)) {
      set({ bubblePosition: bubblePosition });
    }
    await Speech.stop();
    set({ currentText: text });
    // Just show bubble if no volume
    if (!get().volumeOn) {
      await sleep(5000);
      set({ currentText: "", bubblePosition: "left" });
    } else {
      Speech.speak(text, {
        rate: 0.9,
        language: "it-IT",
        // TODO Is this ok (?)
        onDone: onDone
          ? onDone
          : ((async () => {
              await sleep(1000);
              // We dont want to reset another text
              if (!(await Speech.isSpeakingAsync()))
                set({ currentText: "", bubblePosition: "left" });
              return;
            }) as () => void),
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
  load: (data: DiaryPage[]) => void;
  getDiaryPage: (date: string) => DiaryPage | undefined;
  addDiaryPage: (token: string, page: DiaryPage) => Promise<boolean>;
  addPictogramsToPage: (
    token: string,
    date: string,
    pictograms: string[],
  ) => Promise<DiaryPage | undefined>;
  updatePictogramsInPage: (
    token: string,
    date: string,
    entryIndex: number,
    pictograms: string[],
  ) => Promise<boolean>;
  removeDiaryPage: (token: string, date: string) => Promise<boolean>;
  removePictogramFromPages: (token: string, pictogram: string) => Promise<void>; // Used when a custom pictogram is removed
}

export const useDiaryStore = create<DiaryState>((set, get) => ({
  diary: [],
  readingSettings: { rows: 3, columns: 4 } as ReadingSettings,
  load: (data: DiaryPage[]) => {
    set({
      diary: data,
    });
  },
  getDiaryPage: (date) => {
    return get().diary.find((el) => el.date == date);
  },
  addDiaryPage: async (token, page) => {
    if (!get().getDiaryPage(page.date)) {
      const res = await postDiaryPage(token, page);
      if (res) {
        set((state) => ({ diary: [...state.diary, page] }));
        return true;
      }
    }
    return false;
  },
  addPictogramsToPage: async (token, date, pictograms) => {
    const pageIndex = get().diary.findIndex((el) => el.date == date);
    if (pageIndex != -1) {
      const diary = get().diary;
      const res = await postDiaryPage(token, {
        date: date,
        pictograms: diary[pageIndex]!.pictograms.concat([pictograms]),
      } as DiaryPage);
      if (!res) return undefined;
      diary[pageIndex]!.pictograms.push(pictograms);
      return get().getDiaryPage(date);
    } else return undefined;
  },
  updatePictogramsInPage: async (token, date, entryIndex, pictograms) => {
    const pageIndex = get().diary.findIndex((el) => el.date == date);
    if (pageIndex != -1) {
      const diary = get().diary;

      const pageCopy = { ...diary[pageIndex]! };
      // Check if we are updating or removing
      if (pictograms.length > 0) pageCopy.pictograms[entryIndex] = pictograms;
      else pageCopy.pictograms.splice(entryIndex, 1);

      const res = await postDiaryPage(token, {
        date: date,
        pictograms: pageCopy.pictograms,
      } as DiaryPage);
      if (!res) return false;

      console.log(diary[pageIndex]);
      diary[pageIndex] = pageCopy; 
      console.log(diary[pageIndex]);

      // If the page is empty we remove it
      if (pageCopy.pictograms.length <= 0)
        return get().removeDiaryPage(token, date);

      return true;
    } else return false;
  },
  removeDiaryPage: async (token, date) => {
    const pageIndex = get().diary.findIndex((el) => el.date == date);
    if (pageIndex != -1) {
      const res = await deleteDiaryPage(token, date);
      if (!res) return false;
      set((state) => ({
        diary: [
          ...state.diary.slice(0, pageIndex),
          ...state.diary.slice(pageIndex + 1),
        ],
      }));
      return true;
    } else return false;
  },
  removePictogramFromPages: async (token, toRemove) => {
    // Remove each occurency of given id
    get().diary.forEach(async (page, pageI) => {
      const pageCopy = { ...page };
      let found = false;
      page.pictograms.forEach((row, rowI) => {
        const pictogramsCopy = [...row];
        let i = pictogramsCopy.length;
        while (i--) {
          if (pictogramsCopy[i] == toRemove) {
            found = true;
            pictogramsCopy.splice(i, 1);
          }
        }
        pageCopy.pictograms[rowI] = pictogramsCopy;
      });

      // Remove empty rows
      let i = page.pictograms.length;
      while (i--) {
        if (page.pictograms[i]!.length <= 0) {
          pageCopy.pictograms.splice(i, 1);
        }
      }
      if (found) {
        const res = await postDiaryPage(token, {
          date: page.date,
          pictograms: pageCopy.pictograms,
        } as DiaryPage);
        if (!res) return;
        get().diary[pageI] = pageCopy;
      }
    });
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
  getTextFromPictogram: (pictogram: Pictogram) => string | undefined;
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
    const result = (await getJSONOrCreate("", {
      favourites: [],
      customPictograms: [],
    } as SavedPictograms)) as SavedPictograms;
    if (result && result.favourites && result.customPictograms) {
      set({
        favourites: result.favourites,
        customPictograms: result.customPictograms,
      });
      result.customPictograms.forEach((customPictogram) => {
        if (customPictogram.oldId)
          set((state) => ({
            pictograms: state.pictograms.map((pictogram) =>
              pictogram._id == customPictogram.oldId
                ? { ...pictogram, customPictogram: customPictogram }
                : pictogram,
            ),
          }));
      });
    }
  },
  save: async () => {
    await saveToJSON("pictogramUri", {
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
    let result = get().pictograms.filter((el) =>
      el.keywords?.find((key) => key.keyword.toLowerCase().includes(text)),
    );
    result = sortBySimilarity(result, text);
    return get()
      .getCustomPictograms()
      .filter((el) => el.customPictogram?.text?.toLowerCase().includes(text))
      .concat(result);
  },
  getTextFromPictogram: (pictogram) => {
    if (pictogram.customPictogram?.text) return pictogram.customPictogram.text;
    else if (pictogram.keywords[0]?.keyword)
      return pictogram.keywords[0]?.keyword;
    return undefined;
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
    // Only one customization per existing pictogram allowed
    if (oldId) {
      const oldPictogram = get().pictograms.find((el) => el._id == oldId);
      if (oldPictogram?.customPictogram) return false;
    }
    const id = randomUUID();
    const newCustomPictogram = {
      _id: id,
      oldId: oldId,
      text: text,
      image: image,
    } as CustomPictogram;
    set((state) => ({
      customPictograms: [...state.customPictograms, newCustomPictogram],
    }));
    if (oldId)
      set((state) => ({
        pictograms: state.pictograms.map((pictogram) =>
          pictogram._id == oldId
            ? { ...pictogram, customPictogram: newCustomPictogram }
            : pictogram,
        ),
      }));
    await get().save();
    return true;
  },
  removeCustomPictogram: async (id) => {
    const index = get().customPictograms.findIndex((el) => el._id == id);
    if (index != -1) {
      const customPictogram = get().customPictograms[index]!;
      // If it was also a favorite remove
      if (get().favourites.find((el) => el == id)) get().removeFavourite(id);
      // If it was a new pictogram also remove all references, otherwise swap it back to the normal one
      if (customPictogram.oldId) {
        set((state) => ({
          pictograms: state.pictograms.map((pictogram) =>
            pictogram._id == customPictogram.oldId
              ? { ...pictogram, customPictogram: undefined }
              : pictogram,
          ),
        }));
      } else useDiaryStore.getState().removePictogramFromPages(id);
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
    const result = await getJSONOrCreate("booksUri", []);
    if (result)
      set({
        customBooks: result,
      });
  },
  save: async () => {
    await saveToJSON("booksUri", get().customBooks);
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
 */
