import { profileByIdQuery } from "@/components/auth/queries";
import { AuthScreen } from "@/components/auth/screen";
import { useAuthStore } from "@/store/auth";
import { useActiveProfile } from "@/store/profile";
import { useQuery } from "@tanstack/react-query";
import type { Profile } from "@tape.xyz/lens/gql";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";

export default function RootLayout() {
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

  if (!hydrated) {
    return null;
  }

  if (!id) {
    return <AuthScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(feed)" />
      <Stack.Screen
        name="create"
        options={{ presentation: "fullScreenModal" }}
      />
    </Stack>
  );
}
