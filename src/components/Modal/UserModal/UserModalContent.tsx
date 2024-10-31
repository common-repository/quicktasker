import {
  KeyIcon,
  PowerIcon,
  RectangleStackIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
  CLOSE_USER_MODAL,
  DELETE_USER,
  EDIT_USER,
  RESET_PASSWORD,
} from "../../../constants";
import { useUserActions } from "../../../hooks/actions/useUserActions";
import { useLoadingStates } from "../../../hooks/useLoadingStates";
import { AppContext } from "../../../providers/AppContextProvider";
import { ModalContext } from "../../../providers/ModalContextProvider";
import { UserContext } from "../../../providers/UserContextProvider";
import { CustomFieldEntityType } from "../../../types/custom-field";
import { User } from "../../../types/user";
import { WPQTIconButton } from "../../common/Button/Button";
import { WPQTInput } from "../../common/Input/Input";
import { WPQTTextarea } from "../../common/TextArea/TextArea";
import { CustomFieldsInModalWrap } from "../../CustomField/CustomFieldsInModalWrap/CustomFieldsInModalWrap";
import { UserModalTabs } from "../../Tab/CommentsAndLogs/UserModalTabs/UserModalTabs";
import {
  WPQTModalField,
  WPQTModalFieldSet,
  WPQTModalFooter,
} from "../WPQTModal";
type Props = {
  editUser: (user: User) => void;
  modalSaving: boolean;
};

const UserModalContent = forwardRef(function UserModalContent(
  { modalSaving, editUser }: Props,
  ref,
) {
  const {
    state: { userToEdit },
    modalDispatch,
  } = useContext(ModalContext);
  const {
    state: { isUserAllowedToDelete },
  } = useContext(AppContext);
  const [userName, setUserName] = useState("");
  const [userDescription, setUserDescription] = useState("");
  const [isActiveUser, setIsActiveUser] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
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

  useEffect(() => {
    if (userToEdit) {
      setUserName(userToEdit.name);
      setUserDescription(userToEdit.description);
      setIsActiveUser(userToEdit.is_active);
      setHasPassword(userToEdit.has_password);
    }
  }, [userToEdit]);

  const clearContent = () => {
    setUserName("");
    setUserDescription("");
  };

  const saveUser = () => {
    if (userToEdit) {
      editUser({
        ...userToEdit,
        name: userName,
        description: userDescription,
      });
    }
  };

  useImperativeHandle(ref, () => ({
    clearContent,
  }));

  if (!userToEdit) return null;

  return (
    <>
      <div className="wpqt-grid wpqt-grid-cols-1 wpqt-gap-7 md:wpqt-grid-cols-[1fr_auto]">
        <div className="wpqt-border-0 wpqt-border-r wpqt-border-solid wpqt-border-r-gray-300 md:wpqt-pr-3">
          <div className="wpqt-grid wpqt-grid-cols-1 wpqt-gap-3 md:wpqt-grid-cols-[auto_1fr]">
            <div>
              <WPQTModalFieldSet>
                <WPQTModalField label={__("Name", "quicktasker")}>
                  <WPQTInput
                    isAutoFocus={true}
                    value={userName}
                    onChange={(newValue: string) => setUserName(newValue)}
                  />
                </WPQTModalField>

                <WPQTModalField label={__("Description", "quicktasker")}>
                  <WPQTTextarea
                    rowsCount={3}
                    value={userDescription}
                    onChange={(newValue: string) =>
                      setUserDescription(newValue)
                    }
                  />
                </WPQTModalField>
              </WPQTModalFieldSet>
            </div>
            <CustomFieldsInModalWrap
              entityId={userToEdit!.id}
              entityType={CustomFieldEntityType.User}
            />
          </div>

          <div className="wpqt-mt-7">
            <UserModalTabs user={userToEdit} />
          </div>
        </div>
        <div className="wpqt-flex wpqt-flex-col wpqt-gap-2">
          <WPQTIconButton
            icon={<UserIcon className="wpqt-icon-blue wpqt-size-4" />}
            text={__("User details", "quicktasker")}
            onClick={() => {
              window.location.hash = `#/users/${userToEdit!.id}`;
              modalDispatch({
                type: CLOSE_USER_MODAL,
              });
            }}
          />
          <WPQTIconButton
            icon={<RectangleStackIcon className="wpqt-icon-blue wpqt-size-5" />}
            text={__("User tasks", "quicktasker")}
            onClick={() => {
              window.location.hash = `#/users/${userToEdit!.id}/tasks`;
              modalDispatch({
                type: CLOSE_USER_MODAL,
              });
            }}
          />
          {hasPassword && (
            <WPQTIconButton
              icon={<KeyIcon className="wpqt-icon-red wpqt-size-5" />}
              text={__("Reset password", "quicktasker")}
              loading={isResetPWLoading}
              onClick={async () => {
                setIsResetPWLoading(true);
                await resetUserPassword(userToEdit.id, () => {
                  userDispatch({
                    type: RESET_PASSWORD,
                    payload: userToEdit.id,
                  });
                  setHasPassword(false);
                });
                setIsResetPWLoading(false);
              }}
            />
          )}
          {!isActiveUser && (
            <WPQTIconButton
              icon={<PowerIcon className="wpqt-icon-green wpqt-size-5" />}
              text={__("Activate user", "quicktasker")}
              loading={isActivateLoading}
              onClick={async () => {
                setIsActivateLoading(true);
                await changeUserStatus(userToEdit!.id, true, (userData) => {
                  userDispatch({
                    type: EDIT_USER,
                    payload: { ...userData },
                  });
                  setIsActiveUser(true);
                });
                setIsActivateLoading(false);
              }}
            />
          )}
          {isActiveUser && (
            <WPQTIconButton
              icon={<PowerIcon className="wpqt-icon-red wpqt-size-5" />}
              text={__("Disable user", "quicktasker")}
              loading={isActivateLoading}
              onClick={async () => {
                setIsActivateLoading(true);
                await changeUserStatus(userToEdit!.id, false, (userData) => {
                  userDispatch({
                    type: EDIT_USER,
                    payload: { ...userData },
                  });
                  setIsActiveUser(false);
                });
                setIsActivateLoading(false);
              }}
            />
          )}
          {isUserAllowedToDelete && (
            <WPQTIconButton
              icon={<TrashIcon className="wpqt-icon-red wpqt-size-5" />}
              text={__("Delete user", "quicktasker")}
              loading={isDeleteLoading}
              onClick={async () => {
                setIsDeleteLoading(true);
                await deleteUser(userToEdit!.id, (userId) => {
                  userDispatch({
                    type: DELETE_USER,
                    payload: userId,
                  });
                  modalDispatch({
                    type: CLOSE_USER_MODAL,
                  });
                });
                setIsDeleteLoading(false);
              }}
            />
          )}
        </div>
      </div>
      <WPQTModalFooter
        onSave={saveUser}
        saveBtnText={
          modalSaving
            ? __("Saving...", "quicktasker")
            : __("Save", "quicktasker")
        }
      />
    </>
  );
});

export { UserModalContent };
