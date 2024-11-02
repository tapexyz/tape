import "react-native-reanimated";
import { rqClient } from "@/components/providers/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PressablesConfig } from "pressto";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={rqClient}>
        <StatusBar style="dark" animated />
        <PressablesConfig animationType="spring">
          <Slot />
        </PressablesConfig>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
