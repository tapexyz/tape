import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoCopyOutline } from "react-icons/io5";
import { useCopyToClipboard } from "usehooks-ts";

const StreamDetails = () => {
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [, copy] = useCopyToClipboard();

  const onCopyKey = (value: string) => {
    copy(value);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="mt-2">
      <h1 className="text-xs font-semibold uppercase">Stream Details</h1>
      <div className="mt-2 md:mt-4">
        <div className="grid grid-cols-2 text-sm">
          <div className="mb-2 opacity-50">Stream name</div>
          <div>My first stream</div>
          <div className="mb-2 opacity-50">Stream key</div>
          <div>
            <div className="flex items-center space-x-2 text-left">
              {showStreamKey ? (
                <span>04a9-vs3-fot9-7yq</span>
              ) : (
                <button
                  type="button"
                  className="hover:opacity-60 focus:outline-none"
                  onClick={() => setShowStreamKey((show) => !show)}
                >
                  Reveal key
                </button>
              )}
              <button
                className="hover:opacity-60 focus:outline-none"
                onClick={() => onCopyKey("04a9-vs3-fot9-7yq")}
                type="button"
              >
                <IoCopyOutline />
              </button>
            </div>
          </div>
          <div className="mb-2 opacity-50">Stream URL</div>
          <div>rtmp://rtmp.livepeer.com/live</div>
          <div className="mb-2 opacity-50">Stream ID</div>
          <div>04a9e50b-76c9-473a-b88d-a5848220ca</div>
        </div>
      </div>
    </div>
  );
};

export default StreamDetails;
