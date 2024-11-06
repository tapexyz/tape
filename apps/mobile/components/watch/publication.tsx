import { useQuery } from "@tanstack/react-query";
import { getPublicationData } from "@tape.xyz/generic";
import { getPublication } from "@tape.xyz/generic";
import type { AnyPublication } from "@tape.xyz/lens/gql";
import { View } from "react-native";
import { RenderMarkdown } from "../ui/render-markdown";
import { publicationQuery } from "./queries";

export const Publication = ({ id }: { id: string }) => {
  const { data } = useQuery(publicationQuery(id));

  const publication = getPublication(data?.publication as AnyPublication);
  const meta = getPublicationData(publication.metadata);

  return (
    <View>
      {meta?.content && <RenderMarkdown content={meta?.content} lines={20} />}
    </View>
  );
};
