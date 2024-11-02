import normalizeFont from "@/helpers/normalize-font";
import { getProfile } from "@tape.xyz/generic";

import { getProfilePicture } from "@tape.xyz/generic";
import type { Profile as ProfileType } from "@tape.xyz/lens/gql";
import { Image } from "expo-image";
import { Text, View } from "react-native";

export const ProfileView = ({ profile }: { profile: ProfileType }) => {
  return (
    <View style={{ alignItems: "center", gap: 10 }}>
      <Image
        source={{ uri: getProfilePicture(profile) }}
        style={{ width: 50, borderRadius: 100, height: 50 }}
      />
      <Text style={{ fontFamily: "Sans", fontSize: normalizeFont(16) }}>
        {getProfile(profile).slugWithPrefix}
      </Text>
    </View>
  );
};
