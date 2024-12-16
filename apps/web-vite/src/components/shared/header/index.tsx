import { SearchTrigger } from "../search";
import { LeftSection } from "./left";
import { RightSection } from "./right";

export const Header = () => {
  return (
    <header className="sticky inset-x-0 top-0 z-50 flex h-[52px] w-full items-center justify-between gap-1.5 px-5 py-2">
      <LeftSection />
      <SearchTrigger />
      <RightSection />
    </header>
  );
};
