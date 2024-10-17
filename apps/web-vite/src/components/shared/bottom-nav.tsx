import { Link } from "@tanstack/react-router";
import { CREATOR_VIDEO_CATEGORIES } from "@tape.xyz/constants";
import { FunnelSimple, tw } from "@tape.xyz/winder";
import { useMeasure } from "@uidotdev/usehooks";
import { AnimatePresence, m } from "framer-motion";
import { memo, useEffect, useState } from "react";

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
          bounce: 0
        }
      }}
      className="flex w-full flex-col justify-end overflow-hidden rounded-[14px] bg-black/95 backdrop-blur-2xl"
    >
      <div ref={elementRef} className="flex flex-col justify-end">
        <AnimatePresence mode="popLayout">
          {open && (
            <m.div
              key={open ? "open" : "close"}
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
                transition: { duration: 0.2 }
              }}
              exit={{
                opacity: 0,
                filter: "blur(4px)",
                transition: { duration: 0 }
              }}
            >
              <div className="mx-2 mt-2 flex flex-col items-start justify-between rounded-custom bg-white/10 px-[14px] pt-[13px]">
                <span className="inline-block text-white/30">Media types</span>
                <div className="flex flex-col items-start gap-1.5 pt-2 pb-5 font-serif text-[42px] text-white/40 *:leading-[47px]">
                  <button type="button">All</button>
                  <button type="button" className="text-white">
                    Videos
                  </button>
                  <button type="button">Livestreams</button>
                  <button type="button">Audio clips</button>
                </div>
                <hr className="w-full border border-custom invert" />
                <div>
                  <span className="my-3 inline-block text-white/30">
                    Categories
                  </span>
                  <div className="no-scrollbar flex max-h-40 flex-wrap items-center gap-[9px] overflow-y-auto pb-2 *:rounded-[9px] *:bg-white/15 *:px-4 *:py-2 *:font-medium *:text-sm">
                    <button
                      type="button"
                      className="text-white data-[selected=true]:bg-white data-[selected=true]:text-black"
                      data-selected={true}
                    >
                      All
                    </button>
                    {CREATOR_VIDEO_CATEGORIES.map((category) => (
                      <button
                        type="button"
                        key={category.tag}
                        className="text-white data-[selected=true]:bg-white data-[selected=true]:text-black"
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
          <span className="rounded bg-white/20 px-1.5 py-0.5 text-white text-xs tabular-nums">
            2
          </span>
        </button>
      </div>
    </m.div>
  );
});

const Bar = memo(() => {
  return (
    <div className="mt-1.5 flex items-center space-x-1.5 rounded-[14px] bg-black/95 p-1.5 font-semibold shadow backdrop-blur-2xl *:flex-1">
      {items.map((item) => (
        <Link
          key={item}
          to="/"
          className={tw(
            "rounded-custom px-[13px] py-[6px] text-center text-sm",
            item === "Explore"
              ? "bg-white text-black/80"
              : "bg-white/15 text-white/80 hover:bg-white/20"
          )}
        >
          {item}
        </Link>
      ))}
    </div>
  );
});

export const BottomNav = () => {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHidden, setIsHidden] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    const abortController = new AbortController();
    window.addEventListener("scroll", handleScroll, {
      signal: abortController.signal
    });
    return () => {
      abortController.abort();
    };
  }, [lastScrollY]);

  return (
    <AnimatePresence initial={false}>
      <m.div
        key={isHidden ? "hidden" : "visible"}
        initial={{ opacity: 0, filter: "blur(4px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(4px)" }}
        transition={{ duration: 0.2, ease: "easeInOut", delay: 0.1 }}
        className="-translate-x-1/2 sticky bottom-10 left-[50%] z-50 hidden w-[357px] md:block"
      >
        {!isHidden ? (
          <>
            <Panel />
            <Bar />
          </>
        ) : null}
      </m.div>
    </AnimatePresence>
  );
};
