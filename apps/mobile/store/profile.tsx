import type { Profile } from "@tape.xyz/lens/gql";
import { create } from "zustand";

type State = {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
};

export const useActiveProfile = create<State>()((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile })
}));
