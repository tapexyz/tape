import { useState } from "react";

export const useDragAndDrop = () => {
  const [dragging, setDragging] = useState(false);

  const onDragOver = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => setDragging(false);

  return {
    dragging,
    setDragging,
    onDragOver,
    onDragLeave
  };
};
