import { Link } from "@tanstack/react-router";

export const Links = () => {
  return (
    <div className="flex items-center space-x-2.5 text-muted text-xs [&>a]:transition-colors [&>a]:hover:text-primary">
      <span>&copy; {new Date().getFullYear()} Tape</span>
      <div className="h-3 w-[1px] rounded-sm bg-primary/10" />
      <Link to="/privacy">Privacy</Link>
      <div className="h-3 w-[1px] rounded-sm bg-primary/10" />
      <Link to="/terms">Terms</Link>
    </div>
  );
};
