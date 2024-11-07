import { Colors } from "@/helpers/colors";
import { getShortHandTime } from "@/helpers/date-time";
import normalizeFont, { windowHeight } from "@/helpers/normalize-font";
import {
  getProfile,
  getProfilePicture,
  getPublication,
  getPublicationData
} from "@tape.xyz/generic";
import type { FeedItem, PrimaryPublication } from "@tape.xyz/lens/gql";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { RenderMarkdown } from "../ui/render-markdown";
import { Actions } from "./actions";
import { Media } from "./media";

type ItemProps = {
  item: FeedItem;
};

const height = windowHeight * 0.75;

const Publication = ({ publication }: { publication: PrimaryPublication }) => {
  const meta = getPublicationData(publication.metadata);
  const profileMeta = getProfile(publication.by);
  const content = meta?.content ?? "";
  return (
    <View style={{ gap: 5 }}>
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
          <RenderMarkdown>{content}</RenderMarkdown>
        </Link>
      )}
    </View>
  );
};

export const Item = ({ item }: ItemProps) => {
  const publication = getPublication(item.root);
  const isQuote = publication.__typename === "Quote";

  return (
    <View style={[styles.itemContainer, { height }]}>
      <View style={styles.itemContent}>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <Publication publication={publication} />
          {isQuote && (
            <View style={styles.quoteContainer}>
              <Publication publication={publication.quoteOn} />
            </View>
          )}
        </View>

        {/* <Text style={styles.itemText}>
          {publication.__typename}/{publication.metadata.__typename}
        </Text> */}

        <Actions />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  quoteContainer: {
    padding: 15,
    borderColor: Colors.border,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 15
  },
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
    overflow: "hidden",
    backgroundColor: Colors.white
  },
  itemText: {
    fontFamily: "Sans",
    fontSize: normalizeFont(14)
  },
  itemHeader: {
    gap: 10,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center"
  }
});
