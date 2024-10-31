import { UserPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { toast } from "react-toastify";
import { WPQTIconButton } from "../../../../components/common/Button/Button";
import { WPQTInput } from "../../../../components/common/Input/Input";
import { WPQTTextarea } from "../../../../components/common/TextArea/TextArea";
import { ADD_USER } from "../../../../constants";
import { useUserActions } from "../../../../hooks/actions/useUserActions";
import { UserContext } from "../../../../providers/UserContextProvider";

function AddUser() {
  const [showInput, setShowInput] = useState(false);
  const [userName, setUserName] = useState("");
  const [userDescription, setUserDescription] = useState("");
  const { userDispatch } = useContext(UserContext);
  const { createUser } = useUserActions();

  const onCreateUser = async () => {
    if (!userName) {
      toast.error("User name is required");
      return;
    }
    await createUser(userName, userDescription, (userData) => {
      userDispatch({ type: ADD_USER, payload: userData });
      clearStatus();
    });
  };

  const clearStatus = () => {
    setUserName("");
    setUserDescription("");
    setShowInput(false);
  };

  return (
    <div className="wpqt-mb-6">
      {showInput ? (
        <div className="wpqt-w-1/4">
          <label className="wpqt-mb-2 wpqt-block wpqt-font-semibold">
            {__("User name", "quicktasker")}
          </label>
          <WPQTInput
            value={userName}
            onChange={setUserName}
            className="wpqt-w-full"
          />
          <label className="wpqt-mb-2 wpqt-block wpqt-font-semibold">
            {__("User description", "quicktasker")}
          </label>
          <WPQTTextarea
            value={userDescription}
            onChange={setUserDescription}
            className="wpqt-w-full"
          />
          <div className="wpqt-flex wpqt-justify-end wpqt-gap-3">
            <WPQTIconButton
              text={__("Cancel", "quicktasker")}
              onClick={clearStatus}
              icon={<XMarkIcon className="wpqt-icon-red wpqt-size-5" />}
            />
            <WPQTIconButton
              text={__("Add", "quicktasker")}
              onClick={onCreateUser}
              icon={<UserPlusIcon className="wpqt-icon-green wpqt-size-5" />}
            />
          </div>
        </div>
      ) : (
        <WPQTIconButton
          text={__("Add User", "quicktasker")}
          onClick={() => setShowInput(true)}
          icon={<UserPlusIcon className="wpqt-icon-green wpqt-size-5" />}
        />
      )}
    </div>
  );
}

export { AddUser };
