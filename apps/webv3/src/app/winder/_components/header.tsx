"use client";

import { ThemeSwitcherExpanded } from "@tape.xyz/winder";

export const Header = () => {
  return (
    <nav className="sticky top-0 z-10 flex h-[100px] items-center justify-between border-border border-b bg-background p-6 md:border-x">
      <a href="/winder">
        <h1 className="font-semibold font-serif text-2xl">tape</h1>
        <span className="text-muted text-sm">brand & design system</span>
      </a>
      <ThemeSwitcherExpanded id="winder-header" />
    </nav>
  );
};
