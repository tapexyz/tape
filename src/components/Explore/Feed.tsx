import { useQuery } from "@apollo/client";
import Timeline from "@components/Home/Timeline";
import { EmptyState } from "@components/ui/EmptyState";
import { ErrorMessage } from "@components/ui/ErrorMessage";
import { EXPLORE_VIDEOS_QUERY } from "@utils/gql/queries";
import React, { useState } from "react";
import { useInView } from "react-cool-inview";
import { LoaderIcon } from "react-hot-toast";
import { PaginatedResultInfo } from "src/types";
import { LenstubePublication } from "src/types/local";

const Feed = () => {
  const [videos, setVideos] = useState<LenstubePublication[]>([]);
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>();

  const { loading, error, fetchMore } = useQuery(EXPLORE_VIDEOS_QUERY, {
    variables: {
      request: {
        sortCriteria: "LATEST",
        limit: 10,
        noRandomize: true,
      },
    },
    onCompleted(data) {
      setPageInfo(data?.explorePublications?.pageInfo);
      const videosPublications = data?.explorePublications?.items.filter(
        (e: LenstubePublication) => e.appId === "lenstube-videos"
      );
      setVideos(videosPublications);
    },
  });

  const { observe } = useInView({
    threshold: 1,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            sortCriteria: "LATEST",
            cursor: pageInfo?.next,
            limit: 10,
            noRandomize: true,
          },
        },
      }).then(({ data }: any) => {
        setPageInfo(data?.explorePublications?.pageInfo);
        const videosPublications = data?.explorePublications?.items.filter(
          (e: LenstubePublication) => e.appId === "lenstube-videos"
        );
        setVideos([...videos, ...videosPublications]);
      });
    },
  });
  console.log("🚀 ~ file: index.tsx ~ line 29 ~ onCompleted ~ videos", videos);

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

export default Feed;
