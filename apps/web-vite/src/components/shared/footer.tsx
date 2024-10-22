import { Link } from "@tanstack/react-router";
import { Button, DiscordLogo, XLogo } from "@tape.xyz/winder";
import { Logo } from "./header";

const items = [
  {
    label: "Brand Kit",
    url: "https://tape.xyz/winder"
  },
  {
    label: "Github",
    url: "https://github.com/tapexyz"
  },
  {
    label: "Thanks",
    url: "https://tape.xyz/thanks"
  },
  {
    label: "Terms",
    url: "https://tape.xyz/terms"
  },
  {
    label: "Privacy",
    url: "https://tape.xyz/privacy"
  }
];

const List = () => {
  return (
    <ul className="flex list-none flex-wrap items-center gap-2 font-medium">
      {items.map((item) => (
        <a href={item.url} target="_blank" key={item.label} rel="noreferrer">
          <li className="whitespace-nowrap rounded-custom px-3 py-1 transition-colors hover:bg-secondary">
            {item.label}
          </li>
        </a>
      ))}
    </ul>
  );
};

export const Footer = () => {
  return (
    <footer className="flex flex-wrap justify-between gap-5 px-5 py-[26px]">
      <div className="flex gap-6">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex items-center space-x-3">
          <a href="/x" target="_blank" rel="noreferrer">
            <XLogo
              className="size-6 text-muted transition-colors hover:text-primary"
              weight="fill"
            />
          </a>
          <a href="/discord" target="_blank" rel="noreferrer">
            <DiscordLogo
              className="size-6 text-muted transition-colors hover:text-primary"
              weight="fill"
            />
          </a>
        </div>
      </div>
      <List />
      <Button variant="secondary">
        <span className="flex items-center space-x-[10px]">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2A59FF]" />
            <span className="relative inline-flex size-2 rounded-full bg-[#2A59FF] opacity-75" />
          </span>
          <span>All systems normal</span>
        </span>
      </Button>
    </footer>
  );
};
