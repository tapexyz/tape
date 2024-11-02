import "react-native-reanimated";
import { rqClient } from "@/components/providers/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { PressablesConfig } from "pressto";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={rqClient}>
        <PressablesConfig animationType="spring">
          <SafeAreaProvider>
            <Slot />
          </SafeAreaProvider>
        </PressablesConfig>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
