import { ThemedText } from "@/components/shared/themed-text";
import { useSession } from "@/store/auth";
import { Redirect, Stack } from "expo-router";
import "react-native-reanimated";

export default function RootLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <ThemedText>Loading...</ThemedText>;
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
