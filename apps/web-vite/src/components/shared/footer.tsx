import { Link } from "@tanstack/react-router";
import { TAPE_X_HANDLE } from "@tape.xyz/constants";
import { Button, DiscordLogo, XLogo } from "@tape.xyz/winder";
import { m } from "framer-motion";
import { useState } from "react";
import { Logo } from "./header";

const xLink = `https://x.com/${TAPE_X_HANDLE}`;
const discordLink = "https://discord.com/invite/lenstube-980882088783913010";

const otherLinks = [
  {
    label: "Brand",
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
  const [hoverId, setHoverId] = useState("");
  return (
    <ul className="flex list-none flex-wrap items-center font-medium">
      {otherLinks.map((l) => (
        <a href={l.url} target="_blank" key={l.label} rel="noreferrer">
          <li
            className="relative whitespace-nowrap px-4 py-1"
            onMouseLeave={() => setHoverId("")}
            onFocus={() => setHoverId(l.label)}
            onMouseEnter={() => setHoverId(l.label)}
          >
            {hoverId === l.label ? (
              <m.span
                key={l.label}
                layoutId="footer-links"
                transition={{ duration: 0.2, bounce: 0, type: "spring" }}
                className="absolute inset-0 rounded-custom bg-secondary"
              />
            ) : null}
            <span className="relative">{l.label}</span>
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
          <a href={xLink} target="_blank" rel="noreferrer">
            <XLogo
              className="size-6 text-muted transition-colors hover:text-primary"
              weight="fill"
            />
          </a>
          <a href={discordLink} target="_blank" rel="noreferrer">
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
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2A59FF]" />
            <span className="relative inline-flex size-1.5 rounded-full bg-[#2A59FF] opacity-75" />
          </span>
          <span>All systems normal</span>
        </span>
      </Button>
    </footer>
  );
};
