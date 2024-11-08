import { Colors } from "@/helpers/colors";
import type { CameraView } from "expo-camera";
import { View } from "react-native";
import { AnimatedButton } from "../ui/animated-button";

export const Actions = ({ camera }: { camera: CameraView }) => {
  const takePhoto = async () => {
    if (!camera) return;

    try {
      const photo = await camera.takePictureAsync({
        quality: 1,
        base64: false
      });

      console.info(photo?.uri);
    } catch (err) {
      console.error("Failed to take picture:", err);
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: 15,
        paddingBottom: 15
      }}
    >
      <AnimatedButton
        style={{ width: 75, height: 75, padding: 5 }}
        onPress={() => takePhoto()}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 100,
            borderWidth: 2,
            borderColor: Colors.black,
            backgroundColor: Colors.white
          }}
        />
      </AnimatedButton>
    </View>
  );
};
