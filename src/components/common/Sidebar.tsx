import Tooltip from "@components/ui/Tooltip";
import { EXPLORE, HOME, PODS } from "@utils/url-path";
import Link from "next/link";
import { useTheme } from "next-themes";
import React from "react";
import { FiHome } from "react-icons/fi";
import {
  MdOutlineDarkMode,
  MdOutlinePodcasts,
  MdOutlineWbSunny,
} from "react-icons/md";
import { RiLeafLine } from "react-icons/ri";

const Sidebar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed bottom-0 left-0 items-center justify-between hidden w-16 p-4 md:flex md:flex-col top-14 bg-secondary">
      <div className="flex flex-col items-center space-y-3">
        <Tooltip className="!rounded-lg" content="Home" placement="right">
          <span className="bg-gray-100 rounded-lg dark:bg-gray-800 scale-animation">
            <Link href={HOME}>
              <a className="flex p-2.5">
                <FiHome />
              </a>
            </Link>
          </span>
        </Tooltip>
        <Tooltip className="!rounded-lg" content="Explore" placement="right">
          <span className="bg-gray-100 rounded-lg dark:bg-gray-800 scale-animation">
            <Link href={EXPLORE}>
              <a className="flex p-2.5">
                <RiLeafLine />
              </a>
            </Link>
          </span>
        </Tooltip>
        <Tooltip className="!rounded-lg" content="Pods" placement="right">
          <span className="bg-gray-100 rounded-lg dark:bg-gray-800 scale-animation">
            <Link href={PODS}>
              <a className="flex p-2.5">
                <MdOutlinePodcasts />
              </a>
            </Link>
          </span>
        </Tooltip>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <button
          onClick={() => {
            setTheme(theme === "dark" ? "light" : "dark");
          }}
          className="p-2.5 opacity-70 hover:opacity-100"
        >
          {theme === "dark" ? <MdOutlineWbSunny /> : <MdOutlineDarkMode />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
