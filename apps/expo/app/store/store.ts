import { create } from "zustand";

import { type Board } from "../../src/types/commonTypes";

interface BoardsState {
  boards: Board[];
  setBoards: (boards: Board[]) => void;
  clearBoards: () => void;
  addBoard: (board: Board) => void;
  removeBoard: (id: string) => void;
  updateBoard: (board: Board) => void;
}

export const useBoardStore = create<BoardsState>((set) => ({
  boards: [] as Board[],
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
