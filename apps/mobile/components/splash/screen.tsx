import { AnimatedButton } from "@/components/ui/animated-button";
import { Colors } from "@/helpers/colors";
import { haptic } from "@/helpers/haptics";
import { useAuthStore } from "@/store/auth";
import { BlurView } from "expo-blur";
import { useEffect } from "react";
import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { Background } from "./background";
import { Scan } from "./scan";

export const SplashScreen = () => {
  const authenticated = useAuthStore((state) => state.authenticated);
  const [readyToScan, setReadyToScan] = useState(false);

  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 300
    });
  }, []);

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }));

  return (
    <Background>
      <BlurView
        style={styles.blurView}
        intensity={100}
        experimentalBlurMethod="dimezisBlurView"
      >
        <SafeAreaView style={{ flex: 1 }}>
          <Animated.View
            style={[
              opacityStyle,
              styles.container,
              { justifyContent: authenticated ? "center" : "space-between" }
            ]}
          >
            <Text style={styles.tape}>tape</Text>
            {!authenticated && (
              <>
                <Scan ready={readyToScan} />
                <View style={{ paddingHorizontal: 10, width: "100%" }}>
                  <AnimatedButton
                    onPress={() => {
                      if (!readyToScan) {
                        setReadyToScan(true);
                      }
                      haptic();
                    }}
                    text={readyToScan ? "Sign in" : "Scan now"}
                  />
                </View>
              </>
            )}
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
    fontSize: 52,
    lineHeight: 52,
    paddingVertical: 20,
    color: Colors.text
  },
  text: {
    fontFamily: "Sans",
    fontSize: 16,
    color: Colors.buttonText,
    textAlign: "center"
  }
});
