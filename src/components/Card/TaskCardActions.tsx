import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { useState } from "@wordpress/element";
import { useTaskActions } from "../../hooks/actions/useTaskActions";
import { Task } from "../../types/task";
import { Loading } from "../Loading/Loading";

type Props = {
  task: Task;
  onDoneStatusChange: (taskId: string, done: boolean) => void;
  className?: string;
};
function TaskCardActions({ task, onDoneStatusChange, className = "" }: Props) {
  const { changeTaskDoneStatus } = useTaskActions();
  const [loading, setLoading] = useState(false);
  const isTaskCompleted = task.is_done;

  const changeDone = async (done: boolean) => {
    setLoading(true);
    await changeTaskDoneStatus(task.id, done, (isCompleted) => {
      onDoneStatusChange(task.id, isCompleted);
    });
    setLoading(false);
  };

  if (loading) {
    return <Loading ovalSize="24" className="wpqt-mt-auto" />;
  }

  return (
    <div className={`wpqt-flex wpqt-justify-center wpqt-mt-auto ${className}`}>
      {isTaskCompleted ? (
        <CheckBadgeIcon
          className="wpqt-size-6 wpqt-icon-green"
          onClick={(e) => {
            e.stopPropagation();
            changeDone(false);
          }}
        />
      ) : (
        <CheckBadgeIcon
          className="wpqt-size-6 wpqt-text-gray-300"
          onClick={(e) => {
            e.stopPropagation();
            changeDone(true);
          }}
        />
      )}
    </div>
  );
}

export { TaskCardActions };
