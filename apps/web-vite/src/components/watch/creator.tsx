import { Account } from "./account";
import { Comments } from "./comments";

export const CreatorAndComments = () => {
  return (
    <div className="flex-1 space-y-5">
      <Account />
      <Comments />
    </div>
  );
};
