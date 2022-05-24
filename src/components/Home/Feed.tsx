import { useQuery } from "@apollo/client";
import Timeline from "@components/Home/Timeline";
import { EmptyState } from "@components/ui/EmptyState";
import { ErrorMessage } from "@components/ui/ErrorMessage";
import useAppStore from "@lib/store";
import { LENSTUBE_VIDEOS_APP_ID } from "@utils/constants";
import { FEED_QUERY } from "@utils/gql/queries";
import React, { useState } from "react";
import { useInView } from "react-cool-inview";
import { LoaderIcon } from "react-hot-toast";
import { PaginatedResultInfo } from "src/types";
import { LenstubePublication } from "src/types/local";

const HomeFeed = () => {
  const [videos, setVideos] = useState<LenstubePublication[]>([]);
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>();
  const { selectedChannel } = useAppStore();

  const { loading, error, fetchMore } = useQuery(FEED_QUERY, {
    variables: {
      request: { profileId: selectedChannel?.id, limit: 10 },
    },
    fetchPolicy: "no-cache",
    onCompleted(data) {
      setPageInfo(data?.timeline?.pageInfo);
      const videosPublications = data?.timeline?.items.filter(
        (e: LenstubePublication) => e.appId === LENSTUBE_VIDEOS_APP_ID
      );
      setVideos(videosPublications);
    },
  });

  const { observe } = useInView({
    threshold: 0.7,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            profileId: selectedChannel?.id,
            cursor: pageInfo?.next,
            limit: 10,
          },
        },
      }).then(({ data }: any) => {
        setPageInfo(data?.timeline?.pageInfo);
        const videosPublications = data?.timeline?.items.filter(
          (e: LenstubePublication) => e.appId === LENSTUBE_VIDEOS_APP_ID
        );
        setVideos([...videos, ...videosPublications]);
      });
    },
  });

  if (videos?.length === 0) {
    return <EmptyState message={<div>No videos found</div>} />;
  }

  return (
    <div>
      <ErrorMessage error={error} />
      {!error && !loading && (
        <>
          <Timeline videos={videos} />
          {pageInfo?.next && videos.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-5">
              <LoaderIcon />
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default HomeFeed;
