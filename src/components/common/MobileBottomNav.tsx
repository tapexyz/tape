import useAppStore from "@lib/store";
import { EXPLORE, HOME, PODS } from "@utils/url-path";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlineUser } from "react-icons/ai";
import { FiHome } from "react-icons/fi";
import { MdOutlinePodcasts } from "react-icons/md";
import { RiLeafLine } from "react-icons/ri";

const MobileBottomNav = () => {
  const router = useRouter();
  const { selectedChannel } = useAppStore();

  const isActivePath = (path: string) => router.pathname === path;

  return (
    <div className="fixed inset-x-0 bottom-0 md:hidden">
      <nav
        className={clsx(
          "grid gap-2 px-4 py-2 bg-white border-t border-gray-300 dark:border-gray-700 dark:bg-black space-between",
          {
            "grid-cols-3": !selectedChannel,
            "grid-cols-4": selectedChannel,
          }
        )}
      >
        <div>
          <Link href={HOME}>
            <a className="flex items-center justify-center w-full gap-2 px-2 py-2 text-sm font-medium text-gray-700 transition-all duration-150 bg-transparent rounded dark:hover:text-gray-100 dark:text-gray-100 md:grid">
              <FiHome
                className={clsx("text-lg opacity-60", {
                  "text-indigo-500 text-xl font-bold opacity-100":
                    isActivePath("/"),
                })}
              />
              <span className="hidden md:inline-block">Home</span>
            </a>
          </Link>
        </div>
        <div>
          <Link href={EXPLORE}>
            <a className="flex items-center justify-center w-full gap-2 px-2 py-2 text-sm font-medium text-gray-700 transition-all duration-150 bg-transparent rounded dark:hover:text-gray-100 dark:text-gray-100 md:grid">
              <RiLeafLine
                className={clsx("text-lg opacity-60", {
                  "text-indigo-500 text-xl font-bold opacity-100":
                    isActivePath("/explore"),
                })}
              />
              <span className="hidden md:inline-block">Explore</span>
            </a>
          </Link>
        </div>
        <div>
          <Link href={PODS}>
            <a className="flex items-center justify-center w-full gap-2 px-2 py-2 text-sm font-medium text-gray-700 transition-all duration-150 bg-transparent rounded dark:hover:text-gray-100 dark:text-gray-100 md:grid">
              <MdOutlinePodcasts
                className={clsx("text-lg opacity-60", {
                  "text-indigo-500 text-xl font-bold opacity-100":
                    isActivePath("/pods"),
                })}
              />
              <span className="hidden md:inline-block">Pods</span>
            </a>
          </Link>
        </div>
        {selectedChannel && (
          <div>
            <Link href={selectedChannel?.handle}>
              <a className="flex items-center justify-center w-full gap-2 px-2 py-2 text-sm font-medium text-gray-700 transition-all duration-150 bg-transparent rounded dark:hover:text-gray-100 dark:text-gray-100 md:grid">
                <AiOutlineUser
                  className={clsx("text-lg opacity-60", {
                    "text-indigo-500 text-xl font-bold opacity-100":
                      isActivePath("/[channel]"),
                  })}
                />
                <span className="hidden md:inline-block">Channel</span>
              </a>
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};

export default MobileBottomNav;
