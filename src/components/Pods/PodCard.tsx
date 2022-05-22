import { Button } from "@components/ui/Button";
import useAppStore from "@lib/store";
import Link from "next/link";
import React from "react";
import { BsPlay } from "react-icons/bs";

const PodCard = () => {
  const { setSelectedPodUrl } = useAppStore();

  return (
    <div className="p-2 transition duration-200 ease-in-out bg-secondary rounded-xl">
      <div className="flex flex-col">
        <div className="relative flex justify-center flex-none rounded-lg bg-gray-50 dark:bg-gray-900">
          <img
            src={`https://avatars.dicebear.com/api/avataaars/${Math.random()}.svg`}
            alt=""
            className="object-cover w-24 h-24"
            draggable={false}
          />
          <div className="absolute right-1 top-1">
            <Button
              onClick={() =>
                setSelectedPodUrl(
                  "https://cdn.simplecast.com/audio/cae8b0eb-d9a9-480d-a652-0defcbe047f4/episodes/af52a99b-88c0-4638-b120-d46e142d06d3/audio/500344fb-2e2b-48af-be86-af6ac341a6da/default_tc.mp3"
                )
              }
              variant="primary"
              className="!p-1"
            >
              <BsPlay />
            </Button>
          </div>
        </div>
        <div className="p-2">
          <h1 className="text-sm font-semibold line-clamp-1">
            History of India and its nature
          </h1>
          <Link href={""}>
            <a className="text-sm truncate hover:opacity-100 opacity-70">
              T Series
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PodCard;
