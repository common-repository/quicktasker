import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { WPQTCard } from "../../components/Card/Card";
import { TaskCardActions } from "../../components/Card/TaskCardActions";
import { UserAssignementDropdown } from "../../components/Dropdown/UserAssignementDropdown/UserAssignementDropdown";
import { UserTaskDropdown } from "../../components/Dropdown/UserTaskDropdown/UserTaskDropdown";
import { NoFilterResults } from "../../components/Filter/NoFilterResults/NoFilterResults";
import { TaskModal } from "../../components/Modal/TaskModal/TaskModal";
import {
  ADD_ASSIGNED_USER_TO_USER_TASK,
  CHANGE_USER_TASK_DONE_STATUS,
  EDIT_USER_TASK,
  OPEN_EDIT_TASK_MODAL,
  REMOVE_ASSIGNED_USER_FROM_USER_TASK,
  REMOVE_USER_TASK,
} from "../../constants";
import { useTaskActions } from "../../hooks/actions/useTaskActions";
import { useUserTasksFilter } from "../../hooks/filters/useUserTasksFilter";
import { ModalContext } from "../../providers/ModalContextProvider";
import { UserTasksContext } from "../../providers/UserTasksContextProvider";
import { Task, TaskFromServer } from "../../types/task";
import { User } from "../../types/user";

type Props = {
  userId: string;
};
function UserTasks({ userId }: Props) {
  const { filterTasks } = useUserTasksFilter();
  const { modalDispatch } = useContext(ModalContext);
  const {
    state: { tasks },
    userTasksDispatch,
  } = useContext(UserTasksContext);
  const { removeTaskFromUser } = useTaskActions();
  const filteredTasks = tasks?.filter(filterTasks) ?? [];

  const unAssignTask = async (taskId: string) => {
    removeTaskFromUser(userId, taskId, () => {
      userTasksDispatch({ type: REMOVE_USER_TASK, payload: taskId });
    });
  };

  const onEditTaskCallback = (task: TaskFromServer) => {
    userTasksDispatch({ type: EDIT_USER_TASK, payload: task });
  };

  if (tasks && tasks.length === 0) {
    return <NoFilterResults text={__("User has no tasks", "quicktasker")} />;
  }

  if (filteredTasks && filteredTasks.length === 0) {
    return <NoFilterResults />;
  }

  return (
    <>
      <div className="wpqt-card-grid">
        {filteredTasks.map((task: Task) => {
          return (
            <WPQTCard
              className="wpqt-cursor-pointer"
              key={task.id}
              title={task.name}
              description={task.description}
              dropdown={
                <UserTaskDropdown
                  taskId={task.id}
                  onUnAssignTask={unAssignTask}
                />
              }
              onClick={() => {
                modalDispatch({
                  type: OPEN_EDIT_TASK_MODAL,
                  payload: { taskToEdit: task },
                });
              }}
            >
              <UserAssignementDropdown
                task={task}
                onUserAdd={(user: User) => {
                  userTasksDispatch({
                    type: ADD_ASSIGNED_USER_TO_USER_TASK,
                    payload: { taskId: task.id, user },
                  });
                }}
                onUserDelete={(user: User) => {
                  userTasksDispatch({
                    type: REMOVE_ASSIGNED_USER_FROM_USER_TASK,
                    payload: { taskId: task.id, user },
                  });
                }}
              />
              <TaskCardActions
                task={task}
                onDoneStatusChange={(taskId: string, done: boolean) => {
                  userTasksDispatch({
                    type: CHANGE_USER_TASK_DONE_STATUS,
                    payload: { taskId, done },
                  });
                }}
              />
            </WPQTCard>
          );
        })}
      </div>
      <TaskModal editTaskCallback={onEditTaskCallback} />
    </>
  );
}

export { UserTasks };
