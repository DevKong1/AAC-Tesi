import * as FileSystem from "expo-file-system";
import * as Speech from "expo-speech";
import { sleep } from "@tanstack/query-core/build/lib/utils";
import { create } from "zustand";

interface CompanionState {
  isVisible: boolean;
  currentMood: string;
  currentText: string;
  textSize: string;
  position: string;
  speak: (text: string, size?: string, position?: string) => Promise<void>;
}

export const useCompanionStore = create<CompanionState>((set, get) => ({
  isVisible: true,
  currentMood: "",
  currentText: "",
  textSize: "4xl",
  position: "left",
  speak: async (text, size?, position?) => {
    if (
      size &&
      ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"].includes(size)
    ) {
      set({ textSize: size });
    }
    if (position && ["top", "left"].includes(position)) {
      set({ position: position });
    }
    set({ currentText: text });
    Speech.speak(text, {
      language: "it-IT",
      // TODO Is this ok (?)
      onDone: (async () => {
        await sleep(1000);
        set({ currentText: "", textSize: "4xl", position: "left" });
        return;
      }) as () => void,
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
