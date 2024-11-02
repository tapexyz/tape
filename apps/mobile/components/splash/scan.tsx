import { Colors } from "@/helpers/colors";
import { haptic } from "@/helpers/haptics";
import normalizeFont from "@/helpers/normalize-font";
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import { parseJwt } from "@tape.xyz/generic";
import type { Profile } from "@tape.xyz/lens/gql";
import { CameraView, useCameraPermissions } from "expo-camera";
import { PressableOpacity } from "pressto";
import { useState } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { rqClient } from "../providers/react-query";
import { AnimatedButton } from "../ui/animated-button";
import { Instructions } from "./instructions";
import { ProfileView } from "./profile";
import { profileByIdQuery, tokensQuery } from "./queries";

export const Scan = () => {
  const [readyToScan, setReadyToScan] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [tempToken, setTempToken] = useState<string | null>(null);

  const [permission, requestPermission] = useCameraPermissions();

  const signIn = useAuthStore((state) => state.signIn);
  const { data } = useQuery(profileByIdQuery(profileId));
  const profile = data?.profile as Profile;

  const requestPermissionHandler = () => {
    if (permission?.canAskAgain) {
      requestPermission();
    } else {
      Linking.openSettings();
    }
    haptic();
  };

  const signUserIn = async () => {
    const { refresh } = await rqClient.fetchQuery(tokensQuery(tempToken));

    if (refresh) {
      signIn({
        accessToken: refresh.accessToken,
        refreshToken: refresh.refreshToken
      });
    }
  };

  return (
    <>
      <View style={styles.container}>
        {readyToScan ? (
          profile ? (
            <ProfileView profile={profile} />
          ) : (
            <CameraView
              style={styles.camera}
              onBarcodeScanned={({ data }) => {
                const id = parseJwt(data)?.id;
                if (!id) return;
                setProfileId(id);
                setTempToken(data);
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
          )
        ) : (
          <Instructions />
        )}
      </View>
      <View style={{ paddingHorizontal: 10, width: "100%" }}>
        <AnimatedButton
          style={{ padding: 15 }}
          onPress={() => {
            if (!readyToScan) {
              setReadyToScan(true);
            }
            if (profile) {
              signUserIn();
            }
            haptic();
          }}
        >
          <Text style={styles.buttonText}>
            {readyToScan ? "Sign in" : "Scan now"}
          </Text>
        </AnimatedButton>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center"
  },
  camera: {
    height: 250,
    width: 250,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden"
  },
  text: {
    fontFamily: "Sans",
    color: Colors.white
  },
  buttonText: {
    fontFamily: "Sans",
    fontSize: normalizeFont(14),
    color: "#000",
    textAlign: "center"
  }
});
