import { AnimatedButton } from "@/components/ui/animated-button";
import { Slot } from "expo-router";
import { View } from "react-native";
import "react-native-reanimated";
import { EdgeGradient } from "@/components/shared/edge-gradient";
import Octicons from "@expo/vector-icons/Octicons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FeedLayout() {
  const { bottom } = useSafeAreaInsets();

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={{ flex: 1 }}
    >
      <EdgeGradient />
      <Slot />
      <View style={{ position: "absolute", bottom, right: 10, zIndex: 1 }}>
        <AnimatedButton onPress={() => {}} style={{ width: 55, height: 55 }}>
          <Octicons name="plus" size={25} color="black" />
        </AnimatedButton>
      </View>
    </Animated.View>
  );
}
