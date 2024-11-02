import { SplashScreen } from "@/components/shared/splash/screen";
import { useSession } from "@/store/auth";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "react-native-reanimated";

export default function RootLayout() {
  const { session, loading } = useSession();
  const [fontLoaded] = useFonts({
    Sans: require("../../assets/fonts/sans.ttf"),
    Serif: require("../../assets/fonts/serif.ttf")
  });

  if (!fontLoaded) {
    return null;
  }

  if (!session || loading) {
    return <SplashScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
