import { Colors } from "@/helpers/colors";
import { windowHeight } from "@/helpers/normalize-font";
import { type CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { Controls } from "./controls";

export const CreateScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const hasPermission = permission?.granted;

  const [zoom, setZoom] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [cameraKey, setCameraKey] = useState(0);
  const [facing, setFacing] = useState<CameraType>("back");
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
  const THRESHOLD = windowHeight * 0.125;
  const SENSITIVITY = 1200;

  const zoomSwipeGesture = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(0)
        .activeOffsetY([-20, 20])
        .onUpdate((event) => {
          "worklet";
          const startY = event.absoluteY;
          if (startY > THRESHOLD && startY < windowHeight - THRESHOLD) {
            const targetZoom = Math.min(
              Math.max(event.translationY / -SENSITIVITY, 0),
              1
            );
            const newZoom = zoom + (targetZoom - zoom) * 0.3;
            runOnJS(setZoom)(newZoom);
          }
        }),
    [zoom]
  );

  const swipeDownCloseGesture = useMemo(
    () =>
      Gesture.Pan().onEnd((event) => {
        "worklet";
        if (event.translationY > 100) {
          runOnJS(router.back)();
        }
      }),
    []
  );

  const toggleFacing = useCallback(() => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  }, []);

  const cameraProps = useMemo(
    () => ({
      zoom,
      mode: "video" as const,
      facing,
      style: { flex: 1 },
      videoStabilizationMode: "auto" as const,
      onCameraReady: () => setIsReady(true)
    }),
    [zoom, facing]
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.black }}>
      <GestureDetector gesture={swipeDownCloseGesture}>
        <CameraView
          {...cameraProps}
          key={cameraKey}
          ref={(ref) => setCamera(ref)}
        >
          <SafeAreaView style={styles.overlay}>
            <View />
            {!isReady && <ActivityIndicator color={Colors.white} />}
            {!hasPermission ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={requestPermissionHandler}
              >
                <Text style={styles.text}>Allow camera?</Text>
              </TouchableOpacity>
            ) : null}
            {camera && <Controls camera={camera} toggleFacing={toggleFacing} />}
            <GestureDetector gesture={zoomSwipeGesture}>
              <View style={styles.rightHitSlop} />
            </GestureDetector>
          </SafeAreaView>
        </CameraView>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  rightHitSlop: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 20,
    height: windowHeight,
    zIndex: 100
  },
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
