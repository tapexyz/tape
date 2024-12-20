import { HorizontalView } from "../shared/horizontal-view";
import { Bytes } from "./bytes";
import { Curated } from "./curated";
import { Trending } from "./trending";

export const Feed = () => {
  return (
    <div className="rounded-card bg-theme p-5">
      <div className="space-y-36">
        <h1 className="max-w-screen-lg font-serif text-2xl md:text-4xl lg:text-[58px] lg:leading-[58px]">
          Discover content from a wide variety of channels & creators.
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
