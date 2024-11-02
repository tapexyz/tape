import "react-native-reanimated";
import { SessionProvider } from "@/store/auth";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PressablesConfig } from "pressto";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SessionProvider>
        <StatusBar style="dark" animated />
        <PressablesConfig animationType="spring">
          <Slot />
        </PressablesConfig>
      </SessionProvider>
    </GestureHandlerRootView>
  );
}
