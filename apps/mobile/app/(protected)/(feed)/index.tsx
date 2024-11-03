import { List } from "@/components/feed/list";
import normalizeFont from "@/helpers/normalize-font";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <List />
    </View>
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
