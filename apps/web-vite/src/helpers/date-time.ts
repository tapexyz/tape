import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(duration);

/**
 * @param timeString
 * @returns a readable ago time (eg. 1 hour ago, 1 day ago, 1 minute ago)
 */
export const getTimeAgo = (timeString: string) => {
  return dayjs(new Date(timeString)).fromNow();
};

/**
 * @param seconds number of seconds
 * @returns time in HH:MM format
 */
export const formatTimeToDuration = (seconds: number) => {
  if (!seconds || Number.isNaN(seconds)) return null;
  const duration = dayjs.duration(seconds, "seconds");
  return seconds < 3600
    ? duration.format("mm:ss")
    : duration.format("HH:mm:ss");
};

/**
 * @param days number of days to subtract from current date
 * @returns unix timestamp
 */
export const getUnixTimestampNDaysAgo = (days: number) => {
  return dayjs().subtract(days, "day").unix();
};
