import "react-native-reanimated";
import { rqClient, rqPersister } from "@/components/providers/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Slot } from "expo-router";
import { PressablesConfig } from "pressto";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NetInfoProvider } from "../components/providers/net-info";

export default function Layout() {
  useReactQueryDevTools(rqClient);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PersistQueryClientProvider
        client={rqClient}
        persistOptions={{ persister: rqPersister }}
      >
        <PressablesConfig animationType="spring">
          <SafeAreaProvider>
            <NetInfoProvider />
            <Slot />
          </SafeAreaProvider>
        </PressablesConfig>
      </PersistQueryClientProvider>
    </GestureHandlerRootView>
  );
}
