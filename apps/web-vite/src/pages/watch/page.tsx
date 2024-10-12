import { Comments } from "./_components/comments";
import { Publication } from "./_components/publication";

export const WatchPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <Publication />
      <Comments />
    </div>
  );
};
