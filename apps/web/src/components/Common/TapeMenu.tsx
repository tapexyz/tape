import {
  TAPE_FEEDBACK_URL,
  TAPE_GITHUB_HANDLE,
  TAPE_STATUS_PAGE,
  TAPE_X_HANDLE
} from "@tape.xyz/constants";
import { EVENTS } from "@tape.xyz/generic";
import Link from "next/link";

import useSw from "@/hooks/useSw";

const TapeMenu = () => {
  const { addEventToQueue } = useSw();

  return (
    <div className="grid grid-cols-2 py-1 pl-1">
      <Link
        className="rounded-lg px-2.5 py-1.5"
        href={`https://github.com/${TAPE_GITHUB_HANDLE}/brand-kit`}
        target="_blank"
        onClick={() => {
          addEventToQueue(EVENTS.SYSTEM.MORE_MENU.BRAND_KIT);
        }}
      >
        Brand Kit
      </Link>
      <Link
        className="rounded-lg px-2.5 py-1.5"
        href={`https://github.com/${TAPE_GITHUB_HANDLE}`}
        onClick={() => {
          addEventToQueue(EVENTS.SYSTEM.MORE_MENU.GITHUB);
        }}
        target="_blank"
      >
        Source Code
      </Link>
      <Link
        className="rounded-lg px-2.5 py-1.5"
        href={`${TAPE_FEEDBACK_URL}/feature-requests`}
        onClick={() => {
          addEventToQueue(EVENTS.SYSTEM.MORE_MENU.FEEDBACK);
        }}
        target="_blank"
      >
        Feedback
      </Link>
      <Link
        className="rounded-lg px-2.5 py-1.5"
        href={TAPE_FEEDBACK_URL}
        onClick={() => {
          addEventToQueue(EVENTS.SYSTEM.MORE_MENU.ROADMAP);
        }}
        target="_blank"
      >
        Roadmap
      </Link>

      <Link
        className="rounded-lg px-2.5 py-1.5"
        href={`https://x.com/${TAPE_X_HANDLE}`}
        onClick={() => {
          addEventToQueue(EVENTS.SYSTEM.MORE_MENU.X);
        }}
        target="_blank"
      >
        X (Twitter)
      </Link>
      <Link
        className="rounded-lg px-2.5 py-1.5"
        href="/discord"
        onClick={() => {
          addEventToQueue(EVENTS.SYSTEM.MORE_MENU.DISCORD);
        }}
        target="_blank"
      >
        Discord
      </Link>

      <Link
        className="rounded-lg px-2.5 py-1.5"
        href="/thanks"
        target="_blank"
        onClick={() => {
          addEventToQueue(EVENTS.SYSTEM.MORE_MENU.THANKS);
        }}
      >
        Thanks
      </Link>
      <Link
        className="rounded-lg px-2.5 py-1.5"
        href={TAPE_STATUS_PAGE}
        onClick={() => {
          addEventToQueue(EVENTS.SYSTEM.MORE_MENU.STATUS);
        }}
        target="_blank"
      >
        System Status
      </Link>

      <Link
        className="rounded-lg px-2.5 py-1.5"
        target="_blank"
        onClick={() => {
          addEventToQueue(EVENTS.SYSTEM.MORE_MENU.TERMS);
        }}
        href="/terms"
      >
        Terms
      </Link>
      <Link
        className="rounded-lg px-2.5 py-1.5"
        target="_blank"
        onClick={() => {
          addEventToQueue(EVENTS.SYSTEM.MORE_MENU.PRIVACY);
        }}
        href="/privacy"
      >
        Privacy
      </Link>
    </div>
  );
};

export default TapeMenu;
