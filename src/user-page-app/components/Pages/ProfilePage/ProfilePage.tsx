import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { CustomFieldEntityType } from "../../../../types/custom-field";
import {
  UserPageUserContext,
  UserPageUserContextProvider,
} from "../../../providers/UserPageUserContextProvider";
import { CustomFieldsWrap } from "../../CustomField/CustomFieldsWrap/CustomFieldsWrap";
import { PageContentWrap, PageTitle, PageWrap } from "../Page/Page";
import { ProfileActions } from "./components/ProfileActions/ProfileActions";
import { UserDetails } from "./components/UserDetails/UserDetails";

function PprofilePage() {
  return (
    <UserPageUserContextProvider>
      <ProfilePageContent />
    </UserPageUserContextProvider>
  );
}

function ProfilePageContent() {
  const {
    state: { loading, user, customFields },
    loadUserData,
  } = useContext(UserPageUserContext);

  if (!user) {
    return null;
  }

  return (
    <PageWrap loading={loading} onRefresh={loadUserData}>
      <PageContentWrap>
        <PageTitle>{__("User details", "quicktasker")}</PageTitle>
        <div className="wpqt-flex wpqt-flex-col wpqt-items-center wpqt-gap-3">
          <UserDetails user={user} />
          <CustomFieldsWrap
            entityId={user.id}
            entityType={CustomFieldEntityType.User}
            entity={user}
            customFields={customFields}
          />
          <ProfileActions />
        </div>
      </PageContentWrap>
    </PageWrap>
  );
}

export { PprofilePage };
