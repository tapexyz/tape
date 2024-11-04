import { Colors } from "@/helpers/colors";
import Octicons from "@expo/vector-icons/Octicons";
import { ResizeMode, Video } from "expo-av";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AnimatedButton } from "../ui/animated-button";

type MVideoProps = {
  uri: string;
  cover: string;
};

export const MVideo = ({ uri, cover }: MVideoProps) => {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      <Video
        source={{ uri }}
        posterSource={{ uri: cover }}
        style={styles.asset}
        useNativeControls={false}
        resizeMode={ResizeMode.COVER}
        shouldPlay={!isMuted}
        isMuted={isMuted}
      />
      <View
        style={{
          position: "absolute",
          right: 10,
          bottom: 10,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <AnimatedButton
          onPress={() => setIsMuted(!isMuted)}
          style={{ width: 30, height: 30 }}
        >
          <Octicons
            size={14}
            name={isMuted ? "mute" : "unmute"}
            color={Colors.textSecondary}
            style={{ marginTop: 0.5 }}
          />
        </AnimatedButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  asset: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.background
  }
});
