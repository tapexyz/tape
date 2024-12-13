import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(relativeTime);

/**
 * @param timeString
 * @returns a readable ago time (eg. 1 hour ago, 1 day ago, 1 minute ago)
 */
export const getTimeAgo = (timeString: string) => {
  return dayjs(new Date(timeString)).fromNow();
};
