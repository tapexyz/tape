import { Logo } from "../header/logo";
import { Links } from "./links";
import { NetworkState } from "./network";
import { Socials } from "./socials";
import { Status } from "./status";

export const Footer = () => {
  return (
    <footer className="flex flex-wrap justify-between gap-5 px-5 py-[26px] md:flex-nowrap">
      <div className="flex w-1/3 gap-6">
        <Logo />
        <Socials />
      </div>

      <Links />

      <div className="hidden w-1/3 justify-end gap-6 lg:flex">
        <NetworkState />
        <Status />
      </div>
    </footer>
  );
};
