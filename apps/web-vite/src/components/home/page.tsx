import { Link } from "@tanstack/react-router";
import { Button } from "@tape.xyz/winder";
import { Feed } from "./feed";

export const HomePage = () => {
  return (
    <div className="space-y-1.5">
      <div className="flex h-[440px] flex-col justify-between rounded-card bg-theme p-5">
        <h1 className="font-serif text-2xl lg:text-6xl">
          Welcome to &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tape&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;).
          <p>
            New way of sharing media online. Connect, Create, and Share with
            creators from all around the world.
          </p>
        </h1>
        <div className="space-x-4 *:underline *:underline-offset-2">
          <Link to="/">Create an account</Link>
          <Link to="/">Sign in</Link>
        </div>
      </div>
      <div
        style={{ backgroundImage: "url(/images/hero.webp)" }}
        className="flex h-96 flex-col justify-end overflow-hidden rounded-card bg-center bg-cover bg-theme bg-no-repeat grayscale transition-filter duration-500 hover:grayscale-0"
      >
        <div className="flex flex-wrap items-end justify-between gap-4 bg-gradient-to-t from-black/70 p-5">
          <h2 className="max-w-xl text-[28px] text-white leading-[26px] tracking-tighter">
            Join the movement towards a more transparent, secure, and
            user-centric social experience while expanding your network.
          </h2>
          <Button className="invert">Invite friends and get rewarded</Button>
        </div>
      </div>
      <Feed />
    </div>
  );
};
