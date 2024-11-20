import { Link } from "@tanstack/react-router";
import { ThemeSwitcherExpanded } from "@tape.xyz/winder";
import { useWindowScroll } from "@uidotdev/usehooks";

export const Header = () => {
  const [, scrollTo] = useWindowScroll();

  return (
    <nav className="sticky top-0 z-50 flex h-[100px] items-center justify-between border-custom border-b bg-site/60 p-6 backdrop-blur-md md:border-x">
      <Link
        to="/winder"
        onClick={() => scrollTo({ left: 0, top: 0, behavior: "smooth" })}
      >
        <h1 className="font-semibold font-serif text-xl leading-5">Winder</h1>
        <span className="text-muted text-sm">brand & design system</span>
      </Link>
      <ThemeSwitcherExpanded id="winder-header" />
    </nav>
  );
};
