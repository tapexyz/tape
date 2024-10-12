import { motion } from "framer-motion";
import { IntroAnimation } from "./intro-animation";

const title = "Winder";

export const IntroSection = () => {
  return (
    <section className="relative grid aspect-[16/6] place-items-center p-6">
      <div className="absolute inset-0">
        <IntroAnimation />
      </div>

      <div className="relative mx-[40%]">
        <span className="truncate font-bold font-serif text-3xl lg:text-5xl">
          {title.split("").map((char, index) => (
            <motion.span
              key={char}
              className="inline-block"
              drag
              dragSnapToOrigin
              dragMomentum={false}
              dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
              dragTransition={{
                bounceDamping: 20,
                bounceStiffness: 600
              }}
              initial={{ opacity: 0, translateY: "50%", rotateX: -45 }}
              animate={{ opacity: 1, translateY: 0, rotateX: 0 }}
              transition={{
                type: "spring",
                bounce: 0,
                duration: 1,
                delay: index * 0.1
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      </div>
    </section>
  );
};
