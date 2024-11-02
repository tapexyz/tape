import { Colors } from "@/constants/colors";
import { useSession } from "@/store/auth";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { PressableScale } from "pressto";
import { useEffect } from "react";
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing
} from "react-native-reanimated";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
const AnimatedExpoImage = Animated.createAnimatedComponent(Image);

export const SplashScreen = () => {
  const { session, isLoading } = useSession();
  const rotation = useSharedValue(0);
  const translateYText = useSharedValue(0);
  const translateYButton = useSharedValue(0);

  useEffect(() => {
    rotation.value = withTiming(360 * 1000, {
      duration: 20000 * 1000,
      easing: Easing.linear
    });
  }, []);

  useEffect(() => {
    if (!isLoading && !session) {
      translateYText.value = withTiming(-(screenHeight * 0.3), {
        duration: 600,
        easing: Easing.inOut(Easing.ease)
      });
      translateYButton.value = withTiming(screenHeight * 0.35, {
        duration: 600,
        easing: Easing.inOut(Easing.ease)
      });
    }
  }, [isLoading]);

  const translateYTextStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateYText.value }]
  }));

  const translateYButtonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateYButton.value }]
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value % 360}deg` }]
  }));

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors.secondaryBackground
      }}
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
      <BlurView
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
        intensity={100}
      >
        <StatusBar hidden />
        <SafeAreaView
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Animated.Text style={[styles.tape, translateYTextStyle]}>
            tape
          </Animated.Text>
          {!session && (
            <Animated.View
              style={[{ paddingHorizontal: 10 }, translateYButtonStyle]}
            >
              <PressableScale
                style={{
                  paddingVertical: 15,
                  width: screenWidth - 40,
                  backgroundColor: Colors.background,
                  borderRadius: 100
                }}
                onPress={() => console.log("scale")}
              >
                <Text style={styles.text}>Sign in</Text>
              </PressableScale>
            </Animated.View>
          )}
        </SafeAreaView>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  tape: {
    fontFamily: "Serif",
    fontSize: 52,
    lineHeight: 52,
    paddingVertical: 50,
    color: Colors.text
  },
  text: {
    fontFamily: "Sans",
    fontSize: 16,
    color: Colors.text,
    textAlign: "center"
  }
});
