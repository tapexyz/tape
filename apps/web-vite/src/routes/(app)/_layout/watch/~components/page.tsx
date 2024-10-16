import { Comments } from "./comments";
import { Publication } from "./publication";

export const WatchPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <Publication />
      <Comments />
    </div>
  );
};
