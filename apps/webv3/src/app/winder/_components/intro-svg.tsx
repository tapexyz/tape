import { STATIC_ASSETS } from "@tape.xyz/constants";
import { type MotionProps, motion } from "framer-motion";
import type { SVGProps } from "react";

const AnimatedRect = (props: SVGProps<SVGRectElement> & MotionProps) => {
  return (
    <motion.rect
      className="select-none will-change-transform"
      drag
      dragSnapToOrigin
      dragMomentum={false}
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragTransition={{
        bounceDamping: 20,
        bounceStiffness: 600
      }}
      animate={{
        x: 0,
        y: 0,
        opacity: 1,
        rotateZ: [0, -35, 0],
        transition: {
          duration: 4,
          ease: "linear",
          repeatType: "loop",
          repeat: Number.POSITIVE_INFINITY,
          opacity: {
            bounce: 0,
            duration: 1,
            type: "spring"
          },
          x: {
            bounce: 0,
            duration: 1,
            type: "spring"
          },
          y: {
            bounce: 0,
            duration: 1,
            type: "spring"
          }
        }
      }}
      {...props}
    />
  );
};

export const IntroSvg = () => (
  <svg
    className="size-full overflow-visible"
    viewBox="0 0 932 312"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.rect
      className="select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "spring", bounce: 0, duration: 0.2 }}
      x="625.173"
      y="115.84"
      width="125"
      height="140"
      transform="rotate(-20.8577 625.173 115.84)"
      fill="url(#pattern0)"
    />
    <AnimatedRect
      x="813"
      y="156"
      width="49"
      height="41"
      fill="url(#pattern1)"
      initial={{
        opacity: 0,
        y: 0,
        x: 50
      }}
    />
    <AnimatedRect
      x="786"
      y="226"
      width="52"
      height="32"
      fill="url(#pattern2)"
      initial={{
        opacity: 0,
        x: 50,
        y: 50
      }}
    />
    <AnimatedRect
      x="771"
      y="59"
      width="28"
      height="25"
      fill="url(#pattern3)"
      initial={{
        opacity: 0,
        x: 50,
        y: -50
      }}
    />
    <AnimatedRect
      x="635"
      y="43"
      width="37"
      height="32"
      fill="url(#pattern4)"
      initial={{
        opacity: 0,
        x: 0,
        y: -50
      }}
    />
    <AnimatedRect
      x="802"
      y="104"
      width="41"
      height="27"
      fill="url(#pattern5)"
      initial={{
        opacity: 0,
        x: 50,
        y: -50
      }}
    />
    <AnimatedRect
      x="727"
      y="246.826"
      width="26.5"
      height="36.17"
      transform="rotate(-17.1751 727 246.826)"
      fill="url(#pattern6)"
      initial={{
        opacity: 0,
        x: 0,
        y: 50
      }}
    />
    <AnimatedRect
      x="709"
      y="30"
      width="32"
      height="41"
      fill="url(#pattern7)"
      initial={{
        opacity: 0,
        x: 0,
        y: -50
      }}
    />
    <AnimatedRect
      x="581"
      y="82"
      width="39"
      height="23"
      fill="url(#pattern8)"
      initial={{
        opacity: 0,
        x: -50,
        y: -50
      }}
    />
    <motion.rect
      className="select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "spring", bounce: 0, duration: 0.2 }}
      x="175.632"
      y="71.3555"
      width="111"
      height="123"
      transform="rotate(17.1725 175.632 71.3555)"
      fill="url(#pattern9)"
    />
    <AnimatedRect
      x="65"
      y="114"
      width="49"
      height="41"
      fill="url(#pattern10)"
      initial={{
        opacity: 0,
        x: -50,
        y: 0
      }}
    />
    <AnimatedRect
      x="65"
      y="177"
      width="49"
      height="31"
      fill="url(#pattern11)"
      initial={{
        opacity: 0,
        x: -50,
        y: 0
      }}
    />
    <AnimatedRect
      x="94"
      y="69"
      width="47"
      height="28"
      fill="url(#pattern12)"
      initial={{
        opacity: 0,
        x: -50,
        y: -50
      }}
    />
    <AnimatedRect
      x="163"
      y="246"
      width="21"
      height="19"
      fill="url(#pattern13)"
      initial={{
        opacity: 0,
        x: 0,
        y: 50
      }}
    />
    <AnimatedRect
      x="217"
      y="238"
      width="37"
      height="31"
      fill="url(#pattern14)"
      initial={{
        opacity: 0,
        x: 50,
        y: 50
      }}
    />
    <AnimatedRect
      x="278"
      y="208"
      width="34"
      height="49"
      fill="url(#pattern15)"
      initial={{
        opacity: 0,
        x: 50,
        y: 50
      }}
    />
    <AnimatedRect
      x="326"
      y="203"
      width="17"
      height="18"
      fill="url(#pattern16)"
      initial={{
        opacity: 0,
        x: 50,
        y: 50
      }}
    />
    <AnimatedRect
      x="100"
      y="212"
      width="55"
      height="42"
      fill="url(#pattern17)"
      initial={{
        opacity: 0,
        x: -50,
        y: 50
      }}
    />
    <defs>
      <pattern
        id="pattern0"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image0"
          transform="matrix(0.00224 0 0 0.002 -0.06 0)"
        />
      </pattern>
      <pattern
        id="pattern1"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image1"
          transform="matrix(0.002 0 0 0.00239 0 -0.09756)"
        />
      </pattern>
      <pattern
        id="pattern2"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image2"
          transform="matrix(0.00609 0 0 0.0099 -0.00267 0)"
        />
      </pattern>
      <pattern
        id="pattern3"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image3"
          transform="matrix(0.0186 0 0 0.02083 -0.02083 0)"
        />
      </pattern>
      <pattern
        id="pattern4"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image4"
          transform="matrix(0.00686 0 0 0.00794 -0.0148 0)"
        />
      </pattern>
      <pattern
        id="pattern5"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image5"
          transform="matrix(0.00672 0 0 0.0102 -0.01406 0)"
        />
      </pattern>
      <pattern
        id="pattern6"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image6"
          transform="matrix(0.00273 0 0 0.002 -0.18244 0)"
        />
      </pattern>
      <pattern
        id="pattern7"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image7"
          transform="matrix(0.00256 0 0 0.002 -0.14063 0)"
        />
      </pattern>
      <pattern
        id="pattern8"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image8"
          transform="matrix(0.00242 0 0 0.0041 0 -0.73992)"
        />
      </pattern>
      <pattern
        id="pattern9"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image9"
          transform="matrix(0.00311 0 0 0.0028 0 -0.02829)"
        />
      </pattern>
      <pattern
        id="pattern10"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image1"
          transform="matrix(0.002 0 0 0.00239 0 -0.09756)"
        />
      </pattern>
      <pattern
        id="pattern11"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image10"
          transform="matrix(0.00667 0 0 0.01054 0 -0.02688)"
        />
      </pattern>
      <pattern
        id="pattern12"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image11"
          transform="matrix(0.00606 0 0 0.01017 0 -0.01374)"
        />
      </pattern>
      <pattern
        id="pattern13"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image12"
          transform="matrix(0.01885 0 0 0.02083 -0.02778 0)"
        />
      </pattern>
      <pattern
        id="pattern14"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image4"
          transform="matrix(0.00667 0 0 0.00796 0 -0.00129)"
        />
      </pattern>
      <pattern
        id="pattern15"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image13"
          transform="matrix(0.0008 0 0 0.00055 -0.37489 0)"
        />
      </pattern>
      <pattern
        id="pattern16"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image14"
          transform="matrix(0.00231 0 0 0.00218 0 -0.12927)"
        />
      </pattern>
      <pattern
        id="pattern17"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image15"
          transform="matrix(0.002 0 0 0.00262 0 -0.15476)"
        />
      </pattern>
      <image
        id="image0"
        width="500"
        height="500"
        xlinkHref={`${STATIC_ASSETS}/images/winder/cape-point.webp`}
      />
      <image
        id="image1"
        width="500"
        height="500"
        xlinkHref={`${STATIC_ASSETS}/images/winder/cassette.webp`}
      />
      <image
        id="image2"
        width="165"
        height="101"
        xlinkHref={`${STATIC_ASSETS}/images/winder/lego-1.webp`}
      />
      <image
        id="image3"
        width="56"
        height="48"
        xlinkHref={`${STATIC_ASSETS}/images/winder/lego-2.webp`}
      />
      <image
        id="image4"
        width="150"
        height="126"
        xlinkHref={`${STATIC_ASSETS}/images/winder/lego-3.webp`}
      />
      <image
        id="image5"
        width="153"
        height="98"
        xlinkHref={`${STATIC_ASSETS}/images/winder/lego-4.webp`}
      />
      <image
        id="image6"
        width="500"
        height="500"
        xlinkHref={`${STATIC_ASSETS}/images/winder/cape-young.webp`}
      />
      <image
        id="image7"
        width="500"
        height="500"
        xlinkHref={`${STATIC_ASSETS}/images/winder/cape-leaf.webp`}
      />
      <image
        id="image8"
        width="413"
        height="604"
        xlinkHref={`${STATIC_ASSETS}/images/winder/joy-stick.webp`}
      />
      <image
        id="image9"
        width="322"
        height="377"
        xlinkHref={`${STATIC_ASSETS}/images/winder/cape.webp`}
      />
      <image
        id="image10"
        width="150"
        height="100"
        xlinkHref={`${STATIC_ASSETS}/images/winder/lego-5.webp`}
      />
      <image
        id="image11"
        width="165"
        height="101"
        xlinkHref={`${STATIC_ASSETS}/images/winder/lego-6.webp`}
      />
      <image
        id="image12"
        width="56"
        height="48"
        xlinkHref={`${STATIC_ASSETS}/images/winder/lego-7.webp`}
      />
      <image
        id="image13"
        width="2200"
        height="1812"
        xlinkHref={`${STATIC_ASSETS}/images/winder/console-hat.webp`}
      />
      <image
        id="image14"
        width="433"
        height="577"
        xlinkHref={`${STATIC_ASSETS}/images/winder/heart.webp`}
      />
      <image
        id="image15"
        width="500"
        height="500"
        xlinkHref={`${STATIC_ASSETS}/images/winder/keyboard.webp`}
      />
    </defs>
  </svg>
);
