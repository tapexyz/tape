import type { CollectModuleType } from "@tape.xyz/lens/custom-types";
import { LocalIDBStore } from "@tape.xyz/lens/custom-types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import createIdbStorage from "@/lib/createIdbStorage";

interface State {
  collectModule: CollectModuleType | null;
  setCollectModule: (collectModule: CollectModuleType | null) => void;
  saveAsDefault: boolean;
  setSaveAsDefault: (saveAsDefault: boolean) => void;
}

const useCollectStore = create(
  persist<State>(
    (set) => ({
      collectModule: null,
      setCollectModule: (collectModule) => set({ collectModule }),
      saveAsDefault: true,
      setSaveAsDefault: (saveAsDefault) => set({ saveAsDefault }),
    }),
    {
      name: LocalIDBStore.COLLECT_STORE,
      storage: createIdbStorage(),
    },
  ),
);

export default useCollectStore;
