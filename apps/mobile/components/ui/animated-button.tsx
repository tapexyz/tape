import { Colors } from "@/helpers/colors";
import { haptic } from "@/helpers/haptics";
import { LinearGradient } from "expo-linear-gradient";
import { PressableOpacity } from "pressto";
import type React from "react";
import { StyleSheet, type ViewStyle } from "react-native";

interface AnimatedButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  colors?: string[];
  style?: ViewStyle;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  onPress,
  children,
  colors = ["#FFFFFF", "#E3E3E3"],
  style = {}
}) => {
  return (
    <PressableOpacity
      onPress={() => {
        onPress();
        haptic();
      }}
    >
      <LinearGradient colors={colors} style={[styles.button, style]}>
        {children}
      </LinearGradient>
    </PressableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    borderWidth: 0.5,
    borderColor: Colors.border
  }
});
