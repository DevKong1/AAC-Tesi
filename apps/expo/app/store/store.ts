import * as FileSystem from "expo-file-system";
import { create } from "zustand";

import { type Board, type Pictogram } from "../../src/types/commonTypes";

interface BoardsState {
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
  fetch: () => Promise<void>;
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

export const usePictoramStore = create<PictogramState>((set) => ({
  pictograms: [],
  loaded: false,
  fetch: async () => {
    console.log("Loading pictorams...");
    await import("../../assets/dictionaries/Dizionario_en.json")
      .then((res) => set({ pictograms: res.default as Pictogram[] }))
      .finally(() => {
        set({ loaded: true });
        console.log("Loaded pictograms");
      });
  },
}));
