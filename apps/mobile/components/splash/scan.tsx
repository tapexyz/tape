import { Colors } from "@/helpers/colors";
import { haptic } from "@/helpers/haptics";
import { useAuthStore } from "@/store/auth";
import { parseJwt } from "@tape.xyz/generic";
import { CameraView, useCameraPermissions } from "expo-camera";
import { PressableOpacity } from "pressto";
import { Linking, StyleSheet, Text, View } from "react-native";
import { rqClient } from "../providers/react-query";
import { Instructions } from "./instructions";
import { profileByIdQuery, tokensQuery } from "./queries";

export const Scan = ({ ready }: { ready: boolean }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const signIn = useAuthStore((state) => state.signIn);

  const requestPermissionHandler = () => {
    if (permission?.canAskAgain) {
      requestPermission();
    } else {
      Linking.openSettings();
    }
    haptic();
  };

  const onScan = async (data: string) => {
    const id = parseJwt(data)?.id;
    if (!id) return;

    const { profile } = await rqClient.fetchQuery(profileByIdQuery(id));
    const { refresh } = await rqClient.fetchQuery(tokensQuery(data));

    if (profile && refresh) {
      signIn({
        accessToken: refresh.accessToken,
        refreshToken: refresh.refreshToken
      });
    }
  };

  return (
    <View style={styles.container}>
      {ready ? (
        <CameraView
          style={styles.camera}
          onBarcodeScanned={({ data }) => onScan(data)}
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
