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
import { Actions } from "./actions";

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
            <View />
            {!hasPermission ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={requestPermissionHandler}
              >
                <Text style={styles.text}>Allow camera?</Text>
              </TouchableOpacity>
            ) : null}
            {camera && <Actions camera={camera} />}
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
    justifyContent: "space-between",
    alignItems: "center"
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
