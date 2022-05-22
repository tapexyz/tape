import AudioPlayer from "@components/common/AudioPlayer";
import useAppStore from "@lib/store";
import Link from "next/link";
import React from "react";

const PodPlayer = () => {
  const { selectPodUrl } = useAppStore();

  if (!selectPodUrl) return null;

  return (
    <div className="flex justify-between border border-gray-200 rounded-xl dark:border-gray-800">
      <div className="flex flex-col w-full p-4 px-5 space-y-4 md:space-y-6">
        <div>
          <h1 className="text-lg font-semibold lg:text-2xl">Web3 Breakdowns</h1>
          <Link href={""}>
            <a className="text-xs truncate hover:opacity-100 opacity-70">
              T Series
            </a>
          </Link>
          <p className="mt-4 text-sm opacity-80">
            Web3 Breakdowns is a series of conversations exploring innovation in
            the decentralized internet. Each episode will focus on a different
            topic - we will cover NFT projects, crypto assets, blockchain-based
            protocols, and businesses being built with Web3 architecture. We
            will talk to founders, artists, investors and influencers to
            understand this emerging ecosystem. Visit joincolossus.com to find
            more episodes, transcripts and a library of content to continue your
            learning.
          </p>
        </div>
        <div className="pb-2">
          <AudioPlayer selectPodUrl={selectPodUrl} />
        </div>
      </div>
    </div>
  );
};

export default PodPlayer;
