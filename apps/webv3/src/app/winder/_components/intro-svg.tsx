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
        bounceDamping: 30,
        bounceStiffness: 600
      }}
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        y: 0,
        opacity: 1,
        rotateZ: [0, -35, 0],
        transition: {
          duration: 12,
          ease: "linear",
          repeatType: "loop",
          repeat: Number.POSITIVE_INFINITY,
          opacity: {
            bounce: 0,
            duration: 0.4,
            type: "spring"
          },
          y: {
            bounce: 0,
            duration: 0.4,
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
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <motion.rect
      className="select-none"
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      transition={{ type: "spring", bounce: 0 }}
      x="625.173"
      y="115.84"
      width="125"
      height="140"
      transform="rotate(-20.8577 625.173 115.84)"
      fill="url(#pattern0_154_56)"
    />
    <AnimatedRect
      x="813"
      y="156"
      width="49"
      height="41"
      fill="url(#pattern1_154_56)"
    />
    <AnimatedRect
      x="786"
      y="226"
      width="52"
      height="32"
      fill="url(#pattern2_154_56)"
    />
    <AnimatedRect
      x="771"
      y="59"
      width="28"
      height="25"
      fill="url(#pattern3_154_56)"
    />
    <AnimatedRect
      x="635"
      y="43"
      width="37"
      height="32"
      fill="url(#pattern4_154_56)"
    />
    <AnimatedRect
      x="802"
      y="104"
      width="41"
      height="27"
      fill="url(#pattern5_154_56)"
    />
    <AnimatedRect
      x="727"
      y="246.826"
      width="26.5009"
      height="36.1704"
      transform="rotate(-17.1751 727 246.826)"
      fill="url(#pattern6_154_56)"
    />
    <AnimatedRect
      x="709"
      y="30"
      width="32"
      height="41"
      fill="url(#pattern7_154_56)"
    />
    <AnimatedRect
      x="581"
      y="82"
      width="39"
      height="23"
      fill="url(#pattern8_154_56)"
    />
    <motion.rect
      className="select-none"
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      transition={{ type: "spring", bounce: 0 }}
      x="175.632"
      y="71.3555"
      width="111"
      height="123"
      transform="rotate(17.1725 175.632 71.3555)"
      fill="url(#pattern9_154_56)"
    />
    <AnimatedRect
      x="65"
      y="114"
      width="49"
      height="41"
      fill="url(#pattern10_154_56)"
    />
    <AnimatedRect
      x="65"
      y="177"
      width="49"
      height="31"
      fill="url(#pattern11_154_56)"
    />
    <AnimatedRect
      x="94"
      y="69"
      width="47"
      height="28"
      fill="url(#pattern12_154_56)"
    />
    <AnimatedRect
      x="163"
      y="246"
      width="21"
      height="19"
      fill="url(#pattern13_154_56)"
    />
    <AnimatedRect
      x="217"
      y="238"
      width="37"
      height="31"
      fill="url(#pattern14_154_56)"
    />
    <AnimatedRect
      x="278"
      y="208"
      width="34"
      height="49"
      fill="url(#pattern15_154_56)"
    />
    <AnimatedRect
      x="326"
      y="203"
      width="17"
      height="18"
      fill="url(#pattern16_154_56)"
    />
    <AnimatedRect
      x="100"
      y="212"
      width="55"
      height="42"
      fill="url(#pattern17_154_56)"
    />
    <defs>
      <pattern
        id="pattern0_154_56"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image0_154_56"
          transform="matrix(0.00224 0 0 0.002 -0.06 0)"
        />
      </pattern>
      <pattern
        id="pattern1_154_56"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image1_154_56"
          transform="matrix(0.002 0 0 0.00239024 0 -0.097561)"
        />
      </pattern>
      <pattern
        id="pattern2_154_56"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image2_154_56"
          transform="matrix(0.00609292 0 0 0.00990099 -0.00266565 0)"
        />
      </pattern>
      <pattern
        id="pattern3_154_56"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image3_154_56"
          transform="matrix(0.0186012 0 0 0.0208333 -0.0208333 0)"
        />
      </pattern>
      <pattern
        id="pattern4_154_56"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image4_154_56"
          transform="matrix(0.00686401 0 0 0.00793651 -0.0148005 0)"
        />
      </pattern>
      <pattern
        id="pattern5_154_56"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image5_154_56"
          transform="matrix(0.00671976 0 0 0.0102041 -0.0140617 0)"
        />
      </pattern>
      <pattern
        id="pattern6_154_56"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image6_154_56"
          transform="matrix(0.00272975 0 0 0.002 -0.182439 0)"
        />
      </pattern>
      <pattern
        id="pattern7_154_56"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image7_154_56"
          transform="matrix(0.0025625 0 0 0.002 -0.140625 0)"
        />
      </pattern>
      <pattern
        id="pattern8_154_56"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image8_154_56"
          transform="matrix(0.00242131 0 0 0.0041057 0 -0.73992)"
        />
      </pattern>
      <pattern
        id="pattern9_154_56"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image9_154_56"
          transform="matrix(0.00310559 0 0 0.00280261 0 -0.0282912)"
        />
      </pattern>
      <pattern
        id="pattern10_154_56"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image1_154_56"
          transform="matrix(0.002 0 0 0.00239024 0 -0.097561)"
        />
      </pattern>
      <pattern
        id="pattern11_154_56"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image10_154_56"
          transform="matrix(0.00666667 0 0 0.0105376 0 -0.0268817)"
        />
      </pattern>
      <pattern
        id="pattern12_154_56"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image11_154_56"
          transform="matrix(0.00606061 0 0 0.0101732 0 -0.0137446)"
        />
      </pattern>
      <pattern
        id="pattern13_154_56"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image12_154_56"
          transform="matrix(0.0188492 0 0 0.0208333 -0.0277778 0)"
        />
      </pattern>
      <pattern
        id="pattern14_154_56"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image4_154_56"
          transform="matrix(0.00666667 0 0 0.00795699 0 -0.00129032)"
        />
      </pattern>
      <pattern
        id="pattern15_154_56"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image13_154_56"
          transform="matrix(0.000795351 0 0 0.000551876 -0.374886 0)"
        />
      </pattern>
      <pattern
        id="pattern16_154_56"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image14_154_56"
          transform="matrix(0.00230947 0 0 0.00218116 0 -0.129266)"
        />
      </pattern>
      <pattern
        id="pattern17_154_56"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image15_154_56"
          transform="matrix(0.002 0 0 0.00261905 0 -0.154762)"
        />
      </pattern>

      <image
        id="image0_154_56"
        width="500"
        height="500"
        xlinkHref={`${STATIC_ASSETS}/images/winder/cape-point.webp`}
      />
      <image
        id="image1_154_56"
        width="500"
        height="500"
        xlinkHref={`${STATIC_ASSETS}/images/winder/cassette.webp`}
      />
      <image
        id="image2_154_56"
        width="165"
        height="101"
        xlinkHref={`${STATIC_ASSETS}/images/winder/lego-1.webp`}
      />
      <image
        id="image3_154_56"
        width="56"
        height="48"
        xlinkHref={`${STATIC_ASSETS}/images/winder/lego-2.webp`}
      />
      <image
        id="image4_154_56"
        width="150"
        height="126"
        xlinkHref={`${STATIC_ASSETS}/images/winder/lego-3.webp`}
      />
      <image
        id="image5_154_56"
        width="153"
        height="98"
        xlinkHref={`${STATIC_ASSETS}/images/winder/lego-4.webp`}
      />
      <image
        id="image6_154_56"
        width="500"
        height="500"
        xlinkHref={`${STATIC_ASSETS}/images/winder/cape-young.webp`}
      />
      <image
        id="image7_154_56"
        width="500"
        height="500"
        xlinkHref={`${STATIC_ASSETS}/images/winder/cape-leaf.webp`}
      />
      <image
        id="image8_154_56"
        width="413"
        height="604"
        xlinkHref={`${STATIC_ASSETS}/images/winder/joy-stick.webp`}
      />
      <image
        id="image9_154_56"
        width="322"
        height="377"
        xlinkHref={`${STATIC_ASSETS}/images/winder/cape.webp`}
      />
      <image
        id="image10_154_56"
        width="150"
        height="100"
        xlinkHref={`${STATIC_ASSETS}/images/winder/lego-5.webp`}
      />
      <image
        id="image11_154_56"
        width="165"
        height="101"
        xlinkHref={`${STATIC_ASSETS}/images/winder/lego-6.webp`}
      />
      <image
        id="image12_154_56"
        width="56"
        height="48"
        xlinkHref={`${STATIC_ASSETS}/images/winder/lego-7.webp`}
      />
      <image
        id="image13_154_56"
        width="2200"
        height="1812"
        xlinkHref={`${STATIC_ASSETS}/images/winder/console-hat.webp`}
      />
      <image
        id="image14_154_56"
        width="433"
        height="577"
        xlinkHref={`${STATIC_ASSETS}/images/winder/heart.webp`}
      />
      <image
        id="image15_154_56"
        width="500"
        height="500"
        xlinkHref={`${STATIC_ASSETS}/images/winder/keyboard.webp`}
      />
    </defs>
  </svg>
);
