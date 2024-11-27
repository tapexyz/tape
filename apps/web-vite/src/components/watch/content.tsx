import { ShowMore, tw } from "@tape.xyz/winder";
import { useMeasure } from "@uidotdev/usehooks";
import { m } from "motion/react";
import { useState } from "react";

export const Content = ({ content }: { content?: string }) => {
  const [elementRef, bounds] = useMeasure();
  const [show, setShow] = useState(false);

  if (!content) return null;

  return (
    <>
      <m.div
        animate={{
          height: bounds.height ? bounds.height : undefined,
          transition: {
            duration: 0.2,
            type: "spring",
            bounce: 0
          }
        }}
        className="overflow-hidden"
      >
        <p ref={elementRef} className={tw(!show && "line-clamp-2")}>
          {content}
        </p>
      </m.div>
      <ShowMore onToggle={(on) => setShow(on)} className="my-3" />
    </>
  );
};
