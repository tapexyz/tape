import Modal from "@components/ui/Modal";
import useAppStore from "@lib/store";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { HiOutlineStatusOnline } from "react-icons/hi";

const GoLive = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { selectedChannel } = useAppStore();
  const router = useRouter();

  const {
    query: { live },
    push,
  } = useRouter();

  useEffect(() => {
    if (live) setShowUploadModal(true);
  }, [live]);

  const onCloseUploadModal = () => {
    setShowUploadModal(false);
    push(selectedChannel?.handle, undefined, { shallow: true });
  };

  return (
    <Modal
      onClose={() => onCloseUploadModal()}
      show={showUploadModal}
      panelClassName="max-w-xl max-h-[80vh]"
      title={
        <span className="inline-flex items-center space-x-2">
          <HiOutlineStatusOnline className="text-red-500" />
          <span className="whitespace-nowrap">Go Live</span>
        </span>
      }
    >
      <div className="flex w-full h-full mt-4 divide-x divide-gray-200 dark:divide-gray-800">
        <button
          onClick={() => router.push(`/${selectedChannel?.handle}/live`)}
          className="flex flex-col items-center flex-1 p-10 space-y-2 transition duration-300 ease-in-out rounded-l-lg focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-900"
        >
          <span>Right now</span>
          <p className="text-xs opacity-50">
            Let's go! Set up to live stream now.
          </p>
        </button>
        <button
          onClick={() => router.push(`/${selectedChannel?.handle}/schedule`)}
          className="flex flex-col items-center flex-1 p-10 space-y-2 transition duration-300 ease-in-out rounded-r-lg focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-900"
        >
          <span>Schedule</span>
          <p className="text-xs opacity-50">
            Schedule a stream for a later time.
          </p>
        </button>
      </div>
    </Modal>
  );
};

export default GoLive;
