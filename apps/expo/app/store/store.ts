import * as FileSystem from "expo-file-system";
import { create } from "zustand";

import { type Board } from "../../src/types/commonTypes";

interface BoardsState {
  boards: Board[];
  fetch: () => Promise<any>;
  setBoards: (boards: Board[]) => void;
  clearBoards: () => void;
  addBoard: (board: Board) => void;
  removeBoard: (id: string) => void;
  updateBoard: (board: Board) => void;
}

export const useBoardStore = create<BoardsState>((set) => ({
  boards: [] as Board[],
  fetch: async () => {
    const filePath = FileSystem.documentDirectory + "userData.json";
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (!fileInfo.exists) {
      console.log("Creating Config file...");
      const data = { boards: [] };
      await FileSystem.writeAsStringAsync(filePath, JSON.stringify(data), {
        encoding: FileSystem.EncodingType.UTF8,
      });
      console.log("Done");
    } else {
      const file = await FileSystem.readAsStringAsync(filePath);
      console.log(JSON.parse(file));
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
