import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { LoaderIcon } from "react-hot-toast";

type IsBrowserProps = {
  children: ReactNode;
};

export const IsBrowser = ({ children }: IsBrowserProps) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (!isBrowser) {
    return (
      <div className="grid h-screen place-items-center">
        <LoaderIcon className="!h-5 !w-5" />
      </div>
    );
  }

  return <>{children}</>;
};
