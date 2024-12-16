import { TAPE_X_HANDLE } from "@tape.xyz/constants";
import { DiscordLogo, XLogo } from "@tape.xyz/winder";

const xLink = `https://x.com/${TAPE_X_HANDLE}`;
const discordLink = "https://discord.com/invite/lenstube-980882088783913010";

export const Socials = () => {
  return (
    <div className="flex items-center space-x-3">
      <a href={xLink} target="_blank" rel="noreferrer">
        <XLogo
          className="size-5 text-muted transition-colors hover:text-primary"
          weight="fill"
        />
      </a>
      <a href={discordLink} target="_blank" rel="noreferrer">
        <DiscordLogo
          className="size-5 text-muted transition-colors hover:text-primary"
          weight="fill"
        />
      </a>
    </div>
  );
};
