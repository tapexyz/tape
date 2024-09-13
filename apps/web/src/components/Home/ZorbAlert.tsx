import { STATIC_ASSETS, TAPE_APP_NAME } from "@tape.xyz/constants";
import { imageCdn } from "@tape.xyz/generic";
import { Button } from "@tape.xyz/ui";
import Link from "next/link";

const ZorbAlert = () => {
  return (
    <div className="tape-border relative flex h-[350px] ultrawide:h-[400px] w-[300px] flex-none overflow-hidden rounded-large">
      <div className="absolute inset-0 z-[1] h-full w-full bg-gradient-to-b from-transparent via-brand-500/90 to-brand-500" />
      <img
        src={imageCdn(`${STATIC_ASSETS}/images/zorb.png`, "SQUARE")}
        className="absolute inset-0 size-full object-cover"
        alt="cover"
      />
      <div className="relative z-[2] flex h-full flex-col justify-end space-y-4 p-4 ultrawide:p-8 text-left text-white md:p-6">
        <div className="font-bold text-3xl">
          Mint your free {TAPE_APP_NAME} Zorb!
        </div>
        <div className="flex">
          <Link href="/zorb" target="_blank">
            <Button>Mint</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ZorbAlert;
