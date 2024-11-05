import { AnimatedButton } from "@/components/ui/animated-button";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function CreateModal() {
  return (
    <View style={styles.container}>
      <Text>Modal screen</Text>
      <AnimatedButton onPress={() => router.back()}>
        <Text>Back</Text>
      </AnimatedButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
