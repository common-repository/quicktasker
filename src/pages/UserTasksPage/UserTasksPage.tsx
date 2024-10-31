import { __ } from "@wordpress/i18n";
import { WPQTPageHeader } from "../../components/common/Header/Header";
import { UserTasksFilter } from "../../components/Filter/UserTasksFilter/UserTasksFilter";
import { UserTasksContextProvider } from "../../providers/UserTasksContextProvider";
import { Page } from "../Page/Page";
import { UserTasks } from "./UserTasks";

type Props = {
  userId: string;
};

function UserTasksPage({ userId }: Props) {
  return (
    <UserTasksContextProvider userId={userId}>
      <Page>
        <WPQTPageHeader
          description={__("Tasks assigned to user", "quicktasker")}
        >
          {__("User tasks", "quicktasker")}
        </WPQTPageHeader>
        <UserTasksFilter />
        <UserTasks userId={userId} />
      </Page>
    </UserTasksContextProvider>
  );
}

export { UserTasksPage };
