import { IS_MAINNET } from "./general";

export enum FEATURE_FLAGS {
  POST_WITH_SOURCE_URL = "PostWithSource",
  TAPE_CONNECT = "TapeConnect"
}

type FeatureFlag = {
  flag: string;
  enabledFor: string[];
};

export const featureFlags: FeatureFlag[] = [
  {
    flag: FEATURE_FLAGS.POST_WITH_SOURCE_URL,
    enabledFor: IS_MAINNET ? ["0x2d"] : []
  },
  {
    flag: FEATURE_FLAGS.TAPE_CONNECT,
    enabledFor: IS_MAINNET ? ["0x2d", "0xc001"] : []
  }
];
