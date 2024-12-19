export type TapePublicationData = {
  title?: string;
  content?: string;
  asset?: {
    type: "VIDEO" | "IMAGE" | "AUDIO";
    uri: string;
    cover?: string;
    artist?: string;
    title?: string;
    duration?: number;
  };
  attachments?: {
    uri: string;
    type: "VIDEO" | "IMAGE" | "AUDIO";
  }[];
};

export enum AUTH_CHALLENGE_TYPE {
  ONBOARDING_USER = "ONBOARDING_USER",
  ACCOUNT_OWNER = "ACCOUNT_OWNER",
  ACCOUNT_MANAGER = "ACCOUNT_MANAGER"
}
