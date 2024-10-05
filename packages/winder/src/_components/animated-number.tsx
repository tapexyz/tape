"use client";

import {
  type SpringOptions,
  motion,
  useSpring,
  useTransform
} from "framer-motion";
import { useEffect } from "react";
import { tw } from "../tw";

type AnimatedNumber = {
  value: number;
  className?: string;
  springOptions?: SpringOptions;
};

export const AnimatedNumber = (props: AnimatedNumber) => {
  const { value, className, springOptions } = props;

  const spring = useSpring(value, springOptions);
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString("en-US")
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span className={tw("tabular-nums", className)}>
      {display}
    </motion.span>
  );
};
