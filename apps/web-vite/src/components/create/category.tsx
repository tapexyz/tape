import { getCategoryIcon } from "@/helpers/category";
import { useCreatePostStore } from "@/store/post";
import { TAPE_MEDIA_CATEGORIES } from "@tape.xyz/constants";
import {
  Hash,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@tape.xyz/winder";

export const Category = () => {
  const { tag, setTag } = useCreatePostStore();

  return (
    <Select value={tag} onValueChange={(value) => setTag(value)}>
      <SelectTrigger>
        <SelectValue
          placeholder={
            <span className="flex items-center space-x-1.5">
              <span className="rounded-custom bg-secondary p-1.5">
                <Hash />
              </span>
              <span>Add a category</span>
            </span>
          }
        />
      </SelectTrigger>
      <SelectContent>
        {TAPE_MEDIA_CATEGORIES.map((category) => {
          const Icon = getCategoryIcon(category.tag);
          return (
            <SelectItem key={category.tag} value={category.tag}>
              <span className="flex items-center space-x-1.5">
                <span className="rounded-custom bg-secondary p-1.5">
                  <Icon />
                </span>
                <span>{category.name}</span>
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
