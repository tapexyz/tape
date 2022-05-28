import type { ReactNode } from "react";
import { LoaderIcon } from "react-hot-toast";
import { useIsClient } from "usehooks-ts";

type IsBrowserProps = {
  children: ReactNode;
};

export const IsBrowser = ({ children }: IsBrowserProps) => {
  const isClient = useIsClient();

  if (!isClient) {
    return (
      <div className="grid w-full h-screen place-items-center">
        <LoaderIcon className="!h-5 !w-5" />
      </div>
    );
  }

  return <>{children}</>;
};
