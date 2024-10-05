import { WORKER_STATS_URL } from "@tape.xyz/constants";
import { AnimatedNumber, BackgroundComets } from "@tape.xyz/winder";
import {
  ArrowsClockwise,
  CassetteTape,
  ChatsCircle,
  CurrencyDollar,
  Lightning
} from "@tape.xyz/winder/common";
import { CenterGridItem } from "./_components/center-grid-item";

export default async function OpenPage() {
  const response = await fetch(WORKER_STATS_URL, {
    next: { revalidate: 86400 }
  });
  const data = await response.json();
  const { acts, comments, mirrors, posts, profiles } = data.stats;

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
            <AnimatedNumber className="font-mono text-4xl" value={posts} />
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

        <CenterGridItem />

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
