import { AudioPlayer } from "@components/common/AudioPlayer";
import { Button } from "@components/ui/Button";
import useAppStore from "@lib/store";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";

const PodPlayer = () => {
  const { selectPodUrl, setSelectedPodUrl } = useAppStore();

  if (!selectPodUrl) return null;

  return (
    <div className="flex items-center justify-between pb-4">
      <AudioPlayer selectPodUrl={selectPodUrl} />
      <Button
        onClick={() => setSelectedPodUrl(null)}
        variant="primary"
        className="!p-1"
      >
        <AiOutlineClose />
      </Button>
    </div>
  );
};

export default PodPlayer;
