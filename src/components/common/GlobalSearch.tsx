import { useLazyQuery } from "@apollo/client";
import Modal from "@components/ui/Modal";
import getProfilePicture from "@utils/functions/getProfilePicture";
import { SEARCH_CHANNELS_QUERY } from "@utils/gql/queries";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { LoaderIcon } from "react-hot-toast";
import { BiSearch, BiUser } from "react-icons/bi";
import { Profile } from "src/types";
import { useDebounce } from "usehooks-ts";

type Props = {
  setShowSearch: React.Dispatch<boolean>;
};

const GlobalSearch: FC<Props> = ({ setShowSearch }) => {
  const [keyword, setKeyword] = useState("");
  const debouncedValue = useDebounce<string>(keyword, 500);

  const [searchChannels, { data: channels, loading }] = useLazyQuery(
    SEARCH_CHANNELS_QUERY
  );

  useEffect(() => {
    if (keyword.trim().length)
      searchChannels({
        variables: { request: { type: "PROFILE", query: keyword, limit: 10 } },
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const onSelectResult = () => {
    setShowSearch(false);
    setKeyword("");
  };

  return (
    <Modal
      onClose={() => setShowSearch(false)}
      show={true}
      panelClassName="max-w-lg"
    >
      <div className="">
        <div className="flex items-center w-full p-4 space-x-2 border border-gray-200 dark:border-gray-800 rounded-xl">
          <BiSearch className="text-lg" />
          <input
            type="text"
            className="block w-full text-gray-700 bg-transparent appearance-none dark:text-gray-100 focus:outline-none"
            placeholder="Search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="overflow-auto no-scrollbar my-2 h-[40vh]">
          <span>
            {loading ? (
              <div className="flex justify-center p-4">
                <LoaderIcon className="!h-5 !w-5" />
              </div>
            ) : (
              channels?.search?.items?.map((channel: Profile) => (
                <Link href={`/${channel?.handle}`} key={channel?.handle}>
                  <a
                    href={`/u/${channel?.handle}`}
                    onClick={() => onSelectResult()}
                    className="flex flex-col justify-center px-4 py-2 space-y-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900"
                  >
                    <span className="flex items-center justify-between">
                      <span className="inline-flex items-center w-3/4 space-x-2">
                        <img
                          className="w-5 h-5 rounded-lg"
                          src={getProfilePicture(channel)}
                          alt=""
                          draggable={false}
                          loading="eager"
                        />
                        <span className="text-base line-clamp-1">
                          {channel.handle}
                        </span>
                      </span>
                      <span className="inline-flex items-center space-x-1 text-xs opacity-60">
                        <BiUser />
                        <span>{channel.stats.totalFollowers} subscribers</span>
                      </span>
                    </span>
                    {channel.bio && (
                      <p className="text-sm opacity-60">{channel.bio}</p>
                    )}
                  </a>
                </Link>
              ))
            )}
          </span>
          {channels?.search?.items?.length === 0 && (
            <div className="p-4 text-center">No results found</div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default GlobalSearch;
