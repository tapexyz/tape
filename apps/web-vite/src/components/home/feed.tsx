import { HorizontalView } from "../shared/horizontal-view";
import { Bytes } from "./bytes";
import { Curated } from "./curated";
import { Trending } from "./trending";

export const Feed = () => {
  return (
    <div className="rounded-card bg-theme p-5">
      <div className="space-y-36">
        <h1 className="max-w-screen-lg font-serif text-[58px] leading-[58px]">
          Discover content from a wide variety of channels & creators
          <span>
            <img
              src="/images/hand.webp"
              className="ml-2 inline-block size-12 select-none"
              draggable={false}
              alt="hand"
            />
          </span>
        </h1>
        <Curated />
      </div>
      <div className="mt-24">
        <HorizontalView heading="Tape Bytes">
          <Bytes />
        </HorizontalView>
      </div>
      <Trending />
    </div>
  );
};
