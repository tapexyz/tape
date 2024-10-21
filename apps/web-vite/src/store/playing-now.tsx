import type { PrimaryPublication } from "@tape.xyz/lens/gql";
import { create } from "zustand";

type State = {
  publication: PrimaryPublication | null;
  setPublication: (pub: PrimaryPublication | null) => void;
};

export const usePlayingNow = create<State>()((set) => ({
  publication: null,
  setPublication: (publication) => set({ publication })
}));
