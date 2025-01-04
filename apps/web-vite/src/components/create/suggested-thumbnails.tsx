import { generateThumbnailsFromVideo } from "@/helpers/generate-thumbnails";
import { useCreatePostStore } from "@/store/post";
import { useEffect, useState } from "react";

export const SuggestedThumbnails = () => {
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  const file = useCreatePostStore((state) => state.file);
  if (!file) return null;

  const getThumbnails = async () => {
    const thumbnails = await generateThumbnailsFromVideo(file, 6);
    setThumbnails(thumbnails);
  };

  useEffect(() => {
    getThumbnails();
  }, [file]);

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {thumbnails.map((thumbnail) => (
        <img
          key={thumbnail}
          src={thumbnail}
          alt="suggested"
          className="aspect-video w-full rounded-custom object-cover"
        />
      ))}
    </div>
  );
};
