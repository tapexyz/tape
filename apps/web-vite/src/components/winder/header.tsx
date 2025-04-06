import { Link } from "@tanstack/react-router";
import { ThemeSwitcherExpanded } from "@tape.xyz/winder";
import { useCallback } from "react";
import { TapeSvg } from "../shared/tape-svg";

export const Header = () => {
  const scrollToTop = useCallback(() => {
    window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  }, []);

  return (
    <nav className="sticky top-0 z-50 flex h-[100px] items-center justify-between border-custom border-b bg-site/60 p-6 backdrop-blur-md md:border-x">
      <Link to="/" onClick={scrollToTop}>
        <TapeSvg className="h-5 text-primary" />
        <span className="text-muted text-sm">brand & design system</span>
      </Link>
      <ThemeSwitcherExpanded id="winder-header" />
    </nav>
  );
};
