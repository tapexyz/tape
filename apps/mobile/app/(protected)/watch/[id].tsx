import { Colors } from "@/helpers/colors";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function WatchScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.wrapper}>
      <StatusBar style="dark" key="watch" />
      <View style={styles.container}>
        <Text>Watch {id}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background
  },
  container: {
    gap: 15,
    padding: 15,
    width: "100%",
    height: "100%",
    borderRadius: 25,
    backgroundColor: Colors.white
  }
});
