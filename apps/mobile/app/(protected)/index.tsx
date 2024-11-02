import { HelloWave } from "@/components/hello-wave";
import { useSession } from "@/store/auth";
import { Button, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { signOut } = useSession();
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>Protected Home!</Text>
      <HelloWave />
      <Button title="Sign Out" onPress={() => signOut()} />
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
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Serif"
  }
});
