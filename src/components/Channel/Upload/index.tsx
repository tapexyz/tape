import "plyr-react/dist/plyr.css";

import Modal from "@components/ui/Modal";
import useAppStore from "@lib/store";
import clsx from "clsx";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { FiUpload } from "react-icons/fi";

import Details from "./Details";

export type VideoUpload = {
  buffer: Buffer | null;
  preview: string;
};

const Upload = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [video, setVideo] = useState<VideoUpload>({
    buffer: null,
    preview: "",
  });
  const { selectedChannel } = useAppStore();

  const {
    query: { upload },
    push,
  } = useRouter();

  useEffect(() => {
    if (upload) setShowUploadModal(true);
  }, [upload]);

  const uploadVideo = async (files: File[]) => {
    const file = files[0];
    try {
      if (file) {
        const preview = URL.createObjectURL(file);
        setVideo({ ...video, preview });
        let reader = new FileReader();
        reader.onload = function () {
          if (reader.result) {
            let buffer = Buffer.from(reader.result as string);
            setVideo({ ...video, buffer, preview });
          }
        };
        reader.readAsArrayBuffer(file);
      }
    } catch (error) {
      toast.error("Error uploading file");
    }
  };

  const onCloseUploadModal = () => {
    setShowUploadModal(false);
    push(selectedChannel?.handle, undefined, { shallow: true });
    setVideo({ preview: "", buffer: null });
  };

  const onDropRejected = (fileRejections: FileRejection[]) => {
    fileRejections[0].errors.forEach((error) => toast.error(error.message));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: uploadVideo,
    onDropRejected,
    accept: {
      "video/*": [".mp4", ".mov", ".mpg", ".avi", ".mpeg"],
    },
    maxFiles: 1,
    maxSize: 2147483648, // 2 GB
  });

  return (
    <Modal
      onClose={() => onCloseUploadModal()}
      show={showUploadModal}
      panelClassName="max-w-4xl max-h-[80vh]"
    >
      {video.preview ? (
        <Details video={video} close={onCloseUploadModal} />
      ) : (
        <div
          {...getRootProps()}
          className={clsx(
            "p-10 md:py-20 h-full focus:outline-none border-gray-300 dark:border-gray-700 grid place-items-center text-center border-2 border-dashed rounded-lg cursor-pointer"
          )}
        >
          <div>
            <span className="flex justify-center mb-6 text-4xl opacity-60">
              <FiUpload />
            </span>
            <input {...getInputProps()} />
            <span className="opacity-80">
              {isDragActive ? (
                <p>Drop it here</p>
              ) : (
                <p>Drag and drop video file to upload</p>
              )}
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default Upload;
