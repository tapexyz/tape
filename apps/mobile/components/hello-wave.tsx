import normalizeFont from "@/helpers/normalize-font";
import { StyleSheet, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence
} from "react-native-reanimated";

export const HelloWave = () => {
  const rotationAnimation = useSharedValue(0);

  rotationAnimation.value = withRepeat(
    withSequence(
      withTiming(25, { duration: 150 }),
      withTiming(0, { duration: 150 })
    ),
    4 // Run the animation 4 times
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationAnimation.value}deg` }]
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Text style={styles.text}>👋</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: normalizeFont(28),
    lineHeight: 32,
    marginTop: -6
  }
});
