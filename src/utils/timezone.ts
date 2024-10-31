import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Converts a given UTC date-time string to a specified WordPress timezone.
 *
 * @param utcDateTime - The date-time string in UTC format.
 * @param wpTimezone - The WordPress timezone to convert the date-time to.
 * @returns The formatted date-time string in the specified timezone, or the original UTC date-time string with "(UTC)" appended in case of an error.
 *
 * @throws Will log an error to the console if the conversion fails.
 */
export const convertToTimezone = (utcDateTime: string, wpTimezone: string) => {
  try {
    const zonedDate = dayjs.utc(utcDateTime).tz(wpTimezone);
    const formattedDate = zonedDate.format("MMMM D, YYYY HH:mm");

    return formattedDate;
  } catch (error) {
    console.error("Error: ", error);

    return utcDateTime + " (UTC)";
  }
};
