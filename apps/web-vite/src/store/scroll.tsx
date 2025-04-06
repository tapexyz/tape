import type { RefObject } from "react";
import { create } from "zustand";

interface ScrollState {
  scrollRef: RefObject<HTMLDivElement> | null;
  setScrollRef: (ref: RefObject<HTMLDivElement>) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  scrollRef: null,
  setScrollRef: (ref) => set({ scrollRef: ref })
}));
