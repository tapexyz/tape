import type { Maybe, PublicationMetadataMedia } from "@tape.xyz/lens";

type AttachmentType = "VIDEO" | "IMAGE" | "AUDIO";

export const getAttachmentsData = (
  attachments?: Maybe<PublicationMetadataMedia[]>
): { uri: string; type: AttachmentType }[] => {
  if (!attachments) {
    return [];
  }

  return attachments.flatMap(
    (attachment): { uri: string; type: AttachmentType }[] => {
      switch (attachment.__typename) {
        case "PublicationMetadataMediaImage":
          return [
            {
              uri: attachment.image.optimized?.uri as string,
              type: "IMAGE"
            }
          ];
        case "PublicationMetadataMediaVideo":
          return [
            {
              uri: attachment.video.optimized?.uri as string,
              type: "VIDEO"
            }
          ];
        case "PublicationMetadataMediaAudio":
          return [
            {
              uri: attachment.audio.optimized?.uri as string,
              type: "AUDIO"
            }
          ];
        default:
          return [];
      }
    }
  );
};
