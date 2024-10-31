import { __ } from "@wordpress/i18n";
import { WPQTPageHeader } from "../../components/common/Header/Header";
import { UserSessionsFilter } from "../../components/Filter/UserSessionsFilter/UserSessionsFilter";
import { UserSessionsContextProvider } from "../../providers/UserSessionsContextProvider";
import { Page } from "./../Page/Page";
import { UserSessions } from "./components/UserSessions";

function UserSessionsPage() {
  return (
    <UserSessionsContextProvider>
      <Page>
        <WPQTPageHeader>{__("User sessions", "quicktasker")}</WPQTPageHeader>
        <UserSessionsFilter />
        <UserSessions />
      </Page>
    </UserSessionsContextProvider>
  );
}

export { UserSessionsPage };
