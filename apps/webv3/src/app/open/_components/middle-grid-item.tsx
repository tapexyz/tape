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
    <Link ref={ref} href="/" className="flex w-full justify-center">
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
          <motion.span
            initial={{ y: 20, x: 0, opacity: 0 }}
            animate={{ y: -10, x: -40, opacity: isHovering ? 0 : 1 }}
            exit={{ y: 20, opacity: 0, transition: { duration: 0.1 } }}
            transition={{
              delay: isHovering ? 0 : 0.2
            }}
            className="-bottom-2.5 absolute right-4 overflow-hidden whitespace-nowrap text-[10px] text-muted"
          >
            00:00 UTC
          </motion.span>
        </div>
      </div>
    </Link>
  );
};
