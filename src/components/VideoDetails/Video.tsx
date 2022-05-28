import "plyr-react/dist/plyr.css";

import Plyr from "plyr-react";
import React, { FC } from "react";
import { LenstubePublication } from "src/types/local";

const Player = React.memo(
  ({ source, thumbnail }: { source: string; thumbnail: string }) => {
    return (
      <Plyr
        autoPlay
        source={{
          type: "video",
          sources: [
            {
              src: source,
              provider: "html5",
            },
          ],
          poster: thumbnail,
        }}
      />
    );
  }
);

Player.displayName = "VideoPlayer";

type Props = {
  video: LenstubePublication;
};
const Video: FC<Props> = ({ video }) => {
  return (
    <div className="overflow-hidden rounded">
      <Player
        source={video.metadata.content}
        thumbnail={video.metadata.cover?.original.url}
      />
    </div>
  );
};

export default Video;
