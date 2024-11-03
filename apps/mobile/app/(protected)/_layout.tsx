import { SplashScreen } from "@/components/splash/screen";
import { useAuthStore } from "@/store/auth";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";

export default function RootLayout() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const authenticated = useAuthStore((state) => state.authenticated);

  useEffect(() => {
    hydrate();
  }, []);

  const [fontLoaded] = useFonts({
    Sans: require("../../assets/fonts/sans.ttf"),
    Serif: require("../../assets/fonts/serif.ttf")
  });

  if (!fontLoaded) {
    return null;
  }

  if (!authenticated) {
    return <SplashScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
