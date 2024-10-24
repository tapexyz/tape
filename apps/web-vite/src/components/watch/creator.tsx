import { Comments } from "./comments";
import { Profile } from "./profile";

export const CreatorAndComments = () => {
  return (
    <div className="flex-1 space-y-5">
      <Profile />
      <Comments />
    </div>
  );
};
