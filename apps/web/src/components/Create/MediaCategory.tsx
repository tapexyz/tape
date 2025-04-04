import { TAPE_MEDIA_CATEGORIES } from "@tape.xyz/constants";
import { getCategoryByTag } from "@tape.xyz/generic";
import { Select, SelectItem } from "@tape.xyz/ui";

import useAppStore from "@/lib/store";

const MediaCategory = () => {
  const uploadedMedia = useAppStore((state) => state.uploadedMedia);
  const setUploadedMedia = useAppStore((state) => state.setUploadedMedia);
  return (
    <div className="flex-1 space-y-1">
      <span className="font-medium text-sm">Category</span>

      <Select
        value={uploadedMedia.mediaCategory.tag}
        onValueChange={(tag) =>
          setUploadedMedia({ mediaCategory: getCategoryByTag(tag) })
        }
      >
        {TAPE_MEDIA_CATEGORIES.map((category) => (
          <SelectItem key={category.tag} value={category.tag}>
            {category.name}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default MediaCategory;
