import { useContext } from "@wordpress/element";
import { convertToTimezone } from "../../utils/timezone";
import { UserPageAppContext } from "../providers/UserPageAppContextProvider";

const useTimezone = () => {
  const {
    state: { timezone },
  } = useContext(UserPageAppContext);

  const convertToWPTimezone = (utcDateTime: string) => {
    return convertToTimezone(utcDateTime, timezone);
  };

  return { convertToWPTimezone };
};

export { useTimezone };
