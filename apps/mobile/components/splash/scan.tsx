import { Colors } from "@/helpers/colors";
import { haptic } from "@/helpers/haptics";
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import { parseJwt } from "@tape.xyz/generic";
import { CameraView, useCameraPermissions } from "expo-camera";
import { PressableOpacity } from "pressto";
import { Linking, StyleSheet, Text, View } from "react-native";
import { Instructions } from "./instructions";
import { tokensQuery } from "./queries";

export const Scan = ({ ready }: { ready: boolean }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const session = useAuthStore((state) => state.session);
  const signIn = useAuthStore((state) => state.signIn);

  const { data: tokens } = useQuery(tokensQuery(session.accessToken));
  console.log("🚀 ~ Scan ~ tokens:", tokens);

  const requestPermissionHandler = () => {
    if (permission?.canAskAgain) {
      requestPermission();
    } else {
      Linking.openSettings();
    }
    haptic();
  };

  return (
    <View style={styles.container}>
      {ready ? (
        <CameraView
          style={styles.camera}
          onBarcodeScanned={({ data }) => {
            const id = parseJwt(data)?.id;
            if (id) {
              signIn({ accessToken: null, refreshToken: data });
            }
          }}
        >
          {permission?.granted ? (
            <Text style={styles.text}>Show QR</Text>
          ) : (
            <PressableOpacity onPress={requestPermissionHandler}>
              <Text style={styles.text}>Allow camera?</Text>
            </PressableOpacity>
          )}
        </CameraView>
      ) : (
        <Instructions />
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
