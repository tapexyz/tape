import { Button } from "@components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FC } from "react";
import { BsPlay } from "react-icons/bs";

type Props = {};

const PodCard: FC<Props> = ({}) => {
  const router = useRouter();
  const isPodDetail = router.pathname === "/pods/[id]";

  return (
    <div className="p-2 transition duration-200 ease-in-out bg-secondary rounded-xl">
      <div className="flex flex-col">
        <div className="relative flex justify-center flex-none h-40 rounded-lg bg-gray-50 dark:bg-gray-900">
          <img
            src={`https://avatars.dicebear.com/api/avataaars/${Math.random()}.svg`}
            alt=""
            className="object-cover"
            draggable={false}
          />
          {isPodDetail && (
            <Button className="absolute top-1 right-1 !p-1">
              <BsPlay />
              {/* <BsSoundwave /> */}
            </Button>
          )}
        </div>
        <div className="flex flex-col p-2 pb-0 space-y-1.5">
          {isPodDetail ? (
            <h1 className="text-sm font-semibold line-clamp-1">
              History of India and its nature
            </h1>
          ) : (
            <Link href={""}>
              <a className="text-sm font-semibold line-clamp-1">
                History of India and its nature
              </a>
            </Link>
          )}
          {isPodDetail && (
            <p className="text-xs opacity-60 mt-0.5 line-clamp-2">
              Web3 Breakdowns is a series of conversations exploring innovation
              in the decentralized internet. Each episode will focus on a
              different topic - we will cover NFT projects, crypto assets,
              blockchain-based protocols, and businesses being built with Web3
              architecture. We will talk to founders, artists, investors and
              influencers to understand this emerging ecosystem. Visit
              joincolossus.com to find more episodes, transcripts and a library
              of content to continue your learning.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PodCard;
