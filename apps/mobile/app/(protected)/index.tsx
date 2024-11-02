import { HelloWave } from "@/components/hello-wave";
import normalizeFont from "@/helpers/normalize-font";
import { useAuthStore } from "@/store/auth";
import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const signOut = useAuthStore((state) => state.signOut);
  return (
    <View style={styles.titleContainer}>
      <StatusBar style="dark" />
      <Text style={styles.title}>Protected Home!</Text>
      <HelloWave />
      <Button title="Sign out" onPress={() => signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 50
  },
  title: {
    fontSize: normalizeFont(24),
    fontWeight: "bold",
    fontFamily: "Serif"
  }
});
