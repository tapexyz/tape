import { SplashScreen } from "@/components/splash/screen";
import { useAuthStore } from "@/store/auth";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "react-native-reanimated";

export default function RootLayout() {
  const authenticated = useAuthStore((state) => state.authenticated);

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
