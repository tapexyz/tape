import { Colors } from "@/helpers/colors";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useState } from "react";
import {
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { AnimatedButton } from "../ui/animated-button";

export const CreateScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const hasPermission = permission?.granted;
  const [cameraKey, setCameraKey] = useState(0);
  const [camera, setCamera] = useState<CameraView | null>(null);

  const requestPermissionHandler = async () => {
    if (hasPermission) return;
    if (!permission?.canAskAgain) {
      Linking.openSettings();
      return;
    }
    const { granted } = await requestPermission();
    if (granted) {
      setCameraKey((prev) => prev + 1);
    }
  };

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

  const swipeGesture = Gesture.Pan().onEnd((event) => {
    "worklet";
    if (event.translationY > 100) {
      runOnJS(router.back)();
    }
  });

  return (
    <View style={{ flex: 1, backgroundColor: Colors.black }}>
      <GestureDetector gesture={swipeGesture}>
        <CameraView
          ref={(ref) => setCamera(ref)}
          key={cameraKey}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={styles.overlay}>
            {!hasPermission ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={requestPermissionHandler}
              >
                <Text style={styles.text}>Allow camera?</Text>
              </TouchableOpacity>
            ) : null}
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
          </SafeAreaView>
        </CameraView>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "Sans",
    color: Colors.white
  },
  overlay: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end"
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    backgroundColor: Colors.white
  }
});
