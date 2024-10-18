import { Button } from "@tape.xyz/winder";
import { memo } from "react";

export const Invite = memo(() => {
  return (
    <div
      style={{ backgroundImage: "url(/images/hero.webp)" }}
      className="flex h-96 flex-col justify-end overflow-hidden rounded-card bg-center bg-cover bg-theme bg-no-repeat grayscale transition-filter duration-500 hover:grayscale-0"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 bg-gradient-to-t from-black/70 p-5">
        <h2 className="max-w-xl text-[28px] text-white leading-[26px] tracking-tighter">
          Join the movement towards a more transparent, secure, and user-centric
          social experience while expanding your network.
        </h2>
        <Button className="font-medium invert">
          Invite friends and get rewarded
        </Button>
      </div>
    </div>
  );
});
