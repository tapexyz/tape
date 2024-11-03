import { FlashList } from "@shopify/flash-list";
import type { TapePublicationData } from "@tape.xyz/lens/custom-types";
import { Image } from "expo-image";
import { useCallback, useState } from "react";
import { type LayoutChangeEvent, StyleSheet, View } from "react-native";
import type { ViewToken } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  type SharedValue
} from "react-native-reanimated";

interface MediaProps {
  meta: TapePublicationData;
}

interface PaginationDotProps {
  index: number;
  activeIndex: SharedValue<number>;
}

const PaginationDot = ({ index, activeIndex }: PaginationDotProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      activeIndex.value,
      [index - 1, index, index + 1],
      [0.8, 1.2, 0.8]
    );
    const opacity = interpolate(
      activeIndex.value,
      [index - 1, index, index + 1],
      [0.5, 1, 0.5]
    );

    return {
      transform: [{ scale }],
      opacity
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

export const Media = ({ meta }: MediaProps) => {
  const { attachments, asset } = meta;

  const activeIndex = useSharedValue(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const images = [
    ...(asset?.uri ? [{ uri: asset.uri }] : []),
    ...(attachments || [])
  ].filter(
    (image, index, self) => index === self.findIndex((t) => t.uri === image.uri)
  );

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  }, []);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
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
    ({ item }: { item: { uri: string } }) => (
      <View style={{ width: containerWidth, height: 200 }}>
        <Image
          source={{ uri: item.uri }}
          style={styles.image}
          contentFit="cover"
          transition={300}
          contentPosition="top"
          cachePolicy="memory-disk"
        />
      </View>
    ),
    [containerWidth]
  );

  if (!images.length) return null;

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <FlashList
        horizontal
        pagingEnabled
        data={images}
        bounces={false}
        renderItem={renderItem}
        decelerationRate="fast"
        snapToInterval={containerWidth}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50
        }}
        estimatedItemSize={images.length}
      />
      {images.length > 1 && (
        <View style={styles.pagination}>
          {images.map(({ uri }, index) => (
            <PaginationDot key={uri} index={index} activeIndex={activeIndex} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden"
  },
  image: {
    width: "100%",
    height: "100%"
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
