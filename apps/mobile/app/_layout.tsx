import "react-native-reanimated";
import { SplashScreen } from "@/components/shared/splash-screen";
import { SessionProvider } from "@/store/auth";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as ExpoSplash from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

ExpoSplash.preventAutoHideAsync();

export default function Layout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Sans: require("../assets/fonts/sans.ttf"),
    Serif: require("../assets/fonts/serif.ttf")
  });

  useEffect(() => {
    if (loaded) {
      ExpoSplash.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return <SplashScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SessionProvider>
        <Slot />
      </SessionProvider>
    </ThemeProvider>
  );
}
