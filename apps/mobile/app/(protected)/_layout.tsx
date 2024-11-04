import { profileByIdQuery } from "@/components/splash/queries";
import { SplashScreen } from "@/components/splash/screen";
import { useAuthStore } from "@/store/auth";
import { useActiveProfile } from "@/store/profile";
import { useQuery } from "@tanstack/react-query";
import type { Profile } from "@tape.xyz/lens/gql";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";

export default function RootLayout() {
  const [fontLoaded] = useFonts({
    Sans: require("../../assets/fonts/sans.ttf"),
    SansM: require("../../assets/fonts/sans-m.ttf"),
    SansSB: require("../../assets/fonts/sans-sb.ttf"),
    SansB: require("../../assets/fonts/sans-b.ttf"),
    Serif: require("../../assets/fonts/serif.ttf")
  });

  const id = useAuthStore((state) => state.session.id);
  const hydrate = useAuthStore((state) => state.hydrate);
  const hydrated = useAuthStore((state) => state.hydrated);
  const setActiveProfile = useActiveProfile((state) => state.setProfile);

  const { data } = useQuery(profileByIdQuery(id));
  useEffect(() => {
    if (data?.profile) {
      setActiveProfile(data.profile as Profile);
    }
  }, [data]);

  useEffect(() => {
    hydrate();
  }, []);

  if (!fontLoaded || !hydrated) {
    return null;
  }

  if (!id) {
    return <SplashScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(feed)" />
    </Stack>
  );
}
