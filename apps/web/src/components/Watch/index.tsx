import {
  EVENTS,
  getIsSuspendedProfile,
  getPublication,
  getPublicationData,
  isWatchable,
} from "@tape.xyz/generic";
import type { AnyPublication } from "@tape.xyz/lens";
import { usePublicationQuery } from "@tape.xyz/lens";
import { CustomCommentsFilterEnum } from "@tape.xyz/lens/custom-types";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Custom404 from "src/pages/404";
import Custom500 from "src/pages/500";

import MetaTags from "@/components/Common/MetaTags";
import ProfileSuspended from "@/components/Common/ProfileSuspended";
import { WatchShimmer } from "@/components/Shimmers/WatchShimmer";
import useSw from "@/hooks/useSw";
import useAppStore from "@/lib/store";
import useCommentStore from "@/lib/store/comment";

import PublicationComments from "../Common/Publication/PublicationComments";
import NonRelevantComments from "./Comments/NonRelevantComments";
import SuggestedVideos from "./SuggestedVideos";
import Video from "./Video";

const VideoDetails = () => {
  const {
    query: { id, t: time },
  } = useRouter();
  const { addEventToQueue } = useSw();

  const setVideoWatchTime = useAppStore((state) => state.setVideoWatchTime);
  const selectedCommentFilter = useCommentStore(
    (state) => state.selectedCommentFilter,
  );

  useEffect(() => {
    addEventToQueue(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.WATCH });
  }, []);

  useEffect(() => {
    setVideoWatchTime(Number(time));
  }, [time, setVideoWatchTime]);

  const { data, error, loading } = usePublicationQuery({
    variables: {
      request: { forId: id },
    },
    skip: !id,
  });

  if (loading || !data) {
    return <WatchShimmer />;
  }

  if (error) {
    return <Custom500 />;
  }

  const publication = data?.publication as AnyPublication;
  const video = getPublication(publication);
  const isSuspended = getIsSuspendedProfile(video.by.id);

  if (isSuspended) {
    return <ProfileSuspended />;
  }

  if (!isWatchable(video)) {
    return <Custom404 />;
  }

  return (
    <>
      <MetaTags title={getPublicationData(video?.metadata)?.title || "Watch"} />
      {!loading && !error && video ? (
        <div className="mx-auto grid max-w-screen-ultrawide grid-cols-1 gap-y-4 md:gap-4 xl:grid-cols-4">
          <div className="col-span-3 space-y-4">
            <Video video={video} />
            <hr className="border-[0.5px] border-gray-200 dark:border-gray-800" />
            <PublicationComments publication={video} />
            {selectedCommentFilter ===
            CustomCommentsFilterEnum.RELEVANT_COMMENTS ? (
              <NonRelevantComments video={video} />
            ) : null}
          </div>
          <div className="col-span-1">
            <SuggestedVideos />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default VideoDetails;
