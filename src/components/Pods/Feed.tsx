import { useQuery } from "@apollo/client";
import useAppStore from "@lib/store";
import { LENSTUBE_PODS_APP_ID } from "@utils/constants";
import { EXPLORE_QUERY, FEED_QUERY } from "@utils/gql/queries";
import { PODS } from "@utils/url-path";
import Link from "next/link";
import React, { useState } from "react";
import { LoaderIcon } from "react-hot-toast";
import { HiOutlineArrowRight } from "react-icons/hi";
import { LenstubePublication } from "src/types/local";

import PodCard from "./PodCard";

const PodsFeed = () => {
  const [pods, setPods] = useState<LenstubePublication[]>([]);
  const [suggestedPods, setSuggestedPods] = useState<LenstubePublication[]>([]);
  const { selectedChannel } = useAppStore();

  const { loading } = useQuery(FEED_QUERY, {
    variables: {
      request: { profileId: selectedChannel?.id, limit: 10 },
    },
    skip: !selectedChannel,
    fetchPolicy: "no-cache",
    onCompleted(data) {
      const videosPublications = data?.timeline?.items.filter(
        (e: LenstubePublication) => e.appId === LENSTUBE_PODS_APP_ID
      );
      setPods(videosPublications);
    },
  });

  const { loading: suggestedPodsLoading } = useQuery(EXPLORE_QUERY, {
    variables: {
      request: {
        sortCriteria: "LATEST",
        limit: 10,
        noRandomize: true,
      },
    },
    onCompleted(data) {
      const podPublications = data?.explorePublications?.items.filter(
        (e: LenstubePublication) => e.appId === LENSTUBE_PODS_APP_ID
      );
      setSuggestedPods(podPublications);
    },
  });

  if (loading || suggestedPodsLoading) {
    return (
      <div className="flex justify-center">
        <LoaderIcon className="!h-5 !w-5" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col space-y-6">
        {pods.length ? (
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Listen Now</h1>
              <Link href={`${PODS}/feed`}>
                <a className="flex items-center space-x-2 text-xs text-indigo-500 hover:scale-105">
                  <span>See all</span> <HiOutlineArrowRight />
                </a>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 my-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
              {pods?.map((pod: LenstubePublication, idx: number) => (
                <PodCard key={idx} pod={pod} />
              ))}
            </div>
          </div>
        ) : null}

        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">You Might Like</h1>
            <Link href={`${PODS}/explore`}>
              <a className="flex items-center space-x-2 text-xs text-indigo-500 hover:scale-105">
                <span>See all</span> <HiOutlineArrowRight />
              </a>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 my-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
            {suggestedPods?.map((pod: LenstubePublication, idx: number) => (
              <PodCard key={idx} pod={pod} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodsFeed;
