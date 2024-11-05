import { Colors } from "@/helpers/colors";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function WatchScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" key="watch" />
      <Text>Watch</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  }
});
