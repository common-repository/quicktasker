import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import { useContext, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { UserFilter } from "../../components/Filter/UserFilter/UserFilter";
import { UserModal } from "../../components/Modal/UserModal/UserModal";
import { UsersSettingsModal } from "../../components/Modal/UsersSettingsModal/UsersSettingsModal";
import { WPQTPageHeader } from "../../components/common/Header/Header";
import {
  CHANGE_USER_SETTINGS_MODAL_OPEN,
  SET_FULL_PAGE_LOADING,
} from "../../constants";
import { LoadingContext } from "../../providers/LoadingContextProvider";
import { ModalContext } from "../../providers/ModalContextProvider";
import { UserContext } from "../../providers/UserContextProvider";
import { Page } from "../Page/Page";
import { AddUser } from "./components/AddUser/AddUser";
import { UserList } from "./components/UserList/UserList";

function UsersPage() {
  const { updateUsers } = useContext(UserContext);
  const { loadingDispatch } = useContext(LoadingContext);
  const { modalDispatch } = useContext(ModalContext);

  useEffect(() => {
    const updateUsersAsync = async () => {
      loadingDispatch({ type: SET_FULL_PAGE_LOADING, payload: true });
      await updateUsers();
      loadingDispatch({ type: SET_FULL_PAGE_LOADING, payload: false });
    };
    updateUsersAsync();
  }, []);
  return (
    <Page>
      <WPQTPageHeader
        description={__(
          "Create and manage QuickTaskers who can access a mobile-like page to manage their assigned tasks.",
          "quicktasker",
        )}
        icon={
          <Cog8ToothIcon
            className="wpqt-icon-gray wpqt-size-7 wpqt-cursor-pointer hover:wpqt-text-qtBlueHover"
            onClick={() => {
              modalDispatch({
                type: CHANGE_USER_SETTINGS_MODAL_OPEN,
                payload: true,
              });
            }}
          />
        }
      >
        {__("QuickTaskers", "quicktasker")}
      </WPQTPageHeader>
      <AddUser />
      <UserFilter />
      <UserList />
      <UsersSettingsModal />
      <UserModal />
    </Page>
  );
}

export { UsersPage };
