import { useContext } from "@wordpress/element";
import { UserSessionsContext } from "../../providers/UserSessionsContextProvider";
import { UserSession } from "../../types/user-session";

const useUserSessionsFilter = () => {
  const {
    state: { sessionsSearchValue },
  } = useContext(UserSessionsContext);

  const filterSessions = (userSession: UserSession) => {
    const matchesSearchValue =
      userSession.user_name
        .toLowerCase()
        .includes(sessionsSearchValue.toLowerCase()) ||
      (userSession.user_description &&
        userSession.user_description
          .toLowerCase()
          .includes(sessionsSearchValue.toLowerCase()));

    return matchesSearchValue;
  };

  return {
    filterSessions,
  };
};

export { useUserSessionsFilter };
