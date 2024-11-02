import { HelloWave } from "@/components/hello-wave";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>Protected Home!</Text>
      <HelloWave />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Serif"
  }
});
