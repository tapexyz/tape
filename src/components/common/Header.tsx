import Notifications from "@components/Notifications";
import Popover from "@components/ui/Popover";
import Tooltip from "@components/ui/Tooltip";
import useAppStore from "@lib/store";
import { HOME } from "@utils/url-path";
import Link from "next/link";
import React, { useState } from "react";
import { AiOutlinePlus, AiOutlineVideoCameraAdd } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { CgBell } from "react-icons/cg";
import { FiUpload } from "react-icons/fi";
import { HiOutlineStatusOnline } from "react-icons/hi";

import GlobalSearch from "./GlobalSearch";
import Login from "./Login";

const Header = () => {
  const { channels, selectedChannel, token, hasNewNotification } =
    useAppStore();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="fixed z-10 flex flex-row items-center justify-between w-full px-2 border-b border-gray-300 dark:border-gray-700 md:px-6 bg-secondary h-14">
      <div className="flex items-center flex-1 space-x-4">
        <Link href={HOME}>
          <a className="font-semibold">LensTube</a>
        </Link>
        <div>
          {showSearch && <GlobalSearch setShowSearch={setShowSearch} />}
          <button
            onClick={() => setShowSearch(true)}
            className="px-2 hidden text-sm opacity-60 hover:opacity-100 md:flex md:w-44 focus:outline-none items-center space-x-1 text-left py-1.5 rounded"
          >
            <BiSearch />
            <span>Search</span>
          </button>
        </div>
      </div>
      <div className="flex flex-row items-center space-x-3">
        {selectedChannel && token.access ? (
          <>
            <Popover
              trigger={
                <Tooltip className="!rounded-lg" content="New Video">
                  <div className="flex self-center p-2 rounded-lg focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-800">
                    <AiOutlineVideoCameraAdd />
                  </div>
                </Tooltip>
              }
              panelClassName="right-0"
            >
              <div className="p-1 mt-1.5 overflow-hidden border border-gray-100 rounded-lg shadow-xl dark:border-gray-800 bg-secondary">
                <div className="flex flex-col text-sm transition duration-150 ease-in-out rounded-lg">
                  <Link href={`${selectedChannel.handle}?upload=1`}>
                    <a className="inline-flex items-center px-3 py-1.5 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <FiUpload />
                      <span className="whitespace-nowrap">Upload</span>
                    </a>
                  </Link>
                  <Link href={HOME}>
                    <a className="inline-flex items-center px-3 py-1.5 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <HiOutlineStatusOnline className="text-red-500" />
                      <span className="whitespace-nowrap">Go Live</span>
                    </a>
                  </Link>
                </div>
              </div>
            </Popover>

            <Popover
              trigger={
                <Tooltip className="!rounded-lg" content="Notifications">
                  <div className="relative flex self-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                    <CgBell />
                    {hasNewNotification && (
                      <span className="absolute flex w-1.5 h-1.5 bg-indigo-500 rounded-full top-1 right-1" />
                    )}
                  </div>
                </Tooltip>
              }
              panelClassName="right-0"
            >
              <div className="p-1 max-h-96 mt-1.5 w-72 overflow-x-hidden overflow-y-auto border shadow-xl border-gray-100 rounded-lg dark:border-gray-800 bg-secondary">
                <div className="flex flex-col p-2 text-sm transition duration-150 ease-in-out rounded-lg">
                  <Notifications />
                </div>
              </div>
            </Popover>
          </>
        ) : null}
        {channels.length === 0 && token.access && (
          <Tooltip className="!rounded-lg" content="Create Channel">
            <button className="p-[7px] border border-gray-200 rounded-lg dark:hover:bg-gray-800 dark:border-gray-800 hover:bg-gray-100">
              <AiOutlinePlus />
            </button>
          </Tooltip>
        )}
        <Login />
      </div>
    </div>
  );
};

export default Header;
