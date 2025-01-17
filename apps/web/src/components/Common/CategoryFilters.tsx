import { tw } from "@tape.xyz/browser";
import { TAPE_MEDIA_CATEGORIES } from "@tape.xyz/constants";
import { EVENTS } from "@tape.xyz/generic";
import type { FC } from "react";
import { useRef } from "react";

import useSw from "@/hooks/useSw";
import useAppStore from "@/lib/store";

import HorizontalScroller from "./HorizontalScroller";

type Props = {
  heading?: string;
};

const CategoryFilters: FC<Props> = ({ heading }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { activeTagFilter, setActiveTagFilter } = useAppStore();
  const { addEventToQueue } = useSw();

  const onFilter = (tag: string) => {
    setActiveTagFilter(tag);
    addEventToQueue(EVENTS.FILTER_CATEGORIES);
  };

  return (
    <div className="sticky top-0 z-[9] bg-white dark:bg-black">
      <HorizontalScroller
        sectionRef={sectionRef}
        heading={heading ?? "Explore"}
      />
      <div
        ref={sectionRef}
        className="no-scrollbar flex items-center overflow-x-auto scroll-smooth pt-4 md:mx-auto"
      >
        <button
          type="button"
          className={tw(
            "whitespace-nowrap px-10 py-2.5 font-medium",
            activeTagFilter === "all"
              ? "border-brand-400 border-b-2 bg-gradient-to-t from-brand-50 to-transparent dark:from-brand-950"
              : "border-b dark:border-gray-800"
          )}
          onClick={() => onFilter("all")}
        >
          All
        </button>
        {TAPE_MEDIA_CATEGORIES.map((category) => (
          <button
            type="button"
            key={category.tag}
            className={tw(
              "whitespace-nowrap px-6 py-2.5 font-medium",
              activeTagFilter === category.tag
                ? "border-brand-400 border-b-2 bg-gradient-to-t from-brand-50 to-transparent dark:from-brand-950"
                : "border-b dark:border-gray-800"
            )}
            onClick={() => onFilter(category.tag)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilters;
