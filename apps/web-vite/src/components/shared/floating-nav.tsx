import { getCategoryIcon } from "@/helpers/category";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { TAPE_MEDIA_CATEGORIES } from "@tape.xyz/constants";
import { FunnelSimple, ScrollArea, tw } from "@tape.xyz/winder";
import { useClickAway, useMeasure } from "@uidotdev/usehooks";
import { AnimatePresence, m, useScroll, useTransform } from "framer-motion";
import {
  type ReactNode,
  type RefObject,
  createContext,
  memo,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";

const Context = createContext<{
  isPanelOpen: boolean;
  setIsPanelOpen: (isPanelOpen: boolean) => void;
}>({
  isPanelOpen: false,
  setIsPanelOpen: () => {}
});
const FloatingNavProvider = ({ children }: { children: ReactNode }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  return (
    <Context.Provider value={{ isPanelOpen, setIsPanelOpen }}>
      {children}
    </Context.Provider>
  );
};

const Categories = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ container: ref });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <ScrollArea className="relative h-52" ref={ref}>
      <m.div
        className="absolute top-0 h-2 w-full bg-gradient-to-b from-black/60"
        style={{ opacity }}
      />
      <span className="my-3 inline-block text-white/30">Categories</span>
      <div className="flex flex-wrap items-center gap-1.5 pb-2 *:rounded-custom *:bg-white/15 *:px-3.5 *:py-2 *:font-medium *:text-sm">
        <button
          type="button"
          className="text-white data-[selected=true]:bg-white data-[selected=true]:text-black"
          data-selected={true}
        >
          All
        </button>
        {TAPE_MEDIA_CATEGORIES.map((category) => {
          const Icon = getCategoryIcon(category.tag);
          return (
            <button
              type="button"
              key={category.tag}
              className="flex items-center space-x-1.5 text-white data-[selected=true]:bg-white data-[selected=true]:text-black"
              data-selected={false}
            >
              <Icon />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
};

const Panel = memo(() => {
  const matchRoute = useMatchRoute();
  const [elementRef, bounds] = useMeasure();
  const { isPanelOpen, setIsPanelOpen } = useContext(Context);

  const ref = useClickAway(() => {
    setIsPanelOpen(false);
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
          bounce: 0.2
        }
      }}
      className="flex w-full flex-col justify-end overflow-hidden rounded-[14px] bg-black/95 backdrop-blur-2xl will-change-auto"
    >
      <div ref={elementRef} className="flex flex-col justify-end">
        <AnimatePresence mode="popLayout" initial={false}>
          {isPanelOpen ? (
            <m.div
              key={isPanelOpen ? "open" : "close"}
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
                <hr className="w-full border-custom invert" />
                <Categories />
              </div>
            </m.div>
          ) : null}
        </AnimatePresence>
        <button
          type="button"
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="flex w-full items-center justify-between px-4 py-3 font-medium text-[#c7c7c7] text-sm"
        >
          <span className="inline-flex items-center gap-1.5">
            <span>Filters</span>
            <FunnelSimple className="size-4" weight="bold" />
          </span>
          <span className="rounded-sm bg-white/20 px-1.5 py-0.5 text-white text-xs tabular-nums">
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
    <div className="mt-1.5 flex items-center space-x-1.5 rounded-[14px] border border-custom bg-black/95 p-1.5 font-semibold shadow-sm backdrop-blur-2xl *:flex-1 *:rounded-custom *:px-[13px] *:py-[6px] *:text-center *:text-sm">
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
        preload="viewport"
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

const Nav = () => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { isPanelOpen } = useContext(Context);

  const handleScroll = () => {
    if (isPanelOpen) return;

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const footerHeight = document.querySelector("footer")?.clientHeight || 0;

    const isScrollingDown = scrollY > lastScrollY;
    const footerVisibility =
      scrollY + windowHeight >= documentHeight - footerHeight;

    setShow(!(isScrollingDown || footerVisibility));
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
  }, [lastScrollY, isPanelOpen]);

  return (
    <AnimatePresence initial={false}>
      <m.div
        key={show ? "show" : "hide"}
        initial={{ opacity: 0, filter: "blur(4px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(4px)" }}
        transition={{ duration: 0.2, ease: "easeInOut", delay: 0.1 }}
        className="fixed inset-x-0 bottom-6 z-50 hidden w-[calc(100%-var(--removed-body-scroll-bar-size,0px))] justify-center will-change-transform md:flex 2xl:bottom-10"
      >
        {show ? (
          <div className="w-[357px]">
            <Panel />
            <Bar />
          </div>
        ) : null}
      </m.div>
    </AnimatePresence>
  );
};

export const FloatingNav = memo(() => {
  return (
    <FloatingNavProvider>
      <Nav />
    </FloatingNavProvider>
  );
});
