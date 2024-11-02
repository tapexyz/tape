import { useAuthStore } from "@/store/auth";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { FeedItem } from "@tape.xyz/lens/gql";
import { Text, View } from "react-native";
import { feedQuery } from "./queries";

export const Feed = () => {
  const profileId = useAuthStore((state) => state.session.id);
  const { data } = useInfiniteQuery(feedQuery(profileId ?? ""));
  const allPublications = data?.pages.flatMap(
    (page) => page.feed.items
  ) as FeedItem[];

  return (
    <View>
      <Text>{allPublications?.length}</Text>
    </View>
  );
};
