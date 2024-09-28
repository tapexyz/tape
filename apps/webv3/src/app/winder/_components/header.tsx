"use client";

import { TapeLink } from "@/components/shared/link";
import { ThemeSwitcherExpanded } from "@tape.xyz/winder";

export const Header = () => {
  return (
    <nav className="sticky top-0 z-10 flex h-[100px] items-center justify-between border-custom border-b bg-site/60 p-6 backdrop-blur-xl md:border-x">
      <TapeLink href="/winder">
        <h1 className="font-semibold font-serif text-2xl">tape</h1>
        <span className="text-muted text-sm">brand & design system</span>
      </TapeLink>
      <ThemeSwitcherExpanded id="winder-header" />
    </nav>
  );
};
