import { Colors } from "@/helpers/colors";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WatchScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" key="watch" />
      <SafeAreaView style={styles.container}>
        <Text>Watch {id}</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    width: "100%",
    height: "100%",
    backgroundColor: Colors.white
  }
});
