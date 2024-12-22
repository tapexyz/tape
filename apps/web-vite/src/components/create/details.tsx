import { Button, Input, Textarea } from "@tape.xyz/winder";
import { Advanced } from "./advanced";
import { Category } from "./category";

export const Details = () => {
  return (
    <div className="space-y-4 md:w-1/2">
      <Input label="Title" placeholder="Title that summarizes your content" />
      <Textarea
        rows={4}
        maxLength={5000}
        label="Description"
        placeholder="Describe more about your content. Can also be @user, #hashtags, https://links.xyz or chapters (00:20 - Intro)"
      />

      <Category />
      <Advanced />
      <Button size="xl" className="w-full">
        Post
      </Button>
    </div>
  );
};
