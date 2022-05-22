import { Button } from "@components/ui/Button";
import { PODS } from "@utils/url-path";
import Link from "next/link";
import React from "react";
import { FC } from "react";
import { BsPlay } from "react-icons/bs";

type Props = {
  showPlay?: boolean;
};

const PodCard: FC<Props> = ({ showPlay = false }) => {
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
          {showPlay && (
            <Button className="absolute top-1 right-1 !p-1">
              <BsPlay />
              {/* <BsSoundwave /> */}
            </Button>
          )}
        </div>
        <div className="flex flex-col p-2 pb-0 space-y-0.5">
          <Link href={`${PODS}/0d-00`}>
            <a className="text-sm font-semibold line-clamp-1">
              History of India and its nature
            </a>
          </Link>
          <Link href={""}>
            <a className="text-xs truncate hover:opacity-100 opacity-70">
              T Series
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PodCard;
