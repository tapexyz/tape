import { Colors } from "@/helpers/colors";
import { getShortHandTime } from "@/helpers/date-time";
import normalizeFont, { windowHeight } from "@/helpers/normalize-font";
import {
  getProfile,
  getProfilePicture,
  getPublication,
  getPublicationData,
  trimNewLines
} from "@tape.xyz/generic";
import type { FeedItem } from "@tape.xyz/lens/gql";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Media } from "./media";

type ItemProps = {
  item: FeedItem;
};

const height = windowHeight * 0.75;

export const Item = ({ item }: ItemProps) => {
  const publication = getPublication(item.root);
  const meta = getPublicationData(publication.metadata);
  const profileMeta = getProfile(publication.by);
  const textOnly = publication.metadata.__typename === "TextOnlyMetadataV3";
  const content = trimNewLines(meta?.content ?? "");

  return (
    <View style={[styles.itemContainer, { height }]}>
      <View style={styles.itemContent}>
        <View style={{ gap: 15 }}>
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
          {content && (
            <Link
              href={{
                pathname: "/watch/[id]",
                params: { id: publication.id }
              }}
            >
              <Text style={styles.itemText} numberOfLines={textOnly ? 20 : 10}>
                {content}
              </Text>
            </Link>
          )}
        </View>
        <Text style={styles.itemText}>
          {publication.__typename}/{publication.metadata.__typename}
        </Text>
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
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
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
