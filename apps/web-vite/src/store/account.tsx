import type { Account } from "@tape.xyz/indexer";
import { create } from "zustand";

type AccountStore = {
  currentAccount: Account | null;
  setCurrentAccount: (account: Account) => void;
};

export const useAccountStore = create<AccountStore>((set) => ({
  currentAccount: null,
  setCurrentAccount: (account) => set({ currentAccount: account })
}));
