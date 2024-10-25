import { useState } from "react";

export const useDragAndDrop = () => {
  const [dragOver, setDragOver] = useState(false);

  const onDragOver = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = () => setDragOver(false);

  return {
    dragOver,
    setDragOver,
    onDragOver,
    onDragLeave
  };
};
