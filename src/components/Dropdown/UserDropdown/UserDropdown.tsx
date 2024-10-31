import {
  EllipsisHorizontalIcon,
  KeyIcon,
  PowerIcon,
  RectangleStackIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { TfiSave } from "react-icons/tfi";
import {
  CHANGE_USER_STATUS,
  DELETE_USER,
  OPEN_EDIT_USER_MODAL,
  RESET_PASSWORD,
} from "../../../constants";
import { useUserActions } from "../../../hooks/actions/useUserActions";
import { ModalContext } from "../../../providers/ModalContextProvider";
import { UserContext } from "../../../providers/UserContextProvider";
import { User } from "../../../types/user";
import {
  WPQTDropdown,
  WPQTDropdownIcon,
  WPQTDropdownItem,
} from "../WPQTDropdown";

type Props = {
  user: User;
};
function UserDropdown({ user }: Props) {
  const { modalDispatch } = useContext(ModalContext);
  const { userDispatch } = useContext(UserContext);
  const { changeUserStatus, deleteUser, resetUserPassword } = useUserActions();
  const userIsActive = user.is_active;

  const openEditUserModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    modalDispatch({
      type: OPEN_EDIT_USER_MODAL,
      payload: user,
    });
  };

  const onChangeUserStatus = async (status: boolean) => {
    await changeUserStatus(user.id, status, () => {
      userDispatch({
        type: CHANGE_USER_STATUS,
        payload: {
          userId: user.id,
          isActive: status,
        },
      });
    });
  };

  const onDeleteUser = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteUser(user.id, (userId) => {
      userDispatch({
        type: DELETE_USER,
        payload: userId,
      });
    });
  };

  return (
    <WPQTDropdown
      menuBtn={({ active }) => (
        <WPQTDropdownIcon
          isActive={active}
          IconComponent={EllipsisHorizontalIcon}
        />
      )}
    >
      <WPQTDropdownItem
        text={__("User details", "quicktasker")}
        icon={<UserIcon className="wpqt-icon-blue wpqt-size-4" />}
        onClick={(e) => {
          e.stopPropagation();
          window.location.hash = `#/users/${user.id}`;
        }}
      />

      <WPQTDropdownItem
        text={__("User tasks", "quicktasker")}
        icon={<RectangleStackIcon className="wpqt-icon-blue wpqt-size-4" />}
        onClick={(e) => {
          e.stopPropagation();
          window.location.hash = `#/users/${user.id}/tasks`;
        }}
      />

      <WPQTDropdownItem
        text={__("Edit user", "quicktasker")}
        icon={<TfiSave className="wpqt-icon-blue wpqt-size-3" />}
        onClick={openEditUserModal}
      />

      {user.has_password && (
        <WPQTDropdownItem
          text={__("Reset password", "quicktasker")}
          icon={<KeyIcon className="wpqt-icon-red wpqt-size-4" />}
          onClick={async (e) => {
            e.stopPropagation();
            await resetUserPassword(user.id, () => {
              userDispatch({
                type: RESET_PASSWORD,
                payload: user.id,
              });
            });
          }}
        />
      )}

      {userIsActive && (
        <WPQTDropdownItem
          text={__("Disable user", "quicktasker")}
          icon={<PowerIcon className="wpqt-icon-red wpqt-size-4" />}
          className="!wpqt-mb-0"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onChangeUserStatus(false);
          }}
        />
      )}

      {!userIsActive && (
        <>
          <WPQTDropdownItem
            text={__("Activate user", "quicktasker")}
            icon={<PowerIcon className="wpqt-icon-green wpqt-size-4" />}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onChangeUserStatus(true);
            }}
          />
          <WPQTDropdownItem
            text={__("Delete user", "quicktasker")}
            icon={<TrashIcon className="wpqt-icon-red wpqt-size-4" />}
            onClick={onDeleteUser}
          />
        </>
      )}
    </WPQTDropdown>
  );
}

export { UserDropdown };
