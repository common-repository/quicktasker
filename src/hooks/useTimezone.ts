import { useContext } from "@wordpress/element";
import { AppContext } from "../providers/AppContextProvider";
import { convertToTimezone } from "../utils/timezone";

const useTimezone = () => {
  const {
    state: { timezone },
  } = useContext(AppContext);

  const convertToWPTimezone = (utcDateTime: string) => {
    return convertToTimezone(utcDateTime, timezone);
  };

  return { convertToWPTimezone };
};

export { useTimezone };
