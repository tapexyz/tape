import "react-native-reanimated";
import { rqClient } from "@/components/providers/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { PressablesConfig } from "pressto";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NetInfoProvider } from "../components/providers/net-info";

export default function Layout() {
  useReactQueryDevTools(rqClient);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={rqClient}>
        <PressablesConfig animationType="spring">
          <SafeAreaProvider>
            <NetInfoProvider />
            <Slot />
          </SafeAreaProvider>
        </PressablesConfig>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
