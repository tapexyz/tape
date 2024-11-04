import { SplashScreen } from "@/components/splash/screen";
import { useAuthStore } from "@/store/auth";
import { useActiveProfile } from "@/store/profile";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function RootLayout() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const profile = useActiveProfile((state) => state.profile);
  const authenticated = useAuthStore((state) => state.authenticated);

  useEffect(() => {
    hydrate();
  }, []);

  const [fontLoaded] = useFonts({
    Sans: require("../../assets/fonts/sans.ttf"),
    SansM: require("../../assets/fonts/sans-m.ttf"),
    SansSB: require("../../assets/fonts/sans-sb.ttf"),
    SansB: require("../../assets/fonts/sans-b.ttf"),
    Serif: require("../../assets/fonts/serif.ttf")
  });

  if (!fontLoaded) {
    return null;
  }

  if (!authenticated || !profile) {
    return (
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        style={{ flex: 1 }}
      >
        <SplashScreen />
      </Animated.View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(feed)" />
    </Stack>
  );
}
