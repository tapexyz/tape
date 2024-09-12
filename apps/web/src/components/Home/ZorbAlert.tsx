import { STATIC_ASSETS, TAPE_APP_NAME } from "@tape.xyz/constants";
import { imageCdn } from "@tape.xyz/generic";
import { Button } from "@tape.xyz/ui";
import Link from "next/link";

const ZorbAlert = () => {
  return (
    <div className="tape-border rounded-large ultrawide:h-[400px] relative flex h-[350px] w-[300px] flex-none overflow-hidden">
      <div className="to-brand-500 via-brand-500/90 absolute inset-0 z-[1] h-full w-full bg-gradient-to-b from-transparent" />
      <img
        src={imageCdn(`${STATIC_ASSETS}/images/zorb.png`, "SQUARE")}
        className="absolute inset-0 size-full object-cover"
        alt="cover"
      />
      <div className="ultrawide:p-8 relative z-[2] flex h-full flex-col justify-end space-y-4 p-4 text-left text-white md:p-6">
        <div className="text-3xl font-bold">
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
