import { Button } from "@components/ui/Button";
import Popover from "@components/ui/Popover";
import useAppStore from "@lib/store";
import getProfilePicture from "@utils/functions/getProfilePicture";
import { SETTINGS } from "@utils/url-path";
import clsx from "clsx";
import Link from "next/link";
import React, { FC, useState } from "react";
import { AiOutlinePlus, AiOutlineUserSwitch } from "react-icons/ai";
import { BiArrowBack, BiCheck, BiMoviePlay } from "react-icons/bi";
import { VscDebugDisconnect } from "react-icons/vsc";
import { Profile } from "src/types";
import { useDisconnect } from "wagmi";

type Props = {};

const UserMenu: FC<Props> = () => {
  const {
    channels,
    setShowCreateChannel,
    setSelectedChannel,
    selectedChannel,
  } = useAppStore();
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);
  const { disconnect } = useDisconnect();

  const onSelectChannel = (channel: Profile) => {
    setSelectedChannel(channel);
    setShowAccountSwitcher(false);
  };

  if (!selectedChannel) return null;

  return (
    <Popover
      trigger={
        <Button className="!p-0.5 mt-0.5">
          <img
            className="w-6 h-6 rounded-md"
            src={getProfilePicture(selectedChannel)}
            alt=""
            draggable={false}
          />
        </Button>
      }
      panelClassName="right-0"
    >
      <div className="px-1 mt-1.5 w-48 divide-y shadow-xl max-h-96 divide-gray-200 dark:divide-gray-800 overflow-hidden border border-gray-100 rounded-lg dark:border-gray-800 bg-secondary">
        {showAccountSwitcher ? (
          <>
            <div className="flex opacity-70 items-centerspace-x-2">
              <button
                className="p-2 outline-none"
                onClick={() => setShowAccountSwitcher(false)}
              >
                <BiArrowBack />
              </button>
              <span className="py-2 text-sm">Channels</span>
            </div>
            <div className="py-1 text-sm">
              {channels.map((channel, idx) => (
                <button
                  className={clsx(
                    "flex w-full justify-between items-center px-2 py-1.5 space-x-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  key={idx}
                  onClick={() => onSelectChannel(channel)}
                >
                  <span className="inline-flex items-center space-x-1.5">
                    <img
                      className="w-6 h-6 rounded-lg"
                      src={getProfilePicture(channel)}
                      alt=""
                      draggable={false}
                    />
                    <span className="truncate whitespace-nowrap">
                      {channel.handle}
                    </span>
                  </span>
                  {selectedChannel?.id === channel.id && <BiCheck />}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col space-y-1 text-sm transition duration-150 ease-in-out rounded-lg">
              <div
                className={clsx(
                  "inline-flex items-center p-2 py-4 space-x-2 rounded-lg"
                )}
              >
                <img
                  className="rounded-lg w-9 h-9"
                  src={getProfilePicture(selectedChannel)}
                  alt=""
                  draggable={false}
                />
                <div className="flex flex-col items-start">
                  <h6 className="text-base truncate whitespace-nowrap">
                    {selectedChannel?.handle}
                  </h6>
                  <Link href={SETTINGS}>
                    <a className="text-xs font-medium text-green-700">
                      Customize
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="py-1 text-sm">
              <Link href={selectedChannel?.handle}>
                <a
                  className={clsx(
                    "inline-flex items-center w-full px-2 py-2 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <BiMoviePlay className="text-lg" />
                  <span className="truncate whitespace-nowrap">
                    Your Channel
                  </span>
                </a>
              </Link>
              <button
                className={clsx(
                  "inline-flex items-center w-full px-2 py-2 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                onClick={() => setShowAccountSwitcher(true)}
              >
                <AiOutlineUserSwitch className="text-lg" />
                <span className="truncate whitespace-nowrap">
                  Switch channel
                </span>
              </button>
              <button
                className={clsx(
                  "flex items-center w-full px-2 py-2 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                onClick={() => setShowCreateChannel(true)}
              >
                <AiOutlinePlus className="text-lg" />
                <span className="truncate whitespace-nowrap">
                  Create Channel
                </span>
              </button>
            </div>
            <div className="py-1 text-sm">
              <button
                className={clsx(
                  "flex items-center w-full px-2.5 py-2 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                onClick={() => disconnect()}
              >
                <VscDebugDisconnect className="text-lg" />
                <span className="truncate whitespace-nowrap">Disconnect</span>
              </button>
            </div>
          </>
        )}
      </div>
    </Popover>
  );
};

export default UserMenu;
