import { IS_MAINNET } from "./general";

export const SUSPENDED_PROFILES = IS_MAINNET
  ? [
      "0x084311",
      "0x03eee1",
      "0x6e64",
      "0x79f2",
      "0x4e24",
      "0x923a",
      "0x99",
      "0x9b5d",
      "0x9cb4",
      "0x8441",
      "0x0dc2"
    ]
  : [];
