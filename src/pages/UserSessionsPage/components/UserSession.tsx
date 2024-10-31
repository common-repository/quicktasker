import { PowerIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { toast } from "react-toastify";
import {
  changeUserSessionStatusRequest,
  deleteUserSessionRequest,
} from "../../../api/api";
import {
  CHANGE_USER_SESSION_STATUS,
  DELETE_USER_SESSION,
} from "../../../constants";
import { useTimezone } from "../../../hooks/useTimezone";
import { AppContext } from "../../../providers/AppContextProvider";
import { UserSessionsContext } from "../../../providers/UserSessionsContextProvider";
import { UserSession } from "../../../types/user-session";

type Props = {
  session: UserSession;
};

function UserSession({ session }: Props) {
  const { usersSessionDispatch } = useContext(UserSessionsContext);
  const {
    state: { isUserAllowedToDelete },
  } = useContext(AppContext);
  const { convertToWPTimezone } = useTimezone();
  const isActive = session.is_active;

  const changeSessionStatus = async (status: boolean) => {
    try {
      await changeUserSessionStatusRequest(session.id, status);
      usersSessionDispatch({
        type: CHANGE_USER_SESSION_STATUS,
        payload: { sessionId: session.id, status },
      });
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to change session status", "quicktasker"));
    }
  };

  const deleteSession = async () => {
    try {
      await deleteUserSessionRequest(session.id);
      usersSessionDispatch({
        type: DELETE_USER_SESSION,
        payload: session.id,
      });
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to delete session", "quicktasker"));
    }
  };

  return (
    <>
      <div>
        <div>{session.user_name}</div>
        <div className="wpqt-italic">{session.user_description}</div>
      </div>
      <div>{convertToWPTimezone(session.created_at_utc)}</div>
      <div>{convertToWPTimezone(session.expires_at_utc)}</div>
      <div
        className={isActive ? "wpqt-text-qtTextGreen" : "wpqt-text-qtTextRed"}
      >
        {isActive ? __("On", "quicktasker") : __("Off", "quicktasker")}
      </div>
      <div className="wpqt-flex wpqt-items-center wpqt-gap-4">
        {isActive ? (
          <PowerIcon
            className="wpqt-icon-red wpqt-size-5 wpqt-cursor-pointer"
            onClick={() => changeSessionStatus(false)}
            title={__("Turn session off", "quicktasker")}
          />
        ) : (
          <PowerIcon
            className="wpqt-icon-green wpqt-size-5 wpqt-cursor-pointer"
            onClick={() => changeSessionStatus(true)}
            title={__("Turn session on", "quicktasker")}
          />
        )}
        {isUserAllowedToDelete && (
          <TrashIcon
            className="wpqt-icon-red wpqt-size-5 wpqt-cursor-pointer"
            title={__("Delete session", "quicktasker")}
            onClick={deleteSession}
          />
        )}
      </div>
    </>
  );
}

export { UserSession };
