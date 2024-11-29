import { useCookieStore } from "@/store/cookie";
import { Link, useNavigate } from "@tanstack/react-router";
import { ConnectWallet } from "./connect-wallet";
import { SignInFrame } from "./frame";

export const SignInPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useCookieStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    navigate({ to: "/" });
    return null;
  }

  return (
    <div className="relative flex h-screen w-screen overflow-hidden">
      <div className="grid h-full w-full place-items-center">
        <div className="container relative mx-auto max-w-sm border border-primary/15 bg-white bg-opacity-50 p-10 backdrop-blur-sm dark:bg-inherit">
          <SignInFrame />
          <div className="mb-6">
            <h2 className="font-serif text-2xl">Welcome back</h2>
            <p className="text-muted text-sm">Please sign in to continue.</p>
          </div>
          <ConnectWallet />
          <div className="mt-6 flex items-center space-x-2.5 text-muted text-xs [&>a]:hover:text-primary">
            <span>&copy; {new Date().getFullYear()} Tape</span>
            <div className="h-3 w-[1px] rounded-sm bg-primary/10" />
            <Link to="/privacy">Privacy</Link>
            <div className="h-3 w-[1px] rounded-sm bg-primary/10" />
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
