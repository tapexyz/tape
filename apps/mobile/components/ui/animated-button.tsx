import normalizeFont from "@/helpers/normalize-font";
import { LinearGradient } from "expo-linear-gradient";
import { PressableOpacity } from "pressto";
import type React from "react";
import { StyleSheet, Text, type TextStyle, type ViewStyle } from "react-native";

interface AnimatedButtonProps {
  onPress: () => void;
  text: string;
  colors?: string[];
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  onPress,
  text,
  colors = ["#FFFFFF", "#E3E3E3"],
  buttonStyle = {},
  textStyle = {}
}) => {
  return (
    <PressableOpacity onPress={onPress}>
      <LinearGradient colors={colors} style={[styles.button, buttonStyle]}>
        <Text style={[styles.text, textStyle]}>{text}</Text>
      </LinearGradient>
    </PressableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    alignItems: "center",
    borderRadius: 100,
    borderColor: "#22222220",
    borderWidth: 0.5
  },
  text: {
    fontFamily: "Sans",
    fontSize: normalizeFont(14),
    color: "#000",
    textAlign: "center"
  }
});
