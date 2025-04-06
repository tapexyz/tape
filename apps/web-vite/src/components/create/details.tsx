import { getAccountMetadata } from "@/helpers/metadata";
import { useMeSuspenseQuery } from "@/queries/account";
import { useCreatePostMutation } from "@/queries/post";
import { useCookieStore } from "@/store/cookie";
import { useCreatePostStore } from "@/store/post";
import {
  MediaAudioMimeType,
  MediaVideoMimeType,
  MetadataLicenseType,
  audio,
  video
} from "@lens-protocol/metadata";
import { TAPE_WEBSITE_URL } from "@tape.xyz/constants";
import type { Account } from "@tape.xyz/indexer";
import { Button, Input, Textarea, toast } from "@tape.xyz/winder";
import { Advanced } from "./advanced";
import { Category } from "./category";

export const Details = () => {
  const {
    mediaType,
    title,
    setTitle,
    description,
    setDescription,
    duration,
    tag,
    coverUri
  } = useCreatePostStore();
  const { data } = useMeSuspenseQuery();
  const account = data.me.loggedInAs.account as Account;
  const { handleWithNamespaceAndPrefix } = getAccountMetadata(account);
  const isAuthenticated = useCookieStore((state) => state.isAuthenticated);

  const { mutateAsync: createPost, isPending } = useCreatePostMutation();

  const handleCreatePost = async () => {
    if (!isAuthenticated) {
      return toast.error("Please sign in to create a post");
    }

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const baseMetadata = {
      title: trimmedTitle,
      tags: [tag],
      nft: {
        name: trimmedTitle,
        description: trimmedDescription,
        animation_url: "https://example.com/video.mp4",
        external_url: TAPE_WEBSITE_URL,
        image: coverUri
      },
      content: trimmedDescription
    };
    const metadata =
      mediaType === "audio"
        ? audio({
            ...baseMetadata,
            audio: {
              item: "https://example.com/video.mp4",
              type: MediaAudioMimeType.MP3,
              cover: coverUri,
              duration,
              license: MetadataLicenseType.CCO,
              artist: handleWithNamespaceAndPrefix
            }
          })
        : video({
            ...baseMetadata,
            video: {
              item: "https://example.com/video.mp4",
              type: MediaVideoMimeType.MP4,
              cover: coverUri,
              duration,
              altTag: trimmedTitle,
              license: MetadataLicenseType.CCO
            }
          });
    await createPost(metadata);
  };

  return (
    <div className="space-y-4 md:w-1/2">
      <Input
        label="Title"
        placeholder="Title that summarizes your content"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        rows={4}
        maxLength={5000}
        label="Description"
        placeholder="Describe more about your content. Can also be @user, #hashtags, https://links.xyz or chapters (00:20 - Intro)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Category />
      <Advanced />
      <Button
        size="xl"
        className="w-full"
        onClick={handleCreatePost}
        loading={isPending}
      >
        Post
      </Button>
    </div>
  );
};
