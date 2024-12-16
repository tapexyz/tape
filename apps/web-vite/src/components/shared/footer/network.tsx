import { WifiHigh, WifiX, tw } from "@tape.xyz/winder";
import { Tooltip, TooltipContent, TooltipTrigger } from "@tape.xyz/winder";
import { useNetworkState } from "@uidotdev/usehooks";

export const NetworkState = () => {
  const { online } = useNetworkState();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="grid place-items-center *:size-5 *:text-muted *:transition-colors *:hover:text-primary">
          {online ? <WifiHigh /> : <WifiX />}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <span className="inline-flex items-center space-x-1.5">
          <span
            className={tw(
              "inline-flex size-1.5 rounded-full",
              online ? "bg-green-500" : "bg-red-500"
            )}
          />
          <span>{online ? "Online" : "Offline"}</span>
        </span>
      </TooltipContent>
    </Tooltip>
  );
};
