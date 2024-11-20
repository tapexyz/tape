import { Colors } from "@/helpers/colors";
import { windowHeight } from "@/helpers/normalize-font";
import { useAuthStore } from "@/store/auth";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { FeedItem } from "@tape.xyz/indexer";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Header } from "./header";
import { Item } from "./item";
import { feedQuery } from "./queries";

export const List = () => {
  const height = windowHeight * 0.75;

  const profileId = useAuthStore((state) => state.session.id);
  const { data, isLoading, refetch, hasNextPage, fetchNextPage } =
    useInfiniteQuery(feedQuery(profileId ?? ""));
  const allPublications = data?.pages.flatMap(
    (page) => page.feed.items
  ) as FeedItem[];

  if (isLoading) {
    return <ActivityIndicator style={{ flex: 1 }} color={Colors.black} />;
  }

  return (
    <View style={styles.container}>
      <FlashList
        scrollsToTop
        pagingEnabled
        removeClippedSubviews
        refreshing={isLoading}
        data={allPublications}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        snapToInterval={height}
        estimatedItemSize={height}
        onEndReachedThreshold={0.8}
        onRefresh={() => refetch()}
        ListHeaderComponent={Header}
        showsVerticalScrollIndicator={false}
        getItemType={({ root }) => root.__typename}
        renderItem={({ item }) => <Item item={item} />}
        onEndReached={hasNextPage ? fetchNextPage : null}
        keyExtractor={(item, index) => `${item.id}_${index}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
