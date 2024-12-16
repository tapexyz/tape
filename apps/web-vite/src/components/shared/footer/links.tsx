import { m } from "motion/react";
import { memo, useState } from "react";

const links = [
  {
    label: "Brand",
    url: "/winder"
  },
  {
    label: "Github",
    url: "https://github.com/tapexyz"
  },
  {
    label: "Thanks",
    url: "/thanks"
  },
  {
    label: "Terms",
    url: "/terms"
  },
  {
    label: "Privacy",
    url: "/privacy"
  }
];

export const Links = memo(() => {
  const [hoverId, setHoverId] = useState("");
  return (
    <ul className="flex list-none flex-wrap items-center font-medium">
      {links.map((l) => (
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
});
