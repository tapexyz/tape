import normalizeFont from "@/helpers/normalize-font";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withDelay
} from "react-native-reanimated";

export const Instructions = () => {
  const opacity1 = useSharedValue(0);
  const opacity2 = useSharedValue(0);
  const opacity3 = useSharedValue(0);

  const translateY1 = useSharedValue(20);
  const translateY2 = useSharedValue(20);
  const translateY3 = useSharedValue(20);

  useEffect(() => {
    opacity1.value = withDelay(
      300,
      withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.ease)
      })
    );
    translateY1.value = withDelay(
      300,
      withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.ease)
      })
    );

    opacity2.value = withDelay(
      500,
      withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.ease)
      })
    );
    translateY2.value = withDelay(
      500,
      withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.ease)
      })
    );

    opacity3.value = withDelay(
      700,
      withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.ease)
      })
    );
    translateY3.value = withDelay(
      700,
      withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.ease)
      })
    );
  }, []);

  const animatedStyle1 = useAnimatedStyle(() => ({
    opacity: opacity1.value,
    transform: [{ translateY: translateY1.value }]
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    opacity: opacity2.value,
    transform: [{ translateY: translateY2.value }]
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    opacity: opacity3.value,
    transform: [{ translateY: translateY3.value }]
  }));

  return (
    <View style={{ gap: 10, marginTop: -20 }}>
      <Animated.Text style={[styles.text, animatedStyle1]}>
        ✳︎ Go to tape.xyz/settings/sessions
      </Animated.Text>
      <Animated.Text style={[styles.text, animatedStyle2]}>
        ✳︎ Sign in if you haven't already
      </Animated.Text>
      <Animated.Text style={[styles.text, animatedStyle3]}>
        ✳︎ Scan the QR code
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "Sans",
    fontSize: normalizeFont(14)
  }
});
