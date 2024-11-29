import type { PostMetadata } from "@tape.xyz/indexer";

export const getPostMetadata = (metadata: PostMetadata) => {
  switch (metadata.__typename) {
    case "ImageMetadata":
      return {
        title: metadata.title,
        content: metadata.content,
        asset: {
          type: "IMAGE",
          uri: metadata.image.item
        },
        attachments: metadata.attachments.map((attachment) => ({
          type: attachment.__typename,
          uri: attachment.item
        }))
      };
    case "AudioMetadata":
      return {
        title: metadata.title,
        content: metadata.content,
        asset: {
          type: "AUDIO",
          title: metadata.title,
          content: metadata.content,
          uri: metadata.audio.item,
          cover: metadata.audio.cover,
          artist: metadata.audio.artist,
          duration: metadata.audio.duration || 0
        }
      };
    case "VideoMetadata":
      return {
        title: metadata.title,
        content: metadata.content,
        asset: {
          type: "VIDEO",
          uri: metadata.video.item,
          duration: metadata.video.duration || 0,
          cover: metadata.video.cover
        },
        attachments: metadata.attachments.map((attachment) => ({
          type: attachment.__typename,
          uri: attachment.item
        }))
      };
    default:
      return null;
  }
};
