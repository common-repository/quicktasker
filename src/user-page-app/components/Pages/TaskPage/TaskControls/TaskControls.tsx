import {
  ChatBubbleLeftIcon,
  UserMinusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { useContext } from "@wordpress/element";
import { useNavigate } from "react-router-dom";
import { WPQTIconButton } from "../../../../../components/common/Button/Button";
import { Task } from "../../../../../types/task";
import { User } from "../../../../../types/user";
import { UPDATE_USER_PAGE_TASK_DATA } from "../../../../constants";
import { useTaskActions } from "../../../../hooks/actions/useTaskActions";
import { UserPageAppContext } from "../../../../providers/UserPageAppContextProvider";
import { UserPageTaskContext } from "../../../../providers/UserPageTaskContextProvider";

type Props = {
  task: Task | null;
};
function TaskControls({ task }: Props) {
  const {
    state: { pageHash, userId },
  } = useContext(UserPageAppContext);
  const { userTaskDispatch } = useContext(UserPageTaskContext);
  const { assignToTask, unAssignFromTask } = useTaskActions();
  const navigate = useNavigate();

  const isAssignedToTask = task?.assigned_users.some(
    (user: User) => user.id === userId,
  );

  if (task === null) {
    return null;
  }

  const onAssignToTask = async () => {
    await assignToTask(pageHash, task.task_hash, (data) => {
      userTaskDispatch({ type: UPDATE_USER_PAGE_TASK_DATA, payload: data });
    });
  };

  const onUnassignFromTask = async () => {
    await unAssignFromTask(pageHash, task.task_hash, () => {
      navigate(`/`);
    });
  };

  return (
    <div className="wpqt-mt-5 wpqt-flex wpqt-flex-wrap wpqt-justify-center wpqt-gap-4">
      {isAssignedToTask && (
        <WPQTIconButton
          icon={<UserMinusIcon className="wpqt-icon-red wpqt-size-5" />}
          text="Unassign from task"
          onClick={onUnassignFromTask}
        />
      )}
      {isAssignedToTask && (
        <WPQTIconButton
          icon={<ChatBubbleLeftIcon className="wpqt-icon-blue wpqt-size-5" />}
          text="Manage task comments"
          onClick={() => {
            navigate(`/tasks/${task.task_hash}/comments`);
          }}
        />
      )}
      {!isAssignedToTask && (
        <WPQTIconButton
          icon={<UserPlusIcon className="wpqt-icon-green wpqt-size-5" />}
          text="Assing to task"
          onClick={onAssignToTask}
        />
      )}
    </div>
  );
}

export { TaskControls };
