import { STATIC_ASSETS } from "@tape.xyz/constants";
import { Input } from "@tape.xyz/winder";
import { ArrowRight } from "@tape.xyz/winder";
import { Button } from "@tape.xyz/winder";

export const AuthProviders = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 *:flex-1">
        <Button variant="outline" className="h-11 px-3.5 font-normal">
          <img
            src={`${STATIC_ASSETS}/images/social/google.svg`}
            className="-mb-0.5 size-4"
            alt="Google"
          />
          <span>Google</span>
        </Button>
        <Button variant="outline" className="h-11 px-3.5 font-normal">
          <img
            src={`${STATIC_ASSETS}/images/social/apple.svg`}
            className="-mt-0.5 size-4"
            alt="Apple"
          />
          <span>Apple</span>
        </Button>
      </div>
      <form>
        <span className="relative flex items-center">
          <Input type="email" placeholder="Enter your email" required />
          <span className="absolute right-1">
            <Button type="submit" variant="outline" className="group h-9">
              <ArrowRight className="size-4 opacity-50 group-hover:opacity-100" />
            </Button>
          </span>
        </span>
      </form>
    </div>
  );
};
