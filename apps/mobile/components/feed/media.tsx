import { Colors } from "@/helpers/colors";
import { useDevice } from "@/store/device";
import { FlashList } from "@shopify/flash-list";
import { FALLBACK_THUMBNAIL_URL } from "@tape.xyz/constants";
import type { TapePublicationData } from "@tape.xyz/lens/custom-types";
import { Image } from "expo-image";
import { useCallback } from "react";
import { type LayoutChangeEvent, StyleSheet, View } from "react-native";
import type { ViewToken } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  type SharedValue
} from "react-native-reanimated";
import { MVideo } from "./video";

interface MediaProps {
  meta: TapePublicationData;
}

type PaginationDotProps = {
  index: number;
  activeIndex: SharedValue<number>;
};

const PaginationDot = ({ index, activeIndex }: PaginationDotProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    const inputRange = [index - 1, index, index + 1];
    const outputRange = [0.8, 1.2, 0.8];
    const opacityRange = [0.5, 1, 0.5];

    if (index === 0) {
      inputRange.unshift(-1);
      outputRange.unshift(0.8);
      opacityRange.unshift(0.5);
    }

    const scale = interpolate(
      activeIndex.value,
      inputRange,
      outputRange,
      "clamp"
    );
    const opacity = interpolate(
      activeIndex.value,
      inputRange,
      opacityRange,
      "clamp"
    );

    return {
      transform: [{ scale }],
      opacity
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const CONTAINER_HEIGHT = 250;

export const Media = ({ meta }: MediaProps) => {
  const { attachments, asset } = meta;

  const activeIndex = useSharedValue(0);
  const feedItemWidth = useDevice((state) => state.feedItemWidth);
  const setFeedItemWidth = useDevice((state) => state.setFeedItemWidth);

  const all = [
    ...(asset?.uri
      ? [{ uri: asset.uri, type: asset.type, cover: asset.cover }]
      : []),
    ...(attachments || [])
  ].filter(
    (image, index, self) => index === self.findIndex((t) => t.uri === image.uri)
  );

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setFeedItemWidth(width);
  }, []);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      "worklet";
      if (
        viewableItems.length > 0 &&
        typeof viewableItems[0]?.index === "number"
      ) {
        activeIndex.value = viewableItems[0].index;
      }
    },
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: { uri: string; type: string; cover?: string } }) => (
      <View style={{ width: feedItemWidth, height: CONTAINER_HEIGHT }}>
        {item.type === "VIDEO" ? (
          <MVideo uri={item.uri} cover={item.cover ?? FALLBACK_THUMBNAIL_URL} />
        ) : (
          <Image
            transition={100}
            contentFit="cover"
            style={styles.asset}
            contentPosition="top"
            source={{ uri: item.uri }}
          />
        )}
      </View>
    ),
    [feedItemWidth]
  );

  if (!all.length) return null;

  return (
    <View
      style={styles.container}
      onLayout={!feedItemWidth ? handleLayout : undefined}
    >
      <FlashList
        data={all}
        horizontal
        pagingEnabled
        bounces={false}
        removeClippedSubviews
        decelerationRate="fast"
        renderItem={renderItem}
        snapToInterval={feedItemWidth}
        estimatedItemSize={all.length}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />
      {all.length > 1 && (
        <View style={styles.pagination}>
          {all.map(({ uri }, index) => (
            <PaginationDot key={uri} index={index} activeIndex={activeIndex} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: CONTAINER_HEIGHT,
    width: "100%",
    borderRadius: 15,
    overflow: "hidden"
  },
  asset: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.background
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
    marginHorizontal: 4
  }
});
