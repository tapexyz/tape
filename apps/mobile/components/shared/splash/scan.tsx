import { Colors } from "@/helpers/colors";
import { useSession } from "@/store/auth";
import { CameraView, useCameraPermissions } from "expo-camera";
import { PressableOpacity } from "pressto";
import { Linking, StyleSheet, Text, View } from "react-native";
import { Instructions } from "./instructions";

export const Scan = ({ ready }: { ready: boolean }) => {
  const { signIn } = useSession();
  const [permission, requestPermission] = useCameraPermissions();

  return (
    <View style={styles.container}>
      {!ready ? (
        <Instructions />
      ) : (
        <CameraView
          style={styles.camera}
          onBarcodeScanned={({ data }) => {
            signIn(data);
          }}
        >
          {permission?.granted ? (
            <Text style={styles.text}>Show QR</Text>
          ) : (
            <PressableOpacity
              onPress={() =>
                permission?.canAskAgain
                  ? requestPermission()
                  : Linking.openSettings()
              }
            >
              <Text style={styles.text}>Allow camera?</Text>
            </PressableOpacity>
          )}
        </CameraView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center"
  },
  camera: {
    height: 200,
    width: 200,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden"
  },
  text: {
    color: Colors.white
  }
});
