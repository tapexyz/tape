import { Colors } from "@/helpers/colors";
import { ResizeMode, Video } from "expo-av";
import { Volume2, VolumeOff } from "lucide-react-native";
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
        isMuted={isMuted}
        style={styles.asset}
        shouldPlay={!isMuted}
        useNativeControls={false}
        posterSource={{ uri: cover }}
        resizeMode={ResizeMode.COVER}
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
          {isMuted ? (
            <VolumeOff
              size={14}
              color={Colors.textSecondary}
              strokeWidth={1.5}
            />
          ) : (
            <Volume2
              size={14}
              color={Colors.textSecondary}
              strokeWidth={1.5}
              style={{ marginTop: 0.5 }}
            />
          )}
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
