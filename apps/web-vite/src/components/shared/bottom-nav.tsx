import { Link, useMatchRoute } from "@tanstack/react-router";
import { CREATOR_VIDEO_CATEGORIES } from "@tape.xyz/constants";
import { FunnelSimple, tw } from "@tape.xyz/winder";
import { useClickAway, useMeasure } from "@uidotdev/usehooks";
import { AnimatePresence, m } from "framer-motion";
import { type RefObject, memo, useEffect, useState } from "react";

const Panel = memo(() => {
  const matchRoute = useMatchRoute();
  const [open, setOpen] = useState(false);
  const [elementRef, bounds] = useMeasure();
  const ref = useClickAway(() => {
    setOpen(false);
  });

  if (!matchRoute({ to: "/explore" })) {
    return null;
  }

  return (
    <m.div
      ref={ref as RefObject<HTMLDivElement>}
      animate={{
        height: bounds.height ? bounds.height : undefined,
        transition: {
          duration: 0.2,
          type: "spring",
          bounce: 0
        }
      }}
      className="flex w-full flex-col justify-end overflow-hidden rounded-[14px] border border-custom bg-black/95 backdrop-blur-2xl"
    >
      <div ref={elementRef} className="flex flex-col justify-end">
        <AnimatePresence mode="popLayout">
          {open ? (
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
          ) : null}
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
  const matchRoute = useMatchRoute();

  return (
    <div className="mt-1.5 flex items-center space-x-1.5 rounded-[14px] border border-custom bg-black/95 p-1.5 font-semibold shadow backdrop-blur-2xl *:flex-1 *:rounded-custom *:px-[13px] *:py-[6px] *:text-center *:text-sm">
      <Link
        to="/"
        className={tw(
          matchRoute({ to: "/" })
            ? "bg-white text-black/80"
            : "bg-white/15 text-white/80 hover:bg-white/20"
        )}
      >
        Home
      </Link>
      <Link
        to="/explore"
        className={tw(
          matchRoute({ to: "/explore" })
            ? "bg-white text-black/80"
            : "bg-white/15 text-white/80 hover:bg-white/20"
        )}
        search={{ media: "all" }}
      >
        Explore
      </Link>
      <Link
        to="/following"
        className={tw(
          matchRoute({ to: "/following" })
            ? "bg-white text-black/80"
            : "bg-white/15 text-white/80 hover:bg-white/20"
        )}
      >
        Following
      </Link>
    </div>
  );
});

export const BottomNav = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const footerHeight = document.querySelector("footer")?.clientHeight || 0;

    const isScrollingDown = scrollY > lastScrollY;
    const footerVisibility =
      scrollY + windowHeight >= documentHeight - footerHeight;

    if (isScrollingDown || footerVisibility) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
    setLastScrollY(scrollY);
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
        className="fixed inset-x-0 bottom-6 z-50 hidden w-[calc(100%-var(--removed-body-scroll-bar-size,0px))] justify-center md:flex 2xl:bottom-10"
      >
        {!isHidden ? (
          <div className="w-[357px]">
            <Panel />
            <Bar />
          </div>
        ) : null}
      </m.div>
    </AnimatePresence>
  );
};
