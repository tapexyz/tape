import { STATIC_ASSETS, TAPE_APP_NAME } from "@tape.xyz/constants";
import { Button } from "@tape.xyz/ui";
import Link from "next/link";

const WelcomeAlert = () => {
  return (
    <div className="tape-border relative flex h-[350px] ultrawide:h-[400px] w-[500px] flex-none overflow-hidden rounded-large">
      <div className="absolute inset-0 h-full w-full bg-brand-400" />
      <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-brand-600 to-transparent" />
      <img
        src={`${STATIC_ASSETS}/brand/transparent-bg-large.svg`}
        className="ultrawide:-top-10 -top-20 absolute px-4 ultrawide:px-8 md:px-6"
        alt="cover"
      />
      <div className="relative flex h-full flex-col justify-end space-y-4 p-4 ultrawide:p-8 text-left text-white md:p-6">
        <div className="font-bold text-3xl">Welcome to {TAPE_APP_NAME}</div>
        <p className="max-w-2xl text-sm md:text-md lg:text-lg">
          Discover the new era of media sharing on Lens with {TAPE_APP_NAME}. A
          decentralized, user-centric approach to online media.
        </p>
        <div className="flex gap-3">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAlert;
