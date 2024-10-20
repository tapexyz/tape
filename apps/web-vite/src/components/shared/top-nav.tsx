import { Link, useMatchRoute } from "@tanstack/react-router";
import { WORKER_AVATAR_URL } from "@tape.xyz/constants";
import {
  Avatar,
  AvatarImage,
  Badge,
  BellSimple,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  MagnifyingGlass,
  PlusCircle,
  ThemeSwitcher,
  User,
  tw
} from "@tape.xyz/winder";
import { memo } from "react";

export const Logo = memo(() => {
  return (
    <div className="flex h-9 items-center rounded-custom bg-primary px-3.5 pt-2.5 pb-2">
      <svg
        className="h-4 text-theme"
        viewBox="0 0 1453 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.99985 45.2164C0 62.931 0 86.1207 0 132.5C0 178.879 0 202.069 8.99985 219.784C16.9163 235.366 29.5483 248.034 45.0853 255.974C62.7485 265 85.8709 265 132.116 265H295.884C342.129 265 365.252 265 382.915 255.974C398.452 248.034 411.084 235.366 419 219.784C428 202.069 428 178.879 428 132.5C428 86.1207 428 62.931 419 45.2164C411.084 29.6342 398.452 16.9655 382.915 9.02602C365.252 0 342.129 0 295.884 0H132.116C85.8709 0 62.7485 0 45.0853 9.02602C29.5483 16.9655 16.9163 29.6342 8.99985 45.2164ZM131.779 181.952C134.557 182.736 136.948 184.614 138.132 187.253L138.133 187.254C139.974 191.358 140.895 193.41 141.098 194.07C143.361 201.44 139.578 207.365 131.995 208.325C131.316 208.411 129.566 208.411 126.066 208.411C103.134 208.411 91.6683 208.411 82.9096 203.906C75.2052 199.942 68.9414 193.618 65.0158 185.839C60.5531 176.995 60.5531 165.419 60.5531 142.265V122.735C60.5531 99.5813 60.5531 88.0047 65.0158 79.1613C68.9414 71.3824 75.2052 65.058 82.9096 61.0945C91.6683 56.5885 103.134 56.5885 126.066 56.5885C129.566 56.5885 131.316 56.5885 131.996 56.6747C139.578 57.6355 143.361 63.56 141.098 70.9298C140.896 71.5904 139.974 73.6435 138.132 77.7473C136.948 80.3857 134.557 82.2642 131.78 83.0481C115.626 87.6085 103.389 101.315 100.914 118.308C100.463 121.407 100.463 125.105 100.463 132.5C100.463 139.895 100.463 143.593 100.914 146.692C103.389 163.684 115.625 177.391 131.779 181.952ZM289.868 187.253C291.052 184.614 293.443 182.736 296.221 181.952C312.375 177.391 324.611 163.684 327.086 146.692C327.537 143.593 327.537 139.895 327.537 132.5C327.537 125.105 327.537 121.407 327.086 118.308C324.611 101.315 312.374 87.6085 296.22 83.0481C293.443 82.2642 291.052 80.3857 289.868 77.7473C288.025 73.6427 287.104 71.5904 286.902 70.9298C284.639 63.56 288.422 57.6355 296.004 56.6747C296.684 56.5885 298.434 56.5885 301.934 56.5885C324.866 56.5885 336.332 56.5885 345.09 61.0945C352.795 65.058 359.059 71.3824 362.984 79.1613C367.447 88.0047 367.447 99.5813 367.447 122.735V142.265C367.447 165.419 367.447 176.995 362.984 185.839C359.059 193.618 352.795 199.942 345.09 203.906C336.332 208.411 324.866 208.411 301.934 208.411C298.434 208.411 296.684 208.411 296.005 208.325C288.422 207.365 284.639 201.44 286.902 194.07C287.105 193.41 288.025 191.359 289.865 187.259L289.867 187.254L289.868 187.253Z"
          fill="currentColor"
        />
        <path
          d="M690.013 250.749H636.171C584.776 250.749 554.184 225.9 554.184 172.536V108.173H524V45.4402H554.184V10H630.868V45.4402H690.013V108.173H630.868V161.537C630.868 177.832 635.763 181.905 653.303 181.905H690.013V250.749Z"
          fill="currentColor"
        />
        <path
          d="M774.804 254.823C728.304 254.823 702.199 233.64 702.199 198.607C702.199 169.685 722.186 148.909 768.686 144.428L852.305 136.281V132.208C852.305 111.432 843.331 108.173 816.002 108.173C790.712 108.173 782.962 113.062 782.962 130.171V131.8H706.278V130.986C706.278 76.3995 751.962 41.3666 821.712 41.3666C893.502 41.3666 928.173 76.3995 928.173 133.837V250.749H856.383V207.569H852.305C844.555 236.491 819.265 254.823 774.804 254.823ZM779.291 193.719C779.291 200.237 785.818 201.459 797.647 201.459C834.765 201.459 849.857 196.978 851.897 178.647L789.081 185.979C782.147 186.794 779.291 189.238 779.291 193.719Z"
          fill="currentColor"
        />
        <path
          d="M1027.59 320H950.904V45.4402H1022.69V100.841H1026.77C1033.3 60.1051 1057.77 41.3666 1105.9 41.3666C1168.72 41.3666 1203.39 81.6951 1203.39 148.095C1203.39 214.901 1169.54 254.823 1109.17 254.823C1060.63 254.823 1037.79 232.011 1031.67 197.792H1027.59V320ZM1027.59 150.539C1027.59 179.461 1043.9 185.164 1078.17 185.164C1113.65 185.164 1125.89 175.388 1125.89 148.095C1125.89 120.802 1113.65 111.432 1078.17 111.432C1043.9 111.432 1027.59 117.95 1027.59 147.687V150.539Z"
          fill="currentColor"
        />
        <path
          d="M1338.38 254.823C1268.63 254.823 1219.68 225.085 1219.68 148.095C1219.68 81.2878 1268.22 41.3666 1336.75 41.3666C1407.72 41.3666 1453 76.8068 1453 142.799C1453 149.724 1452.59 155.02 1451.78 162.352H1290.66C1291.88 187.201 1302.89 194.126 1335.53 194.126C1366.53 194.126 1374.68 188.831 1374.68 176.61V172.129H1451.37V177.017C1451.37 222.641 1407.72 254.823 1338.38 254.823ZM1335.12 100.026C1306.97 100.026 1295.14 106.137 1291.88 123.653H1378.76C1375.91 106.137 1363.67 100.026 1335.12 100.026Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
});

const RightSection = memo(() => {
  return (
    <div className="flex w-1/3 justify-end gap-1.5">
      <div className="relative">
        <Button size="icon" variant="secondary" className="text-primary/50">
          <BellSimple className="size-5" weight="bold" />
        </Button>
        <Badge className="-top-1 -left-1 absolute z-10 size-4 justify-center bg-[#2A59FF] p-0 text-[10px] text-white">
          6
        </Badge>
      </div>
      <Button>
        <span>Create</span>
        <PlusCircle className="size-5" weight="fill" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-custom">
          <Avatar size="md" className="select-none">
            <AvatarImage src={`${WORKER_AVATAR_URL}/0x2d`} />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem className="flex items-center gap-2">
            <User />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2">
            <PlusCircle />
            <span>Create</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

export const TopNav = () => {
  const matchRoute = useMatchRoute();
  const isActive =
    matchRoute({ to: "/" }) ||
    matchRoute({ to: "/explore" }) ||
    matchRoute({ to: "/following" });

  return (
    <div className="sticky inset-x-0 top-0 z-50 flex w-full justify-between gap-1.5 px-4 py-2">
      <div className="inline-flex w-1/3 gap-1.5">
        <Link to="/">
          <Logo />
        </Link>
        <ThemeSwitcher />
        <Button
          variant="secondary"
          className="hidden p-0 font-semibold text-sm backdrop-blur-3xl lg:block"
        >
          <div className="inline-flex items-center">
            <Link
              to="/"
              className={tw(
                "py-2 pr-3 pl-4 transition-colors hover:text-primary",
                isActive ? "text-primary" : "text-primary/40"
              )}
            >
              Discover
            </Link>
            <div className="h-3 w-[1px] rounded bg-primary/10" />
            <Link to="/feed">
              {({ isActive }) => {
                return (
                  <span
                    className={tw(
                      "py-2 pr-4 pl-3 transition-colors hover:text-primary",
                      isActive ? "text-primary" : "text-primary/40"
                    )}
                  >
                    Feed
                  </span>
                );
              }}
            </Link>
          </div>
        </Button>
      </div>

      <Button
        variant="secondary"
        className="p-2 font-medium backdrop-blur-3xl lg:w-[444px]"
      >
        <span className="inline-flex items-center gap-1.5">
          <MagnifyingGlass className="size-4" />
          <span className="hidden lg:inline-block">Search for a tape</span>
        </span>
      </Button>

      <RightSection />
    </div>
  );
};
