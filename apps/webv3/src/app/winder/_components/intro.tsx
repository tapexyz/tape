import { motion } from "framer-motion";
import { IntroSvg } from "./intro-svg";

const title = "Winder";

export const IntroSection = () => {
  return (
    <section className="relative grid aspect-[16/6] place-items-center space-y-4 rounded-card border border-primary/20 border-dashed p-6">
      <div className="absolute inset-0">
        <IntroSvg />
      </div>

      <div className="relative mx-[40%]">
        <span className="truncate font-bold font-serif text-3xl lg:text-5xl">
          {title.split("").map((word, index) => (
            <motion.span
              key={word}
              className="inline-block"
              drag
              dragSnapToOrigin
              dragMomentum={false}
              dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
              dragTransition={{
                bounceDamping: 30,
                bounceStiffness: 600
              }}
              initial={{ opacity: 0, translateY: "50%", rotateX: -45 }}
              animate={{ opacity: 1, translateY: 0, rotateX: 0 }}
              transition={{
                type: "spring",
                bounce: 0,
                duration: 0.3,
                delay: index * 0.05
              }}
            >
              {word}
            </motion.span>
          ))}
        </span>
      </div>
    </section>
  );
};
