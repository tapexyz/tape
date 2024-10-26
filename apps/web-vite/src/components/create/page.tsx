import { Details } from "./details";
import DropZone from "./drop-zone";

export const CreatePage = () => {
  return (
    <div className="flex min-h-[calc(100vh-60px)] flex-col items-center rounded-card bg-theme">
      <div className="grid w-full max-w-screen-xl gap-10 px-2 py-20 lg:grid-cols-2">
        <DropZone />
        <Details />
      </div>
    </div>
  );
};
