import { useQuery } from "@apollo/client";
import MetaTags from "@components/common/MetaTags";
import Timeline from "@components/Home/Timeline";
import { NoDataFound } from "@components/ui/NoDataFound";
import Layout from "@components/wrappers/Layout";
import useAppStore from "@lib/store";
import { LENSTUBE_VIDEOS_APP_ID } from "@utils/constants";
import { PROFILE_FEED_QUERY } from "@utils/gql/queries";
import React, { useState } from "react";
import { useInView } from "react-cool-inview";
import { LoaderIcon } from "react-hot-toast";
import { AiOutlineComment } from "react-icons/ai";
import { PaginatedResultInfo } from "src/types";
import { LenstubePublication } from "src/types/local";

const SeeAllCommented = () => {
  const { selectedChannel } = useAppStore();
  const [commentedVideos, setCommentedVideos] = useState<LenstubePublication[]>(
    []
  );
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>();

  const { loading, error, fetchMore } = useQuery(PROFILE_FEED_QUERY, {
    variables: {
      request: {
        publicationTypes: "COMMENT",
        profileId: selectedChannel?.id,
        limit: 10,
        sources: [LENSTUBE_VIDEOS_APP_ID],
      },
    },
    skip: !selectedChannel?.id,
    fetchPolicy: "no-cache",
    onCompleted(data) {
      setPageInfo(data?.publications?.pageInfo);
      // const videosCommented = data?.publications?.items.filter(
      //   (e: LenstubePublication) => e.appId === LENSTUBE_VIDEOS_APP_ID
      // );
      setCommentedVideos(data?.publications?.items);
    },
  });

  const { observe } = useInView({
    threshold: 1,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            publicationTypes: "COMMENT",
            profileId: selectedChannel?.id,
            cursor: pageInfo?.next,
            limit: 10,
            sources: [LENSTUBE_VIDEOS_APP_ID],
          },
        },
      }).then(({ data }: any) => {
        setPageInfo(data?.publications?.pageInfo);
        // const videosPublications = data?.timeline?.items.filter(
        //   (e: LenstubePublication) => e.appId === LENSTUBE_VIDEOS_APP_ID
        // );
        setCommentedVideos([...commentedVideos, ...data?.publications?.items]);
      });
    },
  });

  if (loading) {
    return (
      <div className="flex justify-center">
        <LoaderIcon className="!h-5 !w-5" />
      </div>
    );
  }

  if (commentedVideos?.length === 0) {
    return <NoDataFound />;
  }

  return (
    <Layout>
      <MetaTags title="Commented Videos" />
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="inline-flex items-center space-x-2 text-lg font-semibold">
            <AiOutlineComment />
            <span>Commented Videos</span>
          </h1>
        </div>
        {!error && !loading && (
          <>
            <Timeline videos={commentedVideos} />
            {pageInfo?.next && commentedVideos.length !== pageInfo?.totalCount && (
              <span ref={observe} className="flex justify-center p-5">
                <LoaderIcon />
              </span>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default SeeAllCommented;
