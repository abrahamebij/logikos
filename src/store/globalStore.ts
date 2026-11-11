import { create } from "zustand";

export type ScriptureSelection = {
  book: string;
  chapter: number;
  verse: number;
  text: string;
};

type GlobalState = {
  selectedScripture: ScriptureSelection | null;
  liveOutput: ScriptureSelection | null;
  aiOutput: ScriptureSelection | null;
  transcript: string[];
  setSelectedScripture: (scripture: ScriptureSelection | null) => void;
  setLiveOutput: (scripture: ScriptureSelection | null) => void;
  setAiOutput: (scripture: ScriptureSelection | null) => void;
  appendTranscript: (text: string) => void;
};

export const useGlobalStore = create<GlobalState>((set) => ({
  selectedScripture: null,
  liveOutput: null,
  aiOutput: null,
  transcript: [],
  setSelectedScripture: (selectedScripture) => set({ selectedScripture }),
  setLiveOutput: (liveOutput) => set({ liveOutput }),
  setAiOutput: (aiOutput) => set({ aiOutput }),
  appendTranscript: (text) =>
    set((state) => ({ transcript: [...state.transcript, text] })),
}));