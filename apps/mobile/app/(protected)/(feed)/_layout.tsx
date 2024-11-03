import { AnimatedButton } from "@/components/ui/animated-button";
import { useAuthStore } from "@/store/auth";
import { Slot } from "expo-router";
import { View } from "react-native";
import "react-native-reanimated";
import { EdgeGradient } from "@/components/shared/edge-gradient";
import Feather from "@expo/vector-icons/Feather";
import Octicons from "@expo/vector-icons/Octicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FeedLayout() {
  const signOut = useAuthStore((state) => state.signOut);
  const { top, bottom } = useSafeAreaInsets();

  return (
    <>
      <EdgeGradient />
      <Slot />
      <View style={{ position: "absolute", top, right: 15, zIndex: 1 }}>
        <AnimatedButton
          onPress={() => signOut()}
          style={{ width: 50, height: 50 }}
        >
          <Feather name="log-out" size={20} color="black" />
        </AnimatedButton>
      </View>
      <View style={{ position: "absolute", bottom, right: 15, zIndex: 1 }}>
        <AnimatedButton onPress={() => {}} style={{ width: 50, height: 50 }}>
          <Octicons name="plus" size={20} color="black" />
        </AnimatedButton>
      </View>
    </>
  );
}
