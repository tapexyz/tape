import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { Spinner, Success, Warning } from "./icons";

export const Button = () => {
  const [state, setState] = useState<"idle" | "loading" | "warning">("idle");

  const getIcon = () => {
    switch (state) {
      case "loading":
        return (
          <motion.span
            key={state}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Spinner className="mr-1.5 size-5" />
          </motion.span>
        );
      case "warning":
        return (
          <motion.span
            key={state}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              x: [0, -2, 2, -2, 2, 0],
              transition: {
                scale: { duration: 0.2 },
                x: { delay: 0.5, duration: 0.3 }
              }
            }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Warning className="mr-1.5 size-5" />
          </motion.span>
        );
      default:
        return (
          <motion.span
            key={state}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Success className="mr-1.5 size-5" />
          </motion.span>
        );
    }
  };

  const onClickBtn = () => {
    setState("loading");
    setTimeout(() => {
      setState("warning");
      setTimeout(() => {
        setState("loading");
        setTimeout(() => {
          setState("idle");
          setTimeout(() => {
            onClickBtn();
          }, 4000);
        }, 1800);
      }, 1800);
    }, 1800);
  };

  const bgColor =
    state === "warning"
      ? "#FFE3E1"
      : state === "loading"
        ? "#E6F4FF"
        : "#DCF4DE";
  const textColor =
    state === "warning"
      ? "#FF424A"
      : state === "loading"
        ? "#40A3EF"
        : "#38C65C";

  return (
    <motion.button
      initial={{
        backgroundColor: bgColor,
        color: textColor
      }}
      animate={{
        backgroundColor: bgColor,
        color: textColor
      }}
      className="flex items-center overflow-hidden rounded-full px-5 py-2.5 font-semibold text-lg"
      onClick={() => onClickBtn()}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {getIcon()}
      </AnimatePresence>

      <div className="flex items-center gap-1">
        <AnimatePresence mode="popLayout" initial={false}>
          {state === "loading" ? (
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ type: "spring", duration: 0.4 }}
            >
              Analyzing
            </motion.span>
          ) : null}
        </AnimatePresence>
        <motion.span
          layout
          transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
        >
          Transaction
        </motion.span>
        <AnimatePresence mode="popLayout" initial={false}>
          {state === "warning" ? (
            <motion.span
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { duration: 0.2 }
              }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              Warning
            </motion.span>
          ) : null}
        </AnimatePresence>
        <AnimatePresence mode="popLayout" initial={false}>
          {state === "idle" ? (
            <motion.span
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { duration: 0.2 }
              }}
              exit={{ opacity: 0, x: 50, transition: { duration: 0.4 } }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              Safe
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.button>
  );
};
