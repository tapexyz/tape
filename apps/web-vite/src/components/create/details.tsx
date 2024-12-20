import { getCategoryIcon } from "@/helpers/category";
import { TAPE_MEDIA_CATEGORIES } from "@tape.xyz/constants";
import {
  Button,
  Hash,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea
} from "@tape.xyz/winder";
import { Advanced } from "./advanced";

export const Details = () => {
  return (
    <div className="space-y-4 md:w-1/2">
      <Input label="Title" placeholder="Title that describes your content" />
      <Textarea
        rows={4}
        maxLength={5000}
        label="Description"
        placeholder="Describe more about your content. Can also be @user, #hashtags, https://links.xyz or chapters (00:20 - Intro)"
      />
      <Select>
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
      <Advanced />
      <div>
        <Button size="xl" className="w-full">
          Create
        </Button>
      </div>
    </div>
  );
};
