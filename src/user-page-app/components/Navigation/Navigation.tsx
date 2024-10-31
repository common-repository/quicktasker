import {
  ArrowPathIcon,
  BellAlertIcon,
  BellIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { useContext } from "@wordpress/element";
import { useNavigate } from "react-router-dom";
import { LoadingOval } from "../../../components/Loading/Loading";
import { UserPageNotificationsContext } from "../../providers/UserPageNotificationsContextProvider";
import { ProfileDropdown } from "../Dropdown/ProfileDropdown/ProfileDropdown";

type Props = {
  loading: boolean;
  onRefresh?: () => void;
};
function NavigationBar({ loading, onRefresh = () => {} }: Props) {
  const navigate = useNavigate();
  const { checkNewComments } = useContext(UserPageNotificationsContext);

  const refresh = () => {
    onRefresh();
    checkNewComments();
  };

  return (
    <div className="wpqt-grid wpqt-h-[60px] wpqt-grid-cols-[1fr_auto_1fr] wpqt-items-center wpqt-border-0 wpqt-border-t wpqt-border-solid wpqt-border-y-gray-300 wpqt-px-4 wpqt-py-2 lg:wpqt-border-b lg:wpqt-border-t-0">
      <div className="wpqt-flex wpqt-gap-2">
        <HomeIcon
          onClick={() => navigate("/")}
          className="wpqt-size-8 wpqt-cursor-pointer"
        />
      </div>

      <div className="wpqt-text-center">
        {loading ? (
          <LoadingOval width="30" height="30" />
        ) : (
          <ArrowPathIcon
            className="wpqt-icon-blue wpqt-size-9 wpqt-cursor-pointer hover:wpqt-text-qtBlueHover"
            onClick={refresh}
          />
        )}
      </div>

      <div className="wpqt-flex wpqt-items-center wpqt-justify-end wpqt-gap-3">
        <NotificationIcon />
        <ProfileDropdown />
      </div>
    </div>
  );
}

function NotificationIcon() {
  const navigate = useNavigate();
  const {
    state: { newComments },
  } = useContext(UserPageNotificationsContext);

  return (
    <>
      {newComments.length > 0 ? (
        <BellAlertIcon
          className="wpqt-icon-red wpqt-size-7 wpqt-animate-bellShake wpqt-cursor-pointer"
          onClick={() => {
            navigate("/notifications");
          }}
        />
      ) : (
        <BellIcon
          className="wpqt-icon-gray wpqt-size-7 wpqt-cursor-pointer"
          onClick={() => {
            navigate("/notifications");
          }}
        />
      )}
    </>
  );
}

export { NavigationBar };
