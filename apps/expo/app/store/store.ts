import { randomUUID } from "expo-crypto";
import * as FileSystem from "expo-file-system";
import * as Speech from "expo-speech";
import { sleep } from "@tanstack/query-core/build/lib/utils";
import { create } from "zustand";

import dictionary from "../../assets/dictionaries/Dizionario_it.json";
import { postDiaryPage, setBackendFavourites } from "../hooks/useBackend";
import { getJSONOrCreate, saveToJSON } from "../hooks/useStorage";
import { allCategories, baseCategories } from "../utils/categories";
import { sortBySimilarity } from "../utils/commonFunctions";
import { BackendDiaryPage } from "../utils/types/backendTypes";
import {
  type Book,
  type CategoryType,
  type CustomPictogram,
  type DiaryPage,
  type Pictogram,
  type ReadingSettings,
} from "../utils/types/commonTypes";

const diaryUri = `${FileSystem.documentDirectory}diary.json`;
const pictogramUri = `${FileSystem.documentDirectory}pictograms.json`;
const booksUri = `${FileSystem.documentDirectory}books.json`;
const categoriesUri = `${FileSystem.documentDirectory}categories.json`;

interface BackendState {
  loaded: boolean;
  setLoaded: (value: boolean) => void;
}

export const useBackend = create<BackendState>((set, get) => ({
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
  speak: (
    text: string,
    bubblePosition?: string,
    onBoundary?: (e: any) => void, // Define some code to execute at each space
    onDone?: () => void, // Define some code to execute when the reading is odne
  ) => Promise<void>;
  resume: () => void;
  pause: () => void;
  resetSpeech: () => Promise<void>; // Stop reading and reset all variable to default
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
  parseBackendDiary: (backendValues: BackendDiaryPage[]) => void;
  save: () => Promise<void>;
  getDiaryPage: (date: string) => DiaryPage | undefined;
  addPictogramsToPage: (
    token: string,
    date: string,
    pictograms: string[],
  ) => Promise<DiaryPage | undefined>;
  addDiaryPage: (
    token: string,
    page: DiaryPage,
  ) => Promise<DiaryPage | undefined>;
  updatePictogramsInPage: (
    token: string,
    date: string,
    entryIndex: number,
    pictograms: string[],
  ) => Promise<DiaryPage | undefined>;
  removeDiaryPage: (date: string) => Promise<boolean>;
  removePictogramFromPages: (pictogram: string) => Promise<void>; // Used when a custom pictogram is removed
}

export const useDiaryStore = create<DiaryState>((set, get) => ({
  diary: [],
  readingSettings: { rows: 3, columns: 5 } as ReadingSettings, // TODO Customizable
  parseBackendDiary: (backendValues) => {
    const newDiary = backendValues.map((el) => {
      return {
        date: el.date,
        pictograms: JSON.parse(el.pictograms),
      } as DiaryPage;
    });
    set({ diary: newDiary });
  },
  save: async () => {
    await saveToJSON(diaryUri, get().diary);
  },
  getDiaryPage: (date) => {
    return get().diary.find((el) => el.date == date);
  },
  addDiaryPage: async (token, page) => {
    if (!get().getDiaryPage(page.date)) {
      const result = await postDiaryPage(token, page);
      if (result) {
        set((state) => ({
          diary: [...state.diary, page],
        }));
        return page;
      }
    }
    return undefined;
  },
  addPictogramsToPage: async (token, date, pictograms) => {
    const pageIndex = get().diary.findIndex((el) => el.date == date);
    if (pageIndex != -1) {
      const oldPictograms = get().diary[pageIndex]!.pictograms.slice();
      const newPage = {
        date: date,
        pictograms: oldPictograms.concat([pictograms]),
      } as DiaryPage;
      const result = await postDiaryPage(token, newPage);
      if (result) {
        const newDiary = get().diary.slice(); // copy diary
        newDiary[pageIndex] = newPage;
        set({ diary: newDiary });
        return newPage;
      }
    }
    return undefined;
  },
  updatePictogramsInPage: async (token, date, entryIndex, pictograms) => {
    const pageIndex = get().diary.findIndex((el) => el.date == date);
    if (pageIndex != -1) {
      const diaryCopy = get().diary.slice();
      const pagePictograms = diaryCopy[pageIndex]!.pictograms;
      if (pictograms.length > 0) pagePictograms[entryIndex] = pictograms;
      // if the entry would be empty remove it
      else pagePictograms.splice(entryIndex, 1);
      if (pagePictograms.length > 0) {
        const newPage = {
          date: date,
          pictograms: pagePictograms,
        } as DiaryPage;
        const result = await postDiaryPage(token, newPage);
        if (result) {
          set({ diary: diaryCopy });
          return newPage;
        }
      }
      // If the page is empty remove it
      else {
        get().removeDiaryPage(date);
      }
    }
    return undefined;
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
  args: any;
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
  showAdjectives: boolean;
  showColors: boolean;
  bigMode: boolean;
  load: () => Promise<void>;
  save: () => Promise<void>;
  setBigMode: (value: boolean) => Promise<void>;
  setShowAdjectives: (value: boolean) => Promise<void>;
  setShowColors: (value: boolean) => Promise<void>;
  getPictogram: (id: string) => Pictogram | undefined;
  getPictograms: (ids: string[]) => Pictogram[];
  getTextFromPictogram: (pictogram: Pictogram) => string | undefined;
  getPictogramByText: (text: string) => Pictogram[];
  getFavouritePictograms: () => Pictogram[];
  getPictogramFromCustom: (
    customPictogram: CustomPictogram,
  ) => Pictogram | undefined;
  getCustomPictograms: () => Pictogram[];
  setFavourites: (value: string[]) => void;
  addFavourite: (token: string, id: string) => Promise<boolean>;
  removeFavourite: (id: string) => Promise<boolean>;
  addCustomPictogram: (
    oldId?: string,
    text?: string,
    image?: string,
    tags?: string[],
    color?: string,
  ) => Promise<boolean>;
  removeCustomPictogram: (id: string) => Promise<boolean>;
}

type SavedPictograms = {
  customPictograms: CustomPictogram[];
  showAdjectives: boolean;
  showColors: boolean;
  bigMode: boolean;
};

export const usePictogramStore = create<PictogramState>((set, get) => ({
  pictograms: dictionary as Pictogram[],
  favourites: [],
  customPictograms: [],
  showAdjectives: false,
  showColors: false,
  bigMode: false,
  load: async () => {
    const result = (await getJSONOrCreate(pictogramUri, {
      customPictograms: [],
      showAdjectives: false,
      showColors: false,
      bigMode: false,
    } as SavedPictograms)) as SavedPictograms;
    if (result && result.customPictograms) {
      set({
        customPictograms: result.customPictograms,
        showAdjectives: result.showAdjectives,
        showColors: result.showColors,
        bigMode: result.bigMode,
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
      customPictograms: get().customPictograms,
      showAdjectives: get().showAdjectives,
      showColors: get().showColors,
      bigMode: get().bigMode,
    } as SavedPictograms);
  },
  setBigMode: async (value: boolean) => {
    set({ bigMode: value });
    await get().save();
  },
  setShowAdjectives: async (value: boolean) => {
    set({ showAdjectives: value });
    await get().save();
  },
  setShowColors: async (value: boolean) => {
    set({ showColors: value });
    await get().save();
  },
  getPictogram: (id) => {
    const custom = get().customPictograms.find((el) => el._id == id);
    const result = custom
      ? get().getPictogramFromCustom(custom)
      : get().pictograms.find((el) => el._id == id);
    return result ? result : undefined;
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
    const mapped = get()
      .getCustomPictograms()
      .filter((el) => el.customPictogram?.text?.toLowerCase().includes(text))
      .concat(result);
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
            ...oldValue,
            customPictogram: customPictogram,
          } as Pictogram)
        : undefined;
    }
    return {
      _id: customPictogram._id,
      keywords: [],
      customPictogram: customPictogram,
      tags: customPictogram.tags,
    } as Pictogram;
  },
  getCustomPictograms: () => {
    return get()
      .customPictograms.flatMap((custom) =>
        get().getPictogramFromCustom(custom),
      )
      .filter((el) => el) as Pictogram[];
  },
  setFavourites: (value) => {
    set({ favourites: value });
  },
  addFavourite: async (token, id) => {
    if (!get().favourites.find((el) => el == id)) {
      const newFavourites = [...get().favourites, id];
      const result = await setBackendFavourites(
        token,
        JSON.stringify(newFavourites),
      );
      if (result) {
        const dbFavourites = JSON.parse(result.favourites);
        get().setFavourites(dbFavourites);
        return true;
      }
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
  addCustomPictogram: async (oldId?, text?, image?, tags?, color?) => {
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
      color: color,
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
  allCategories: CategoryType[];
  load: () => Promise<void>;
  save: () => Promise<void>;
  addCategory: (toAdd: string) => Promise<void>;
  removeCategory: (toRemove: string) => Promise<void>;
  getCategoryColor: (pictogram: Pictogram) => string | undefined;
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
  getCategoryColor: (pictogram) => {
    const color = allCategories.find((category) =>
      pictogram.tags?.includes(category.textARASAAC),
    );
    return color?.color;
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
