import { Link } from "@tanstack/react-router";
import { CREATOR_VIDEO_CATEGORIES } from "@tape.xyz/constants";
import { FunnelSimple, tw } from "@tape.xyz/winder";
import { useMeasure } from "@uidotdev/usehooks";
import { AnimatePresence, m } from "framer-motion";
import { memo, useState } from "react";

const items = ["Home", "Explore", "Following"];

const Panel = memo(() => {
  const [open, setOpen] = useState(false);
  const [elementRef, bounds] = useMeasure();
  return (
    <m.div
      animate={{
        height: bounds.height ? bounds.height : undefined,
        transition: {
          duration: 0.2,
          type: "spring",
          bounce: 0.1
        }
      }}
      className="flex w-full flex-col justify-end overflow-hidden rounded-[14px] bg-primary/80 backdrop-blur-2xl"
    >
      <div ref={elementRef} className="flex flex-col justify-end">
        <AnimatePresence mode="popLayout">
          {open && (
            <m.div
              key={open ? "open" : "close"}
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{
                opacity: 0,
                filter: "blur(4px)",
                transition: { duration: 0 }
              }}
            >
              <div className="mx-2 mt-2 flex flex-col items-start justify-between rounded-custom bg-theme/10 px-[14px] pt-[13px]">
                <span className="inline-block text-theme/30">Media types</span>
                <div className="flex flex-col items-start gap-1.5 pt-2 pb-5 font-serif text-[42px] text-theme/40 *:leading-[47px]">
                  <button type="button">All</button>
                  <button type="button" className="text-white">
                    Videos
                  </button>
                  <button type="button">Livestreams</button>
                  <button type="button">Audio clips</button>
                </div>
                <hr className="w-full border border-custom invert" />
                <div>
                  <span className="my-3 inline-block text-theme/30">
                    Categories
                  </span>
                  <div className="no-scrollbar flex max-h-40 flex-wrap items-center gap-[9px] overflow-y-auto pb-2 *:rounded-[9px] *:bg-theme/15 *:px-4 *:py-2 *:font-medium *:text-sm">
                    <button
                      type="button"
                      className="text-theme data-[selected=true]:bg-theme data-[selected=true]:text-primary"
                      data-selected={true}
                    >
                      All
                    </button>
                    {CREATOR_VIDEO_CATEGORIES.map((category) => (
                      <button
                        type="button"
                        key={category.tag}
                        className="text-theme data-[selected=true]:bg-theme data-[selected=true]:text-primary"
                        data-selected={false}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between px-4 py-3 font-medium text-[#c7c7c7] text-sm"
        >
          <span className="inline-flex items-center gap-1.5">
            <span>Filters</span>
            <FunnelSimple className="size-4" weight="bold" />
          </span>
          <span className="rounded bg-theme/20 px-1.5 py-0.5 text-theme text-xs tabular-nums">
            2
          </span>
        </button>
      </div>
    </m.div>
  );
});

const Bar = memo(() => {
  return (
    <div className="mt-1.5 flex items-center space-x-1.5 rounded-[14px] bg-primary/80 p-1.5 font-semibold shadow backdrop-blur-2xl *:flex-1">
      {items.map((item) => (
        <Link
          key={item}
          to="/"
          className={tw(
            "rounded-custom px-[13px] py-[6px] text-center text-sm",
            item === "Explore"
              ? "bg-theme text-primary/80"
              : "bg-theme/15 text-theme/80 hover:bg-theme/20"
          )}
        >
          {item}
        </Link>
      ))}
    </div>
  );
});

export const BottomNav = () => {
  return (
    <div className="-translate-x-1/2 sticky bottom-10 left-[50%] z-50 hidden w-[357px] lg:block">
      <Panel />
      <Bar />
    </div>
  );
};
