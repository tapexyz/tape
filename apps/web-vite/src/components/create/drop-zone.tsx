import { useCreatePostStore } from "@/store/post";
import { ALLOWED_UPLOAD_MIME_TYPES } from "@tape.xyz/constants";
import { Button, Morph, toast, tw } from "@tape.xyz/winder";
import { useEffect, useState } from "react";
import { useDragAndDrop } from "./drag-and-drop";
import { Preview } from "./preview";

const texts = ["MOV, MP4, WAV or MP3", "Max size 10 GB"] as const;

const AnimatedHint = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const text = texts[currentTextIndex] ?? texts[0];
  return (
    <span className="mt-1.5 text-muted text-xs">
      <Morph>{text}</Morph>
    </span>
  );
};

const DropZone = () => {
  const { dragging, setDragging, onDragOver, onDragLeave } = useDragAndDrop();
  const { file, setFile } = useCreatePostStore();

  const validateFile = (file: File) => {
    if (!ALLOWED_UPLOAD_MIME_TYPES.includes(file?.type)) {
      return toast.error(`Media format (${file?.type}) not supported`);
    }
    setFile(file);
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e?.dataTransfer?.files[0];
    if (file) {
      validateFile(file);
    }
  };

  const onChooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (file) {
      validateFile(file);
    }
  };

  return (
    <label
      htmlFor="dropMedia"
      className={tw(
        "relative grid h-full w-full place-content-center place-items-center rounded-card border-2 border-custom border-dashed text-center focus:outline-none md:w-1/2",
        file ? "aspect-video" : "aspect-square"
      )}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      {file ? (
        <Preview />
      ) : (
        <>
          {dragging && (
            <>
              <div className="absolute inset-6 rounded-custom border-2 border-custom border-dashed" />
              <div className="absolute inset-12 rounded-custom border-2 border-custom border-dashed" />
            </>
          )}
          <input
            type="file"
            id="dropMedia"
            className="hidden"
            onChange={onChooseFile}
            accept={ALLOWED_UPLOAD_MIME_TYPES.join(",")}
          />
          <div className="flex flex-col items-center">
            <h1 className="font-serif text-2xl">Ready to share?</h1>
            <AnimatedHint />
            <Button className="mt-4" variant="secondary">
              <label
                htmlFor="chooseFile"
                className="inline-flex h-9 cursor-pointer items-center"
              >
                Choose file
                <input
                  id="chooseFile"
                  type="file"
                  className="hidden"
                  onChange={onChooseFile}
                  accept={ALLOWED_UPLOAD_MIME_TYPES.join(",")}
                />
              </label>
            </Button>
          </div>
        </>
      )}
    </label>
  );
};

export default DropZone;
