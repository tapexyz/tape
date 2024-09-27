import { CREATOR_VIDEO_CATEGORIES } from "@tape.xyz/constants";
import { tw } from "@tape.xyz/winder/common";
import { useMeasure } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const items = ["Home", "Explore", "Following"];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [elementRef, bounds] = useMeasure();

  return (
    <div className="fixed bottom-32 w-[357px]">
      <motion.div
        animate={{
          height: bounds.height ? bounds.height : undefined,
          transition: { duration: 0.3, type: "spring", bounce: 0.1 }
        }}
        className="flex w-full flex-col justify-end overflow-hidden rounded-[14px] bg-black/80 text-sm text-white/80"
      >
        <div ref={elementRef} className="flex flex-col justify-end">
          <AnimatePresence mode="popLayout">
            {open && (
              <motion.div
                key={open ? "open" : "close"}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{
                  opacity: 0,
                  filter: "blur(4px)",
                  transition: { duration: 0 }
                }}
              >
                <div className="mx-2 mt-2 flex flex-col items-start justify-between rounded-[9px] bg-white/10 px-[14px] pt-[13px]">
                  <span className="inline-block text-white/30">
                    Media types
                  </span>
                  <div className="flex flex-col items-start gap-7 py-7 font-serif text-[42px] text-white/30">
                    <button type="button">All</button>
                    <button type="button" className="text-white">
                      Videos
                    </button>
                    <button type="button">Livestreams</button>
                    <button type="button">Audio clips</button>
                  </div>
                  <hr className="w-full border-white/10" />
                  <div>
                    <span className="my-3 inline-block text-white/30">
                      Categories
                    </span>
                    <div className="no-scrollbar flex max-h-40 flex-wrap items-center gap-[9px] overflow-y-auto pb-2 *:rounded-[9px] *:bg-white/15 *:px-4 *:py-2 *:font-medium *:text-sm ">
                      <button
                        type="button"
                        className="data-[selected=true]:bg-white data-[selected=true]:text-black"
                        data-selected={true}
                      >
                        All
                      </button>
                      {CREATOR_VIDEO_CATEGORIES.map((category) => (
                        <button
                          type="button"
                          key={category.tag}
                          className="data-[selected=true]:bg-white data-[selected=true]:text-black"
                          data-selected={false}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex w-full items-center justify-between px-4 py-3"
          >
            <span>{open ? "Close" : "Open"} filters</span>
            <span className="rounded bg-white/15 px-1.5 py-0.5 text-xs tabular-nums">
              2
            </span>
          </button>
        </div>
      </motion.div>
      <div className="mt-[6px] flex items-center space-x-[6px] rounded-[14px] bg-black/80 p-[6px] font-medium *:flex-1">
        {items.map((item) => (
          <Link
            key={item}
            href="/"
            className={tw(
              "rounded-[9px] px-[13px] py-[6px] text-center text-sm",
              item === "Explore"
                ? "bg-white text-black/80"
                : "bg-white/15 text-white/80"
            )}
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
};
