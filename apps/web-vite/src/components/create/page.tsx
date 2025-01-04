import { Details } from "./details";
import DropZone from "./drop-zone";

export const CreatePage = () => {
  return (
    <div className="flex min-h-[calc(100vh-60px)] flex-col items-center rounded-card bg-theme">
      <div className="flex w-full max-w-screen-lg flex-wrap gap-14 px-2 py-20 md:flex-nowrap">
        <DropZone />
        <Details />
      </div>
    </div>
  );
};
