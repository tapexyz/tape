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
