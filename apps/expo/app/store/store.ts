import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sleep } from "@tanstack/query-core/build/lib/utils";
import { create } from "zustand";

import {
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
  ) => DiaryPage | undefined;
  addDiaryPage: (page: DiaryPage) => boolean;
  updatePictogramsInPage: (
    date: string,
    entryIndex: number,
    pictograms: Pictogram[],
  ) => DiaryPage | undefined;
  /*
  removeDiaryPage: (date: Date) => Promise<void>; */
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
  addDiaryPage: (page) => {
    console.log(get().diary.length);
    if (!get().getDiaryPage(page.date)) {
      const newDiary = get().diary;
      newDiary.push(page);
      set({ diary: newDiary });
      console.log(get().diary.length);
      return true;
    } else return false;
  },
  addPictogramsToPage: (date, pictograms) => {
    const pageIndex = get().diary.findIndex((el) => el.date == date);
    if (pageIndex != -1) {
      const newDiary = get().diary;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      newDiary[pageIndex]!.pictograms.push(pictograms);
      set({ diary: newDiary });
      return get().getDiaryPage(date);
    } else return undefined;
  },
  updatePictogramsInPage: (date, entryIndex, pictograms) => {
    const pageIndex = get().diary.findIndex((el) => el.date == date);
    if (pageIndex != -1) {
      const newDiary = get().diary;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      newDiary[pageIndex]!.pictograms[entryIndex] = pictograms;
      set({ diary: newDiary });
      return get().getDiaryPage(date);
    } else return undefined;
  },
  /*
  removeDiaryPage: async () => {},
  updateDiaryPage: async () => {}, */
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

/* interface BoardsState {
  boards: Board[];
  loaded: boolean;
  fetch: () => Promise<void>;
  setBoards: (boards: Board[]) => void;
  clearBoards: () => void;
  addBoard: (board: Board) => void;
  removeBoard: (id: string) => void;
  updateBoard: (board: Board) => void;
}

interface PictogramState {
  pictograms: Pictogram[];
  loaded: boolean;
  setPictograms: (pictograms: Pictogram[]) => void;
  setLoaded: (boards: boolean) => void;
}

type configFile = {
  boards: Board[];
};

export const useBoardStore = create<BoardsState>((set) => ({
  boards: [],
  loaded: false,
  fetch: async () => {
    const filePath = (FileSystem.documentDirectory as string) + "userData.json";
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (!fileInfo.exists) {
      console.log("Creating Config file...");
      const data = { boards: [] };
      await FileSystem.writeAsStringAsync(filePath, JSON.stringify(data), {
        encoding: FileSystem.EncodingType.UTF8,
      });
      set({ loaded: true });
      console.log("Done");
    } else {
      console.log("Config file found...");
      const file = await FileSystem.readAsStringAsync(filePath);
      const parsed = JSON.parse(file) as configFile;
      set({ boards: parsed.boards });
      set({ loaded: true });
    }
  },
  setBoards: (boards) => set({ boards: boards }),
  clearBoards: () => set({ boards: [] }),
  addBoard: (board) => {
    set((state) => ({
      boards: [...state.boards, board],
    }));
  },
  removeBoard: (id) => {
    set((state) => ({
      boards: state.boards.filter((board) => board.id !== id),
    }));
  },
  updateBoard: (board) => {
    set((state) => ({
      boards: state.boards.map((el) => (el.id === board.id ? board : el)),
    }));
  },
}));
 */
