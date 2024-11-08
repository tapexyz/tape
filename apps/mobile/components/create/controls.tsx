import { Colors } from "@/helpers/colors";
import type { CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { ImageUp, SwitchCamera } from "lucide-react-native";
import { useCallback, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { AnimatedButton } from "../ui/animated-button";

type ControlsProps = {
  camera: CameraView;
  toggleFacing: () => void;
};

export const Controls = ({ camera, toggleFacing }: ControlsProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.info(result);

    if (!result.canceled) {
      setSelectedMedia(result.assets[0].uri);
    }
  };

  const takePhoto = useCallback(async () => {
    if (!camera || isCapturing) return;

    setIsCapturing(true);
    try {
      const photo = await camera.takePictureAsync({
        quality: 1,
        base64: false
      });
      console.info(photo?.uri);
    } catch (err) {
      console.error("Failed to take picture:", err);
    } finally {
      setIsCapturing(false);
    }
  }, [camera, isCapturing]);

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.8} onPress={pickImage}>
        <ImageUp size={24} color={Colors.white} strokeWidth={1.5} />
      </TouchableOpacity>
      <AnimatedButton
        style={{ width: 75, height: 75, padding: 5 }}
        onPress={takePhoto}
        disabled={isCapturing}
      >
        <View style={styles.shutter} />
      </AnimatedButton>
      <TouchableOpacity activeOpacity={0.8} onPress={toggleFacing}>
        <SwitchCamera size={24} color={Colors.white} strokeWidth={1.5} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 15
  },
  shutter: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.white
  }
});
