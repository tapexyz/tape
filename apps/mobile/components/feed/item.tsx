import { Colors } from "@/helpers/colors";
import { getShortHandTime } from "@/helpers/date-time";
import normalizeFont, { windowHeight } from "@/helpers/normalize-font";
import {
  getProfile,
  getProfilePicture,
  getPublication,
  getPublicationData
} from "@tape.xyz/generic";
import type { FeedItem } from "@tape.xyz/lens/gql";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { RenderMarkdown } from "../ui/render-markdown";
import { Media } from "./media";

type ItemProps = {
  item: FeedItem;
};

const height = windowHeight * 0.75;

export const Item = ({ item }: ItemProps) => {
  const publication = getPublication(item.root);
  const meta = getPublicationData(publication.metadata);
  const profileMeta = getProfile(publication.by);

  return (
    <View style={[styles.itemContainer, { height }]}>
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Image
            source={{ uri: getProfilePicture(publication.by) }}
            style={{ width: 40, height: 40, borderRadius: 10 }}
            contentFit="cover"
          />
          <View>
            <Text
              style={{
                fontFamily: "SansSB",
                fontSize: normalizeFont(14),
                letterSpacing: -0.3
              }}
            >
              {profileMeta?.displayName}
            </Text>
            <Text
              style={{
                fontFamily: "Sans",
                fontSize: normalizeFont(12),
                color: Colors.textSecondary
              }}
            >
              /{profileMeta.slug} ⋅ {getShortHandTime(publication.createdAt)}
            </Text>
          </View>
        </View>
        {meta && <Media meta={meta} />}
        {meta?.content && <RenderMarkdown content={meta.content} />}
        <Text style={styles.itemText}>{publication.__typename}</Text>
        <Text style={styles.itemText}>{publication.metadata.__typename}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: "100%",
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  itemContent: {
    gap: 15,
    padding: 15,
    width: "100%",
    height: "100%",
    borderRadius: 25,
    backgroundColor: Colors.white
  },
  itemText: {
    fontFamily: "Sans",
    fontSize: normalizeFont(14)
  },
  itemHeader: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center"
  }
});
