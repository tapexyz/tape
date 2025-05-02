import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { IS_DEVELOPMENT } from "@tape.xyz/constants";
import { m } from "motion/react";

import { useMemo } from "react";

const Devtools = () => {
  if (!IS_DEVELOPMENT) return null;

  const memoizedReactQueryDevtools = useMemo(() => <ReactQueryDevtools />, []);

  return (
    <>
      <m.div
        drag
        dragMomentum={false}
        className="fixed right-2.5 bottom-20 z-50 rounded-full border border-custom bg-primary px-6 py-2 text-center font-semibold text-sm text-theme"
      >
        <span className="block md:hidden">sm</span>
        <span className="hidden md:block lg:hidden">md</span>
        <span className="hidden lg:block xl:hidden">lg</span>
        <span className="hidden xl:block 2xl:hidden">xl</span>
        <span className="hidden 2xl:block">2xl</span>
      </m.div>
      <TanStackRouterDevtools />
      {memoizedReactQueryDevtools}
    </>
  );
};

export { Devtools };
