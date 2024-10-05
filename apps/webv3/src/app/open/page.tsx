import { BackgroundComets } from "@tape.xyz/winder";
import { AnimatedNumber } from "@tape.xyz/winder";
import {
  ArrowsClockwise,
  CassetteTape,
  ChatsCircle,
  CurrencyDollar,
  Lightning
} from "@tape.xyz/winder/common";
import { MiddleGridItem } from "./_components/middle-grid-item";
import { getPlatformtats } from "./queries";

export const revalidate = 86400;

export default async function OpenPage() {
  const stats = await getPlatformtats();
  const { acts, comments, mirrors, posts, creatorEarnings } = stats;

  return (
    <div className="container grid min-h-screen max-w-6xl place-items-center">
      <BackgroundComets />
      <div className="grid w-full grid-cols-4 grid-rows-3 bg-card/30 backdrop-blur-xl">
        <div className="col-span-1 row-span-2 flex flex-col justify-between border border-custom p-6">
          <div>
            <AnimatedNumber className="font-mono text-4xl" value={posts} />
            <p className="text-primary/60">Videos</p>
          </div>
          <div className="flex justify-end">
            <CassetteTape className="size-7 opacity-70" weight="duotone" />
          </div>
        </div>
        <div className="col-span-2 row-span-1 flex flex-col justify-between border-custom border-t p-6">
          <div>
            <AnimatedNumber
              className="font-mono text-4xl"
              value={creatorEarnings}
            />
            <p className="text-primary/60">Creator Earnings</p>
          </div>
          <div className="flex justify-end">
            <CurrencyDollar className="size-7 opacity-70" weight="duotone" />
          </div>
        </div>
        <div className="col-span-1 row-span-2 flex flex-col justify-between border border-custom p-6">
          <div>
            <AnimatedNumber className="font-mono text-4xl" value={acts} />
            <p className="text-primary/60">Mints</p>
          </div>
          <div className="flex justify-end">
            <Lightning className="size-7 opacity-70" weight="duotone" />
          </div>
        </div>

        <MiddleGridItem />

        <div className="col-span-2 row-span-1 flex flex-col justify-between border-custom border-x border-b p-6">
          <div>
            <AnimatedNumber className="font-mono text-4xl" value={comments} />
            <p className="text-primary/60">Comments</p>
          </div>
          <div className="flex justify-end">
            <ChatsCircle className="size-7 opacity-70" />
          </div>
        </div>
        <div className="col-span-2 row-span-1 flex flex-col justify-between border-custom border-r border-b p-6">
          <div>
            <AnimatedNumber className="font-mono text-4xl" value={mirrors} />
            <p className="text-primary/60">Mirrors</p>
          </div>
          <div className="flex justify-end">
            <ArrowsClockwise className="size-7 opacity-70" />
          </div>
        </div>
      </div>
    </div>
  );
}
