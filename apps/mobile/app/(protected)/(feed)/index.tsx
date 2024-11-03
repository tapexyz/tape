import { List } from "@/components/feed/list";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" key="feed" />
      <List />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
