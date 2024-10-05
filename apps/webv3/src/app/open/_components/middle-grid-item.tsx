"use client";

import { STATIC_ASSETS } from "@tape.xyz/constants";
import { Morph } from "@tape.xyz/winder";
import { useDebounce } from "@uidotdev/usehooks";
import { useHover } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export const MiddleGridItem = () => {
  const [ref, hovering] = useHover();
  const isHovering = useDebounce(hovering, 100);

  return (
    <Link
      ref={ref}
      href="/"
      className="col-span-2 row-span-1 flex w-full justify-center border-custom border-y px-10 py-10 hover:bg-card/30 lg:py-14"
    >
      <div className="relative">
        <motion.img
          initial={{ x: 0, scale: 0.8 }}
          animate={{ x: 90, scale: 1 }}
          transition={{ delay: 0, bounce: 0, duration: 0.4, type: "spring" }}
          src={`${STATIC_ASSETS}/images/winder/cape.webp`}
          className="h-32 w-28 object-cover"
          alt="cape"
          height="100"
          width="100"
          loading="eager"
          draggable={false}
          layout="position"
        />
        <div className="absolute top-0 right-0">
          <AnimatePresence mode="popLayout">
            <motion.span
              initial={{ y: 20, x: 0, opacity: 0 }}
              animate={{ y: -10, x: -40, opacity: 1 }}
              exit={{ y: 20, opacity: 0, transition: { duration: 0.1 } }}
              transition={{
                delay: 0.2
              }}
              className="inline-block overflow-hidden whitespace-nowrap rounded-full border border-custom bg-card px-4 py-1.5 text-sm"
            >
              <Morph>
                {isHovering ? "←  Back to Tape" : "Tape by the numbers"}
              </Morph>
            </motion.span>
          </AnimatePresence>
          <motion.span
            initial={{ y: 20, x: 0, opacity: 0 }}
            animate={{ y: -10, x: -40, opacity: 1 }}
            exit={{ y: 20, opacity: 0, transition: { duration: 0.1 } }}
            transition={{
              delay: 0.1
            }}
            className="-right-[3px] absolute bottom-0 size-2.5 rounded-full border border-custom bg-card"
          />
          <motion.span
            initial={{ y: 20, x: 0, opacity: 0 }}
            animate={{ y: -10, x: -40, opacity: 1 }}
            exit={{ y: 20, opacity: 0, transition: { duration: 0.1 } }}
            transition={{
              delay: 0.1
            }}
            className="-right-[10px] -bottom-1 absolute size-1.5 rounded-full border border-custom bg-card"
          />
        </div>
      </div>
    </Link>
  );
};
