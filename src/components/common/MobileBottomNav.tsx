import { EXPLORE, HOME, LIBRARY } from "@utils/url-path";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiHome } from "react-icons/fi";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { RiLeafLine } from "react-icons/ri";

const MobileBottomNav = () => {
  const router = useRouter();

  const isActivePath = (path: string) => router.pathname === path;

  return (
    <div className="fixed inset-x-0 bottom-0 md:hidden">
      <nav
        className={clsx(
          "grid gap-2 px-4 grid-cols-3 py-2 bg-white border-t border-gray-300 dark:border-gray-700 dark:bg-black space-between"
        )}
      >
        <div>
          <Link href={HOME}>
            <a className="flex items-center justify-center w-full gap-2 px-2 py-2 text-sm font-medium text-gray-700 transition-all duration-150 bg-transparent rounded-lg dark:hover:text-gray-100 dark:text-gray-100 md:grid">
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
            <a className="flex items-center justify-center w-full gap-2 px-2 py-2 text-sm font-medium text-gray-700 transition-all duration-150 bg-transparent rounded-lg dark:hover:text-gray-100 dark:text-gray-100 md:grid">
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
          <Link href={LIBRARY}>
            <a className="flex items-center justify-center w-full gap-2 px-2 py-2 text-sm font-medium text-gray-700 transition-all duration-150 bg-transparent rounded-lg dark:hover:text-gray-100 dark:text-gray-100 md:grid">
              <MdOutlineVideoLibrary
                className={clsx("text-lg opacity-60", {
                  "text-indigo-500 text-xl font-bold opacity-100":
                    isActivePath("/library"),
                })}
              />
              <span className="hidden md:inline-block">Library</span>
            </a>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default MobileBottomNav;
