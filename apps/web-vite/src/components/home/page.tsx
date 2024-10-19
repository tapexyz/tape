import { About } from "./about";
import { Feed } from "./feed";
import { Hero } from "./hero";
import { Invite } from "./invite";

export const HomePage = () => {
  return (
    <div className="space-y-1.5">
      <Hero />
      <Invite />
      <Feed />
      <About />
    </div>
  );
};
