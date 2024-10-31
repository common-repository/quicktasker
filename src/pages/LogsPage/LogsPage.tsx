import { __ } from "@wordpress/i18n";
import { WPQTPageHeader } from "../../components/common/Header/Header";
import { Page } from "../Page/Page";
import { LogsPageContent } from "./components/LogsPageContent/LogsPageContent";

const LogsPage = () => {
  return (
    <Page>
      <WPQTPageHeader
        description={__(
          "The logs page where you can see all logs and filter them.",
          "quicktasker",
        )}
      >
        {__("Logs", "quicktasker")}
      </WPQTPageHeader>
      <LogsPageContent />
    </Page>
  );
};

export { LogsPage };
