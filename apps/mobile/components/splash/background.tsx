import { Colors } from "@/helpers/colors";
import { Image } from "expo-image";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  FadeOut,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";

const AnimatedExpoImage = Animated.createAnimatedComponent(Image);

export const Background = ({ children }: PropsWithChildren) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withTiming(360 * 1000, {
      duration: 20000 * 1000,
      easing: Easing.linear
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value % 360}deg` }]
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={styles.container}
    >
      <AnimatedExpoImage
        style={[{ width: 400, height: 400, marginTop: -300 }, animatedStyle]}
        source={require("../../assets/images/splash-el.png")}
        contentFit="contain"
        transition={500}
      />
      <AnimatedExpoImage
        style={[{ width: 400, height: 400, marginBottom: -300 }, animatedStyle]}
        source={require("../../assets/images/splash-el.png")}
        contentFit="contain"
        transition={500}
      />
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.background
  }
});
