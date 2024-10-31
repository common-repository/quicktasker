import { useContext, useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { toast } from "react-toastify";
import { getExtendedUserRequest } from "../../api/api";
import { WPQTPageHeader } from "../../components/common/Header/Header";
import { SET_FULL_PAGE_LOADING } from "../../constants";
import { LoadingContext } from "../../providers/LoadingContextProvider";
import { ExtendedUser } from "../../types/user";
import { convertExtendedUserFromServer } from "../../utils/user";
import { Page } from "../Page/Page";
import { UserControls } from "./components/UserControls/UserControls";
import { UserDetails } from "./components/UserDetails/UserDetails";

type Props = {
  userId: string;
};
function UserPage({ userId }: Props) {
  const { loadingDispatch } = useContext(LoadingContext);
  const [userData, setUserData] = useState<ExtendedUser | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        loadingDispatch({ type: SET_FULL_PAGE_LOADING, payload: true });
        const response = await getExtendedUserRequest(userId);
        setUserData(convertExtendedUserFromServer(response.data));
      } catch (error) {
        console.error(error);
        toast.error(
          __("Failed to get user data. Please try again", "quicktasker"),
        );
      } finally {
        loadingDispatch({ type: SET_FULL_PAGE_LOADING, payload: false });
      }
    };
    getUserData();
  }, []);

  const onChangeStatus = async (status: boolean) => {
    setUserData((prevData) => {
      if (prevData) {
        return { ...prevData, is_active: status };
      }
      return prevData;
    });
  };
  const onChangeSetUpStatus = async (status: boolean) => {
    setUserData((prevData) => {
      if (prevData) {
        return { ...prevData, setup_completed: status };
      }
      return prevData;
    });
  };
  const onChangePasswordStatus = async (status: boolean) => {
    setUserData((prevData) => {
      if (prevData) {
        return { ...prevData, has_password: status };
      }
      return prevData;
    });
  };

  return (
    <Page>
      {userData && (
        <>
          <WPQTPageHeader description={__("User details", "quicktasker")}>
            {userData.name}
          </WPQTPageHeader>
          <UserDetails data={userData} />
          <UserControls
            data={userData}
            changeStatus={onChangeStatus}
            changeSetUpStatus={onChangeSetUpStatus}
            changePasswordStatus={onChangePasswordStatus}
          />
        </>
      )}
    </Page>
  );
}

export { UserPage };
