import { EVENTS } from "@tape.xyz/generic";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect } from "react";

import Logo from "@/components/Common/Logo";
import MetaTags from "@/components/Common/MetaTags";
import CardBorders from "@/components/Login/CardBorders";
import Connectors from "@/components/Login/Connectors";
import useSw from "@/hooks/useSw";

const BackgroundComets = dynamic(
  () => import("@/components/Login/BackgroundComets"),
);

const Login = () => {
  const { addEventToQueue } = useSw();
  useEffect(() => {
    addEventToQueue(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.LOGIN });
  }, []);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#FAFAFA] dark:bg-black">
      <MetaTags title="Login" />
      <div className="grid h-full w-full place-items-center">
        <BackgroundComets />

        <div className="fixed top-0 z-10 flex h-16 w-full items-center justify-between laptop:p-6 p-4 ultrawide:p-8">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <div className="tape-border container relative z-10 mx-auto max-w-md bg-white bg-opacity-50 p-10 backdrop-blur-sm dark:bg-inherit">
          <CardBorders />
          <div className="mb-6">
            <h2 className="font-bold text-2xl">Welcome back</h2>
            <p>Discover the new era of media sharing with Tape.</p>
          </div>
          <Connectors />
        </div>
      </div>
    </div>
  );
};

export default Login;
