import { Colors } from "@/helpers/colors";
import normalizeFont from "@/helpers/normalize-font";
import { useAuthStore } from "@/store/auth";
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Background } from "./background";
import { Scan } from "./scan";

export const SplashScreen = () => {
  const id = useAuthStore((state) => state.session.id);

  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 200 });
  }, []);
  const opacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }));

  return (
    <Background>
      <StatusBar style="dark" key="splash" />
      <BlurView tint="light" style={styles.blurView} intensity={100}>
        <SafeAreaView style={{ flex: 1 }}>
          <Animated.View
            style={[
              opacityStyle,
              styles.container,
              { justifyContent: id ? "center" : "space-between" }
            ]}
          >
            <Text style={styles.tape}>tape</Text>
            {!id && <Scan />}
          </Animated.View>
        </SafeAreaView>
      </BlurView>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center"
  },
  blurView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  tape: {
    fontFamily: "Serif",
    fontSize: normalizeFont(42),
    lineHeight: normalizeFont(42),
    paddingTop: 20,
    color: Colors.text
  }
});
