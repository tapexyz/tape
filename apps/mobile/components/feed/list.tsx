import { windowHeight } from "@/helpers/normalize-font";
import { useAuthStore } from "@/store/auth";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPublication, getPublicationData } from "@tape.xyz/generic";
import type { FeedItem } from "@tape.xyz/lens/gql";
import { StyleSheet, Text, View } from "react-native";
import { feedQuery } from "./queries";

export const List = () => {
  const profileId = useAuthStore((state) => state.session.id);
  const { data, isLoading } = useInfiniteQuery(feedQuery(profileId ?? ""));
  const allPublications = data?.pages.flatMap(
    (page) => page.feed.items
  ) as FeedItem[];

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <FlashList
        data={allPublications}
        renderItem={({ item }) => {
          const publication = getPublication(item.root);
          const meta = getPublicationData(publication.metadata);
          return <Text style={{ fontFamily: "Sans" }}>{meta?.content}</Text>;
        }}
        estimatedItemSize={allPublications.length}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: windowHeight
  }
});
