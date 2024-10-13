import { m } from "framer-motion";
import { Suspense, lazy } from "react";

const title = "Winder";

const IntroAnimation = lazy(() =>
  import("./intro-animation").then((m) => ({
    default: m.IntroAnimation
  }))
);

export const IntroSection = () => {
  return (
    <section className="relative grid aspect-[16/6] place-items-center p-6">
      <div className="absolute inset-0">
        <Suspense>
          <IntroAnimation />
        </Suspense>
      </div>

      <div className="relative mx-[40%]">
        <span className="truncate font-bold font-serif text-3xl lg:text-5xl">
          {title.split("").map((char, index) => (
            <m.span
              key={char}
              className="inline-block"
              drag
              dragSnapToOrigin
              dragMomentum={false}
              dragConstraints={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
                delay: index * 0.05
              }}
            >
              {char}
            </m.span>
          ))}
        </span>
      </div>
    </section>
  );
};
