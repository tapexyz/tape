import { tw, useDebounce, useOutsideClick } from "@tape.xyz/browser";
import { getProfile, getProfilePicture } from "@tape.xyz/generic";
import type { Profile } from "@tape.xyz/lens";
import {
  CustomFiltersType,
  LimitType,
  useSearchProfilesLazyQuery,
} from "@tape.xyz/lens";
import { Spinner, TextArea } from "@tape.xyz/ui";
import type { ComponentProps, FC } from "react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import getCaretCoordinates from "textarea-caret";

import ProfileSuggestion from "./ProfileSuggestion";

interface TextAreaProps extends Omit<ComponentProps<"textarea">, "prefix"> {
  label?: string;
  error?: string;
  className?: string;
  onContentChange: (value: string) => void;
}

const InputMentions: FC<TextAreaProps> = ({
  label,
  placeholder,
  error,
  onContentChange,
  ...props
}) => {
  const [dropdownStyle, setDropdownStyle] = useState({});
  const [showPopover, setShowPopover] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLButtonElement[]>([]);

  const debouncedValue = useDebounce<string>(keyword, 500);

  const [searchProfiles, { data, loading }] = useSearchProfilesLazyQuery();
  const profiles = data?.searchProfiles?.items as Profile[];

  useEffect(() => {
    buttonsRef.current = buttonsRef.current.slice(0, profiles?.length);
    buttonsRef.current[0]?.focus();
  }, [loading, profiles]);

  const clearStates = () => {
    setDropdownStyle({});
    setShowPopover(false);
    setKeyword("");
    setSelectedIndex(0);
    textareaRef.current?.focus();
  };

  useOutsideClick(resultsRef, () => {
    clearStates();
  });

  const fetchSuggestions = async () => {
    if (!keyword.length) {
      return;
    }
    try {
      await searchProfiles({
        variables: {
          request: {
            query: keyword,
            limit: LimitType.Ten,
            where: {
              customFilters: [CustomFiltersType.Gardeners],
            },
          },
        },
      });
    } catch {}
  };

  useEffect(() => {
    fetchSuggestions();
  }, [debouncedValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    onContentChange(value);
    if (!textareaRef.current) {
      return;
    }

    const lastWord = value.split(/\s/).pop() || "";

    if (lastWord.startsWith("@") && lastWord.length > 3) {
      const coordinates = getCaretCoordinates(
        textareaRef.current,
        event.target.selectionEnd,
      );
      setDropdownStyle({
        top: `${coordinates.top - textareaRef.current.scrollTop}px`,
        left: `${coordinates.left}px`,
      });
      setKeyword(lastWord);
      setShowPopover(true);
    } else {
      clearStates();
    }
  };

  const handleProfileClick = (profile: Profile) => {
    const value = props.value as string;
    const lastAtSignIndex = value.lastIndexOf("@");
    if (lastAtSignIndex !== -1) {
      const fullHandle = profile.handle?.fullHandle;
      const newValue = `${value.substring(0, lastAtSignIndex)}@${fullHandle} `;
      onContentChange(newValue);
    }
    clearStates();
  };

  const popoverHandleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = (selectedIndex + 1) % profiles.length;
      buttonsRef.current[nextIndex]?.focus();
      setSelectedIndex(nextIndex);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const prevIndex = (selectedIndex - 1 + profiles.length) % profiles.length;
      buttonsRef.current[prevIndex]?.focus();
      setSelectedIndex(prevIndex);
    }
  };

  return (
    <div className="relative w-full">
      <TextArea
        {...props}
        ref={textareaRef}
        label={label}
        placeholder={placeholder}
        onChange={handleInputChange}
        error={error}
      />
      {showPopover && (loading || profiles?.length) ? (
        <div
          tabIndex={-1}
          ref={resultsRef}
          style={dropdownStyle}
          onKeyDown={popoverHandleKeyDown}
          className="tape-border absolute z-10 mt-10 space-y-1 rounded-medium bg-white p-1.5 dark:bg-black"
        >
          {loading ? (
            <Spinner />
          ) : (
            profiles?.map((profile: Profile, index) => (
              <div key={profile.id} className="w-48" tabIndex={-1}>
                <button
                  ref={(el) => {
                    if (el) {
                      buttonsRef.current[index] = el;
                    }
                  }}
                  type="button"
                  onClick={() => handleProfileClick(profile)}
                  className={tw(
                    "w-full rounded-lg text-left hover:bg-gallery hover:dark:bg-smoke",
                    index === selectedIndex && "bg-gallery dark:bg-smoke",
                  )}
                >
                  <ProfileSuggestion
                    followers={profile.stats.followers}
                    handle={getProfile(profile)?.slug}
                    pfp={getProfilePicture(profile, "AVATAR")}
                    id={profile.id}
                  />
                </button>
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
};

export default InputMentions;
