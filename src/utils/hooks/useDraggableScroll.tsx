import { RefObject } from "react";

export default function useDraggableScroll(
  ref: RefObject<HTMLElement>,
  options: {
    direction?: "vertical" | "horizontal" | "both";
  } = { direction: "both" }
) {
  if (process.env.NODE_ENV === "development") {
    if (typeof ref !== "object" || typeof ref.current === "undefined") {
      console.error("`useDraggableScroll` expects a single ref argument.");
    }
  }

  const { direction } = options;

  // The initial position (scroll progress and mouse location) when the mouse is pressed down on the element
  let initialPosition = { scrollTop: 0, scrollLeft: 0, mouseX: 0, mouseY: 0 };

  const mouseMoveHandler = (event: { clientX: number; clientY: number }) => {
    if (ref.current) {
      // Calculate differences to see how far the user has moved
      const dx = event.clientX - initialPosition.mouseX;
      const dy = event.clientY - initialPosition.mouseY;

      // Scroll the element according to those differences
      if (direction !== "horizontal")
        ref.current.scrollTop = initialPosition.scrollTop - dy;
      if (direction !== "vertical")
        ref.current.scrollLeft = initialPosition.scrollLeft - dx;
    }
  };

  const mouseUpHandler = () => {
    // Return to cursor: grab after the user is no longer pressing
    if (ref.current) ref.current.style.cursor = "grab";

    // Remove the event listeners since it is not necessary to track the mouse position anymore
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  };

  const onMouseDown = (event: { clientX: number; clientY: number }) => {
    if (ref.current) {
      // Save the position at the moment the user presses down
      initialPosition = {
        scrollLeft: ref.current.scrollLeft,
        scrollTop: ref.current.scrollTop,
        mouseX: event.clientX,
        mouseY: event.clientY,
      };

      // Show a cursor: grabbing style and set user-select: none to avoid highlighting text while dragging
      ref.current.style.cursor = "grabbing";
      ref.current.style.userSelect = "none";

      // Add the event listeners that will track the mouse position for the rest of the interaction
      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    }
  };

  return { onMouseDown };
}
