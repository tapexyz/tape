import { useQuery } from "@apollo/client";
import { Loader } from "@components/ui/Loader";
import { NoDataFound } from "@components/ui/NoDataFound";
import useAppStore from "@lib/store";
import { LENSTUBE_VIDEOS_APP_ID } from "@utils/constants";
import { NOTIFICATIONS_QUERY } from "@utils/gql/queries";
import clsx from "clsx";
import React, { useState } from "react";
import { useInView } from "react-cool-inview";
import { Notification, PaginatedResultInfo } from "src/types";

import SubscriberNotification from "./Subscriber";

const Notifications = () => {
  const { selectedChannel } = useAppStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>();
  const { data, loading, fetchMore } = useQuery(NOTIFICATIONS_QUERY, {
    variables: {
      request: {
        profileId: selectedChannel?.id,
        limit: 50,
        sources: [LENSTUBE_VIDEOS_APP_ID],
      },
    },
    fetchPolicy: "no-cache",
    onCompleted(data) {
      setPageInfo(data?.notifications?.pageInfo);
      setNotifications(data?.notifications?.items);
    },
  });

  const { observe } = useInView({
    threshold: 0.5,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            profileId: selectedChannel?.id,
            cursor: pageInfo?.next,
            limit: 50,
          },
        },
      }).then(({ data }: any) => {
        setPageInfo(data?.notifications?.pageInfo);
        setNotifications([...notifications, ...data?.notifications?.items]);
      });
    },
  });

  if (loading) return <Loader />;

  if (data?.notifications?.items?.length === 0) return <NoDataFound />;

  return (
    <>
      {notifications?.map(
        (notification: Notification, index: number) =>
          notification?.__typename === "NewFollowerNotification" &&
          notification.createdAt && (
            <div
              className={clsx("pb-2", {
                "pb-0": notifications.length - 1 === index,
              })}
              key={index}
            >
              <SubscriberNotification notification={notification as any} />
            </div>
          )
      )}
      {pageInfo?.next && (
        <span ref={observe} className="flex justify-center p-5">
          <Loader />
        </span>
      )}
    </>
  );
};

export default Notifications;
