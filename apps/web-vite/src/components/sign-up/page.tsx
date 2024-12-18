import { useCookieStore } from "@/store/cookie";
import { Link, useNavigate } from "@tanstack/react-router";
import { Authenticate } from "../shared/auth/authenticate";
import { ConnectWallet } from "../shared/auth/connect-wallet";

export const SignUpPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useCookieStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    navigate({ to: "/" });
    return null;
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="mb-1 font-serif text-2xl">Create your account</h2>
        <p className="text-muted text-sm">
          Please fill in the details to get started.
        </p>
      </div>
      {/* <AuthProviders />
      <div className="my-4 flex items-center space-x-4">
        <div className="h-px flex-1 bg-secondary" />
        <span className="text-muted text-sm">or</span>
        <div className="h-px flex-1 bg-secondary" />
      </div> */}
      <ConnectWallet />

      <div className="my-6">
        <Authenticate />
      </div>

      <div className="mb-4 text-muted text-xs">
        Already have an account?{" "}
        <Link
          to="/sign-in"
          className="underline underline-offset-3 transition-colors hover:text-primary"
        >
          Sign in
        </Link>
      </div>
    </>
  );
};
