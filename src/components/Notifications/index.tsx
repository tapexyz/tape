import { useQuery } from "@apollo/client";
import { EmptyState } from "@components/ui/EmptyState";
import { ErrorMessage } from "@components/ui/ErrorMessage";
import { LoadingState } from "@components/ui/LoadingState";
import useAppStore from "@lib/store";
import { NOTIFICATIONS_QUERY } from "@utils/gql/queries";
import clsx from "clsx";
import React, { useState } from "react";
import { useInView } from "react-cool-inview";
import { LoaderIcon } from "react-hot-toast";
import { Notification, PaginatedResultInfo } from "src/types";

import SubscriberNotification from "./Subscriber";

const Notifications = () => {
  const { selectedChannel } = useAppStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>();
  const { data, loading, error, fetchMore } = useQuery(NOTIFICATIONS_QUERY, {
    variables: {
      request: { profileId: selectedChannel?.id, limit: 50 },
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

  if (loading) return <LoadingState />;

  if (error) return <ErrorMessage error={error} />;

  if (data?.notifications?.items?.length === 0)
    return <EmptyState message={<span>No notifications yet</span>} />;

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
          <LoaderIcon />
        </span>
      )}
    </>
  );
};

export default Notifications;
