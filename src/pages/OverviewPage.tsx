import { WPQTPageHeader } from "../components/common/Header/Header";
import { Page } from "./Page/Page";

function OverviewPage() {
  return (
    <Page>
      <WPQTPageHeader>Overview</WPQTPageHeader>
      <p>This is the overview page.</p>
    </Page>
  );
}

export { OverviewPage };
