import normalizeFont from "@/helpers/normalize-font";
import { useAuthStore } from "@/store/auth";
import { useActiveProfile } from "@/store/profile";
import { getProfilePicture } from "@tape.xyz/generic";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimatedButton } from "../ui/animated-button";

export const Header = () => {
  const { top } = useSafeAreaInsets();
  const signOut = useAuthStore((state) => state.signOut);
  const profile = useActiveProfile((state) => state.profile);

  return (
    <View style={[styles.header, { paddingTop: top }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.tabTitle}>Latest</Text>
      </View>
      <AnimatedButton
        onPress={() => signOut()}
        style={{ width: 35, height: 35 }}
      >
        <Image
          contentFit="cover"
          style={StyleSheet.absoluteFillObject}
          source={{ uri: getProfilePicture(profile) }}
        />
      </AnimatedButton>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10
  },
  tabTitle: {
    fontSize: normalizeFont(20),
    fontFamily: "Serif"
  }
});
