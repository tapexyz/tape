import "plyr-react/dist/plyr.css";

import Plyr from "plyr-react";
import React from "react";

const Player = React.memo(({ preview }: { preview: string }) => {
  return (
    <Plyr
      source={{
        sources: [
          {
            src: preview,
            provider: "html5",
          },
        ],
        type: "video",
      }}
    />
  );
});
Player.displayName = "Player";

const Video = () => {
  return (
    <div>
      <Player preview="http://media.w3.org/2010/05/sintel/trailer.mp4" />
    </div>
  );
};

export default Video;
