import {
  KeyIcon,
  PowerIcon,
  RectangleStackIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { WPQTIconButton } from "../../../../components/common/Button/Button";
import { DELETE_USER, EDIT_USER } from "../../../../constants";
import { useUserActions } from "../../../../hooks/actions/useUserActions";
import { useLoadingStates } from "../../../../hooks/useLoadingStates";
import { UserContext } from "../../../../providers/UserContextProvider";
import { ExtendedUser } from "../../../../types/user";

type Props = {
  data: ExtendedUser;
  changeStatus: (status: boolean) => void;
  changeSetUpStatus: (status: boolean) => void;
  changePasswordStatus: (status: boolean) => void;
};
function UserControls({
  data,
  changeStatus,
  changeSetUpStatus,
  changePasswordStatus,
}: Props) {
  const { changeUserStatus, deleteUser, resetUserPassword } = useUserActions();
  const { userDispatch } = useContext(UserContext);
  const {
    loading1: isResetPWLoading,
    setLoading1: setIsResetPWLoading,
    loading2: isActivateLoading,
    setLoading2: setIsActivateLoading,
    loading3: isDeleteLoading,
    setLoading3: setIsDeleteLoading,
  } = useLoadingStates();

  const isUserActive = data.is_active;
  const hasPassword = data.has_password;

  return (
    <div className="wpqt-mt-5 wpqt-flex wpqt-gap-2">
      <WPQTIconButton
        icon={<RectangleStackIcon className="wpqt-icon-blue wpqt-size-5" />}
        text={__("User tasks", "quicktasker")}
        onClick={() => {
          window.location.hash = `#/users/${data.id}/tasks`;
        }}
      />
      {!isUserActive && (
        <WPQTIconButton
          icon={<PowerIcon className="wpqt-icon-green wpqt-size-5" />}
          text={__("Activate user", "quicktasker")}
          loading={isActivateLoading}
          onClick={async () => {
            setIsActivateLoading(true);
            await changeUserStatus(data.id, true, (userData) => {
              userDispatch({
                type: EDIT_USER,
                payload: { ...userData },
              });
              changeStatus(true);
            });
            setIsActivateLoading(false);
          }}
        />
      )}
      {isUserActive && (
        <WPQTIconButton
          icon={<PowerIcon className="wpqt-icon-red wpqt-size-5" />}
          text={__("Disable user", "quicktasker")}
          loading={isActivateLoading}
          onClick={async () => {
            setIsActivateLoading(true);
            await changeUserStatus(data.id, false, (userData) => {
              userDispatch({
                type: EDIT_USER,
                payload: { ...userData },
              });
              changeStatus(false);
            });
            setIsActivateLoading(false);
          }}
        />
      )}
      {hasPassword && (
        <WPQTIconButton
          icon={<KeyIcon className="wpqt-icon-red wpqt-size-5" />}
          loading={isResetPWLoading}
          text={__("Reset password", "quicktasker")}
          onClick={async () => {
            setIsResetPWLoading(true);
            await resetUserPassword(data.id, () => {
              changeSetUpStatus(false);
              changePasswordStatus(false);
            });
            setIsResetPWLoading(false);
          }}
        />
      )}
      <WPQTIconButton
        icon={<TrashIcon className="wpqt-icon-red wpqt-size-5" />}
        loading={isDeleteLoading}
        text={__("Delete user", "quicktasker")}
        onClick={async () => {
          setIsDeleteLoading(true);
          await deleteUser(data.id, (userId) => {
            userDispatch({
              type: DELETE_USER,
              payload: userId,
            });
            window.location.hash = `#/users`;
          });
          setIsDeleteLoading(false);
        }}
      />
    </div>
  );
}

export { UserControls };
