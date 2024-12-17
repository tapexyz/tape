import { ExplorePage } from "@/components/explore/page";
import { createFileRoute } from "@tanstack/react-router";

const media = ["all", "videos", "livestreams", "audios"] as const;

type ExploreSearchParams = {
  media: (typeof media)[number];
};

export const Route = createFileRoute("/_layout-hoc/_home-hoc/explore")({
  validateSearch: (search: Record<string, unknown>): ExploreSearchParams => {
    return {
      media: media.includes(search.media as ExploreSearchParams["media"])
        ? (search.media as ExploreSearchParams["media"])
        : "all"
    };
  },
  component: ExplorePage
});
