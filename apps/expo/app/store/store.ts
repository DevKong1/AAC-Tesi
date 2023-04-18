import * as FileSystem from "expo-file-system";
import * as Speech from "expo-speech";
import { sleep } from "@tanstack/query-core/build/lib/utils";
import { create } from "zustand";

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
    ["default", "gamesPage"].includes(newPosition)
      ? set({ position: newPosition })
      : null;
  },
  setVisible: (value) => set({ isVisible: value }),
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
