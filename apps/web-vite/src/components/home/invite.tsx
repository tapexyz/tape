import { Button } from "@tape.xyz/winder";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";
import { memo } from "react";

export const Invite = memo(() => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const backgroundX = useTransform(
    useSpring(mouseX, { stiffness: 50, damping: 10 }),
    [0, 1],
    [-3, 3]
  );
  const backgroundY = useTransform(
    useSpring(mouseY, { stiffness: 50, damping: 10 }),
    [0, 1],
    [-3, 3]
  );

  const handleMouseMove = (event: React.MouseEvent) => {
    const { currentTarget, clientX, clientY } = event;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();

    const xPos = (clientX - left) / width;
    const yPos = (clientY - top) / height;

    mouseX.set(xPos);
    mouseY.set(yPos);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative flex h-96 flex-col justify-end overflow-hidden rounded-card bg-theme grayscale transition-filter duration-300 hover:grayscale-0"
    >
      <m.div
        style={{
          x: backgroundX,
          y: backgroundY
        }}
        className="-inset-5 absolute bg-[url(/images/hero.webp)] bg-center bg-cover bg-no-repeat"
      />
      <div className="relative flex flex-wrap items-end justify-between gap-4 bg-gradient-to-t from-black/70 p-5">
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
