import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { SET_USER_SESSIONS_SEARCH_VALUE } from "../../../constants";
import { UserSessionsContext } from "../../../providers/UserSessionsContextProvider";
import { WPQTInput } from "../../common/Input/Input";
import { WPQTFilter } from "../WPQTFilter";

function UserSessionsFilter() {
  const {
    state: { sessionsSearchValue },
    usersSessionDispatch,
  } = useContext(UserSessionsContext);

  const setSessionSearchValue = (value: string) => {
    usersSessionDispatch({
      type: SET_USER_SESSIONS_SEARCH_VALUE,
      payload: value,
    });
  };

  return (
    <WPQTFilter title={__("Session filtering", "quicktasker")}>
      <WPQTInput value={sessionsSearchValue} onChange={setSessionSearchValue} />
    </WPQTFilter>
  );
}

export { UserSessionsFilter };
