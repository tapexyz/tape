import { Colors } from "@/helpers/colors";
import { haptic } from "@/helpers/haptics";
import { useSession } from "@/store/auth";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { PressableOpacity } from "pressto";
import { useEffect } from "react";
import { useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { Background } from "./background";
import { Scan } from "./scan";

const { width: screenWidth } = Dimensions.get("window");

export const SplashScreen = () => {
  const { session } = useSession();
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
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
        intensity={100}
        experimentalBlurMethod="dimezisBlurView"
      >
        <SafeAreaView style={{ flex: 1 }}>
          <Animated.View
            style={[
              {
                flex: 1,
                flexDirection: "column",
                justifyContent: session ? "center" : "space-between",
                alignItems: "center"
              },
              opacityStyle
            ]}
          >
            <Animated.Text style={styles.tape}>tape</Animated.Text>
            {!session && (
              <>
                <Scan ready={readyToScan} />
                <Animated.View style={{ paddingHorizontal: 10 }}>
                  <PressableOpacity
                    onPress={() => {
                      if (!readyToScan) {
                        setReadyToScan(true);
                      }
                      haptic();
                    }}
                  >
                    <LinearGradient
                      colors={["#FFFFFF", "#E3E3E3"]}
                      style={styles.button}
                    >
                      <Text style={styles.text}>
                        {readyToScan ? "Sign in" : "Scan QR"}
                      </Text>
                    </LinearGradient>
                  </PressableOpacity>
                </Animated.View>
              </>
            )}
          </Animated.View>
        </SafeAreaView>
      </BlurView>
    </Background>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    alignItems: "center",
    borderColor: "#22222220",
    width: screenWidth - 40,
    borderWidth: 0.5,
    borderRadius: 100
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
