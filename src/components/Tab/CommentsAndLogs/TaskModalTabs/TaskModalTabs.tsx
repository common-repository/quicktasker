import { Task } from "../../../../types/task";
import { WPQTTabs } from "../../WPQTTabs";
import { LogsTabContent } from "./LogsTabContent";
import { CommentsTabContent } from "./PrivateCommentsTabContent";
import { PublicCommentsTabContent } from "./PublicCommentsTabContent";

type Props = {
  task: Task;
};
function TaskModalTabs({ task }: Props) {
  const tabs = ["Private comments", "Public comments", "Logs"];

  return (
    <WPQTTabs
      tabs={tabs}
      tabsContent={[
        <CommentsTabContent taskId={task.id} key={1} />,
        <PublicCommentsTabContent taskId={task.id} key={2} />,
        <LogsTabContent taskId={task.id} key={3} />,
      ]}
    />
  );
}

export { TaskModalTabs };
