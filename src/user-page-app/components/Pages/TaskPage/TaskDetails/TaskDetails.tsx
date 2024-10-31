import { __ } from "@wordpress/i18n";
import {
  DataDisplay,
  DisplayRow,
} from "../../../../../components/common/DataDisplay/DataDisplay";
import { Task } from "../../../../../types/task";
import { useTimezone } from "../../../../hooks/useTimezone";

type Props = {
  task: Task | null;
};
function TaskDetails({ task }: Props) {
  const { convertToWPTimezone } = useTimezone();
  if (!task) {
    return null;
  }
  const rowClasses =
    "wpqt-flex wpqt-flex-col wpqt-items-center wpqt-mb-4 wpqt-gap-1";
  const hasAssignedUsers =
    task.assigned_users && task.assigned_users.length > 0;

  return (
    <div>
      <DataDisplay>
        <DisplayRow label={__("Name", "quicktasker")} className={rowClasses}>
          {task.name}
        </DisplayRow>
        {task.description && (
          <DisplayRow
            label={__("Description", "quicktasker")}
            className={rowClasses}
          >
            {task.description}
          </DisplayRow>
        )}

        <DisplayRow label={__("Board", "quicktasker")} className={rowClasses}>
          {task.pipeline_name}
        </DisplayRow>

        <DisplayRow
          label={__("Created at", "quicktasker")}
          className={rowClasses}
        >
          {convertToWPTimezone(task.created_at)}
        </DisplayRow>
        <DisplayRow
          label={__("Free for all", "quicktasker")}
          className={rowClasses}
        >
          {task.free_for_all
            ? __("Yes", "quicktasker")
            : __("No", "quicktasker")}
        </DisplayRow>
        {hasAssignedUsers && (
          <DisplayRow
            label={__("Assigned users", "quicktasker")}
            className={rowClasses}
          >
            {task.assigned_users.map((user) => user.name).join(", ")}
          </DisplayRow>
        )}
      </DataDisplay>
    </div>
  );
}

export { TaskDetails };
