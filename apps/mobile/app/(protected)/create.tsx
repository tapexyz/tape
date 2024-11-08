import { CreateScreen } from "@/components/create/screen";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

export default function CreateModal() {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <CreateScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
