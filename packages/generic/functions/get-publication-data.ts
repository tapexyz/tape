import type { PublicationMetadata } from "@tape.xyz/lens";

import type { TapePublicationData } from "@tape.xyz/lens/custom-types";
import { getAttachmentsData } from "./get-attachments-data";
import { getThumbnailUrl } from "./get-thumbnail-url";
import { getPublicationMediaUrl } from "./getPublicationMediaUrl";

export const getPublicationData = (
  metadata: PublicationMetadata
): TapePublicationData | null => {
  switch (metadata.__typename) {
    case "ArticleMetadataV3":
      return {
        title: metadata.title,
        content: metadata.content,
        attachments: getAttachmentsData(metadata.attachments)
      };
    case "TextOnlyMetadataV3":
      return {
        content: metadata.content
      };
    case "LinkMetadataV3":
      return {
        content: metadata.sharingLink || metadata.content
      };
    case "ImageMetadataV3":
      return {
        title: metadata.title,
        content: metadata.content,
        asset: {
          type: "IMAGE",
          uri: getPublicationMediaUrl(metadata)
        },
        attachments: getAttachmentsData(metadata.attachments)
      };
    case "AudioMetadataV3":
      return {
        title: metadata.title,
        content: metadata.content,
        asset: {
          type: "AUDIO",
          uri: getPublicationMediaUrl(metadata),
          cover: getThumbnailUrl(metadata),
          artist: metadata.asset.artist,
          title: metadata.title,
          duration: metadata.asset.duration || 0
        }
      };
    case "VideoMetadataV3":
      return {
        title: metadata.title,
        content: metadata.content,
        asset: {
          type: "VIDEO",
          uri: getPublicationMediaUrl(metadata),
          duration: metadata.asset.duration || 0,
          cover: getThumbnailUrl(metadata)
        },
        attachments: getAttachmentsData(metadata.attachments)
      };
    case "LiveStreamMetadataV3":
      return {
        title: metadata.title,
        content: metadata.content,
        attachments: getAttachmentsData(metadata.attachments),
        asset: {
          type: "VIDEO",
          uri: getPublicationMediaUrl(metadata),
          cover: getThumbnailUrl(metadata)
        }
      };
    case "MintMetadataV3":
    case "EmbedMetadataV3":
    case "CheckingInMetadataV3":
      return {
        content: metadata.content,
        attachments: getAttachmentsData(metadata.attachments)
      };
    default:
      return null;
  }
};
