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
    <div className="fixed bottom-32 z-50 w-[357px]">
      <motion.div
        animate={{
          height: bounds.height ? bounds.height : undefined,
          transition: { duration: 0.3, type: "spring", bounce: 0.1 }
        }}
        className="flex w-full flex-col justify-end overflow-hidden rounded-[14px] bg-primary/80 backdrop-blur-xl"
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
                <div className="mx-2 mt-2 flex flex-col items-start justify-between rounded-[9px] bg-secondary px-[14px] pt-[13px]">
                  <span className="inline-block text-primary/30">
                    Media types
                  </span>
                  <div className="flex flex-col items-start py-4 font-serif text-[42px] text-primary/30 *:leading-[47px]">
                    <button type="button">All</button>
                    <button type="button" className="text-white">
                      Videos
                    </button>
                    <button type="button">Livestreams</button>
                    <button type="button">Audio clips</button>
                  </div>
                  <hr className="w-full border border-custom invert" />
                  <div>
                    <span className="my-3 inline-block text-primary/30">
                      Categories
                    </span>
                    <div className="no-scrollbar flex max-h-40 flex-wrap items-center gap-[9px] overflow-y-auto pb-2 *:rounded-[9px] *:bg-card/15 *:px-4 *:py-2 *:font-medium *:text-sm ">
                      <button
                        type="button"
                        className="text-primary data-[selected=true]:bg-card data-[selected=true]:text-secondary"
                        data-selected={true}
                      >
                        All
                      </button>
                      {CREATOR_VIDEO_CATEGORIES.map((category) => (
                        <button
                          type="button"
                          key={category.tag}
                          className="text-primary data-[selected=true]:bg-card data-[selected=true]:text-secondary"
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
            className="flex w-full items-center justify-between px-4 py-3 text-[#c7c7c7] text-sm"
          >
            <span>{open ? "Close" : "Open"} filters</span>
            <span className="rounded bg-card/30 px-1.5 py-0.5 text-primary text-xs tabular-nums">
              2
            </span>
          </button>
        </div>
      </motion.div>
      <div className="mt-[6px] flex items-center space-x-[6px] rounded-[14px] bg-primary/80 p-[6px] font-medium backdrop-blur-xl *:flex-1">
        {items.map((item) => (
          <Link
            key={item}
            href="/"
            className={tw(
              "rounded-custom px-[13px] py-[6px] text-center text-sm hover:bg-card/20 hover:text-primary",
              item === "Explore" ? "bg-card" : "bg-card/10 text-primary/80"
            )}
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
};
