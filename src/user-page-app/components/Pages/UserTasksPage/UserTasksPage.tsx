import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
  UserAssignedTasksContext,
  UserAssignedTasksContextProvider,
} from "../../../providers/UserAssignedTasksContextProvider";
import { PageContentWrap, PageTitle, PageWrap } from "../Page/Page";
import { UserTasks } from "./UserTasks";

function UserTasksPage() {
  return (
    <UserAssignedTasksContextProvider>
      <UserTaskPageContent />
    </UserAssignedTasksContextProvider>
  );
}

function UserTaskPageContent() {
  const {
    state: { loading },
    loadAssignedTasks,
  } = useContext(UserAssignedTasksContext);

  return (
    <PageWrap loading={loading} onRefresh={loadAssignedTasks}>
      <PageContentWrap>
        <PageTitle
          description={__("Tasks that are assigned to you", "quicktasker")}
        >
          {__("Assigned tasks", "quicktasker")}
        </PageTitle>
        <UserTasks />
      </PageContentWrap>
    </PageWrap>
  );
}

export { UserTasksPage };
