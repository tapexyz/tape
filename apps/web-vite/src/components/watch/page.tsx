import { Comments } from "./comments";
import { Publication } from "./publication";

export const WatchPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Publication />
      <Comments />
    </div>
  );
};
