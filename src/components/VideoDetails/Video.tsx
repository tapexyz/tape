import "plyr-react/dist/plyr.css";

import Plyr from "plyr-react";
import React from "react";

const Player = React.memo(({ source }: { source: string }) => {
  return (
    <Plyr
      autoPlay={true}
      source={{
        sources: [
          {
            src: source,
            provider: "html5",
          },
        ],
        type: "video",
      }}
    />
  );
});

Player.displayName = "VideoPlayer";

const Video = () => {
  return (
    <div className="overflow-hidden rounded">
      <Player source="http://media.w3.org/2010/05/sintel/trailer.mp4" />
    </div>
  );
};

export default Video;
