import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { useUserSessionsFilter } from "../../../hooks/filters/useUserSessionsFilter";
import { UserSessionsContext } from "../../../providers/UserSessionsContextProvider";
import { UserSession } from "./UserSession";

function UserSessions() {
  const {
    state: { userSessions },
  } = useContext(UserSessionsContext);
  const { filterSessions } = useUserSessionsFilter();
  return (
    <div>
      <div className="wpqt-mb-4 wpqt-grid wpqt-grid-cols-5 wpqt-font-bold">
        <div>{__("Session owner", "quicktasker")}</div>
        <div>{__("Created at", "quicktasker")}</div>
        <div>{__("Expires at", "quicktasker")}</div>
        <div>{__("Status", "quicktasker")}</div>
        <div>{__("Actions", "quicktasker")}</div>
      </div>
      <div className="wpqt-grid wpqt-grid-cols-5 wpqt-items-center wpqt-gap-y-4">
        {userSessions.filter(filterSessions).map((session) => (
          <UserSession key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
}

export { UserSessions };
