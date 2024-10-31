import {
  ArrowRightStartOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { useNavigate } from "react-router-dom";
import {
  WPQTDropdown,
  WPQTDropdownItem,
} from "../../../../components/Dropdown/WPQTDropdown";
import { logoutUserPageRequest } from "../../../api/user-page-api";
import { SET_USER_LOGGED_IN } from "../../../constants";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { useSession } from "../../../hooks/useSession";
import { UserPageAppContext } from "../../../providers/UserPageAppContextProvider";

function ProfileDropdown() {
  const {
    state: { pageHash },
    loadUserPageStatus,
    userPageAppDispatch,
  } = useContext(UserPageAppContext);
  const { handleError } = useErrorHandler();
  const { deleteSessionCookie } = useSession();
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      await logoutUserPageRequest(pageHash);
      await deleteSessionCookie();
      userPageAppDispatch({ type: SET_USER_LOGGED_IN, payload: false });
      loadUserPageStatus();
    } catch (error) {
      handleError(error);
      loadUserPageStatus();
    }
  };

  return (
    <WPQTDropdown
      anchor="bottom end"
      menuBtn={({ active }) => (
        <div>
          <UserCircleIcon
            className={`wpqt-icon-blue wpqt-size-11 ${active ? "wpqt-text-blue-900" : ""} hover:wpqt-text-blue-900`}
          />
        </div>
      )}
    >
      <WPQTDropdownItem
        text={__("View profile", "quicktasker")}
        icon={<UserIcon className="wpqt-icon-blue wpqt-size-4" />}
        className="wpqt-mb-4"
        onClick={() => {
          navigate("/user/profile");
        }}
      />

      <WPQTDropdownItem
        text={__("Log out", "quicktasker")}
        icon={
          <ArrowRightStartOnRectangleIcon className="wpqt-icon-red wpqt-size-4" />
        }
        className="!wpqt-mb-0"
        onClick={logOut}
      />
    </WPQTDropdown>
  );
}

export { ProfileDropdown };
