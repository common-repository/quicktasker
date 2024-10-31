import {
  CalendarIcon,
  CheckBadgeIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";
import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { useNavigate } from "react-router-dom";
import { WPQTCard, WPQTCardDataItem } from "../../../../components/Card/Card";
import { useTimezone } from "../../../hooks/useTimezone";
import { UserAssignedTasksContext } from "../../../providers/UserAssignedTasksContextProvider";

function UserTasks() {
  const {
    state: { assignedTasks },
  } = useContext(UserAssignedTasksContext);
  const navigate = useNavigate();
  const { convertToWPTimezone } = useTimezone();

  return (
    <div className="wpqt-user-page-card-flex">
      {assignedTasks.map((task) => {
        const isCompleted = task.is_done;

        return (
          <WPQTCard
            key={task.id}
            className="wpqt-cursor-pointer wpqt-min-w-[340px]"
            title={task.name}
            description={task.description}
            onClick={() => navigate(`/tasks/${task.task_hash}`)}
          >
            <WPQTCardDataItem
              label={__("Created", "quicktasker")}
              value={convertToWPTimezone(task.created_at)}
              icon={<CalendarIcon className="wpqt-size-5 wpqt-icon-blue" />}
            />
            <WPQTCardDataItem
              label={__("Board", "quicktasker")}
              value={
                task.pipeline_name
                  ? task.pipeline_name
                  : __("Board is deleted!", "quicktasker")
              }
              icon={<ViewColumnsIcon className="wpqt-size-5 wpqt-icon-blue" />}
            />
            <WPQTCardDataItem
              label={
                isCompleted
                  ? __("Task completed", "quicktasker")
                  : __("Task not completed", "quicktasker")
              }
              value={task.stage_id}
              icon={
                isCompleted ? (
                  <CheckBadgeIcon className="wpqt-size-5 wpqt-icon-green" />
                ) : (
                  <CheckBadgeIcon className="wpqt-size-5 wpqt-icon-gray" />
                )
              }
            />
          </WPQTCard>
        );
      })}
    </div>
  );
}

export { UserTasks };
