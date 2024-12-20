import { create } from "zustand";

type CreatePostState = {
  mediaType: "video" | "audio";
  title: string;
  description: string;
  category: string;
  file: File | null;
  duration: number;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setCategory: (category: string) => void;
  setMediaType: (mediaType: "video" | "audio") => void;
  setFile: (file: File | null) => void;
  setDuration: (duration: number) => void;
};

export const useCreatePostStore = create<CreatePostState>((set) => ({
  mediaType: "video",
  title: "",
  description: "",
  category: "",
  duration: 0,
  file: null,
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setCategory: (category) => set({ category }),
  setMediaType: (mediaType) => set({ mediaType }),
  setDuration: (duration) => set({ duration }),
  setFile: (file) =>
    set({ file, mediaType: file?.type.includes("video") ? "video" : "audio" })
}));
