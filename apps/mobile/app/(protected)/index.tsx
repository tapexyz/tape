import { AnimatedButton } from "@/components/ui/animated-button";
import normalizeFont from "@/helpers/normalize-font";
import { useAuthStore } from "@/store/auth";
import { Octicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets
} from "react-native-safe-area-context";

export default function HomeScreen() {
  const signOut = useAuthStore((state) => state.signOut);
  const { bottom } = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={{ position: "absolute", bottom, right: 25 }}>
        <AnimatedButton onPress={() => {}} style={{ width: 50, height: 50 }}>
          <Octicons name="plus" size={20} color="black" />
        </AnimatedButton>
      </View>

      <Button title="Sign out" onPress={() => signOut()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: normalizeFont(24),
    fontWeight: "bold",
    fontFamily: "Serif"
  }
});
