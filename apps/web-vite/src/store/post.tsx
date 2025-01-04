import { create } from "zustand";

type CreatePostState = {
  mediaType: "video" | "audio";
  title: string;
  description: string;
  tag: string;
  coverUri: string;
  file: File | null;
  duration: number;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setTag: (tag: string) => void;
  setMediaType: (mediaType: "video" | "audio") => void;
  setFile: (file: File | null) => void;
  setDuration: (duration: number) => void;
  setCoverUri: (coverUri: string) => void;
};

export const useCreatePostStore = create<CreatePostState>((set) => ({
  mediaType: "video",
  title: "",
  description: "",
  tag: "",
  duration: 0,
  file: null,
  coverUri: "",
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setTag: (tag) => set({ tag }),
  setMediaType: (mediaType) => set({ mediaType }),
  setDuration: (duration) => set({ duration }),
  setFile: (file) =>
    set({ file, mediaType: file?.type.includes("video") ? "video" : "audio" }),
  setCoverUri: (coverUri) => set({ coverUri })
}));
