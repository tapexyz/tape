import { LocalIDBStore } from "@tape.xyz/lens/custom-types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import createIdbStorage from "@/lib/createIdbStorage";

type Toggles = {
  suspended: boolean;
  limited: boolean;
};

interface State {
  toggles: Toggles;
  setToggles: (toggles: Toggles) => void;
}

const useProfileTogglesStore = create(
  persist<State>(
    (set) => ({
      toggles: { suspended: false, limited: false },
      setToggles: (toggles) => set({ toggles }),
    }),
    {
      name: LocalIDBStore.TOGGLES_STORE,
      storage: createIdbStorage(),
    },
  ),
);

export default useProfileTogglesStore;
