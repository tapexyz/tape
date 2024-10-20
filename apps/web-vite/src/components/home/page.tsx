import { About } from "./about";
import { Feed } from "./feed";
import { Hero } from "./hero";
import { Invite } from "./invite";
import { Users } from "./users";

export const HomePage = () => {
  return (
    <div className="space-y-1.5">
      <Hero />
      <Invite />
      <Feed />
      <About />
      <Users />
    </div>
  );
};
