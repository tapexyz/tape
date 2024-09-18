import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(relativeTime);

/**
 * @param time 03:88 or 03:88:00
 * @returns total seconds (eg: 2188)
 */
export const convertTimeToSeconds = (time: string) => {
  const timeSplitted: string[] = time.split(":");
  let seconds = 0;
  let minute = 1;
  while (timeSplitted.length > 0) {
    seconds += minute * Number.parseInt(timeSplitted.pop() ?? "0", 10);
    minute *= 60;
  }
  return seconds;
};

/**
 * @param seconds number of seconds
 * @returns time in HH:MM format
 */
export const formatTimeFromSeconds = (seconds: string) => {
  if (seconds === "Infinity" || !seconds) {
    return null;
  }
  const parsed = Number.parseFloat(seconds);
  if (parsed < 3600) {
    return new Date(parsed * 1000)?.toISOString().slice(14, 19);
  }
  return new Date(parsed * 1000)?.toISOString().slice(11, 19);
};

/**
 * @param timeString
 * @returns a readable ago time (eg. 1 hour ago, 1 day ago, 1 minute ago)
 */
export const getTimeAgo = (timeString: string) => {
  return dayjs(new Date(timeString)).fromNow();
};

/**
 * @param dateString
 * @returns a short hand time (eg. 1h, 1d, 1m)
 */
export const getShortHandTime = (dateString: string) => {
  const targetDate = dayjs(new Date(dateString));
  const now = dayjs();

  const diffInMinutes = now.diff(targetDate, "minute");
  const diffInHours = now.diff(targetDate, "hour");
  const diffInDays = now.diff(targetDate, "day");

  if (diffInDays >= 1) {
    return targetDate.format(
      now.year() === targetDate.year() ? "MMM D" : "MMM D, YYYY"
    );
  }
  if (diffInHours >= 1) {
    return `${diffInHours}h`;
  }
  return `${diffInMinutes}min`;
};

/**
 *
 * @param days number of days to add from current date
 * @returns date in UTC format (eg: 2024-08-14T10:49:40Z)
 */
export const getUTCDateAfterDays = (days: number) => {
  return dayjs().add(days, "day").utc().format();
};

/**
 * @param days number of days to subtract from current date
 * @returns unix timestamp
 */
export const getUnixTimestampNDaysAgo = (days: number) => {
  return dayjs().subtract(days, "day").unix();
};

/**
 * @param timestamp
 * @returns returns a readable date with time (eg. Monday, March 1, 2023 12:00 AM)
 */
export const getReadableDateWithTime = (timestamp: string) => {
  return dayjs(timestamp).format("dddd, MMMM D, YYYY h:mm A");
};

/**
 * getCurrentDateTime
 * @returns current date and time in YYYY-MM-DD HH:mm:ss format (eg: 2023-03-01 03:88:00)
 */
export const getCurrentDateTime = () => {
  return dayjs().format("YYYY-MM-DD HH:mm:ss");
};
