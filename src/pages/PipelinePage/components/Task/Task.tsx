import { Draggable } from "@hello-pangea/dnd";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "@wordpress/element";
import { TaskControlsDropdown } from "../../../../components/Dropdown/TaskControlsDropdown/TaskControlsDropdown";
import { UserAssignementDropdown } from "../../../../components/Dropdown/UserAssignementDropdown/UserAssignementDropdown";
import { Loading } from "../../../../components/Loading/Loading";
import {
  OPEN_EDIT_TASK_MODAL,
  PIPELINE_CHANGE_TASK_DONE_STATUS,
} from "../../../../constants";
import { useTaskActions } from "../../../../hooks/actions/useTaskActions";
import { ActivePipelineContext } from "../../../../providers/ActivePipelineContextProvider";
import { ModalContext } from "../../../../providers/ModalContextProvider";
import { Task } from "../../../../types/task";

type Props = {
  task: Task;
  index: number;
};

function Task({ task, index }: Props) {
  const { modalDispatch } = useContext(ModalContext);

  const openEditTaskModal = () => {
    modalDispatch({
      type: OPEN_EDIT_TASK_MODAL,
      payload: {
        taskToEdit: task,
      },
    });
  };

  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="wpqt-relative wpqt-mx-3 wpqt-mb-2 wpqt-flex !wpqt-cursor-pointer wpqt-flex-col wpqt-gap-1 wpqt-rounded wpqt-border wpqt-border-gray-200 wpqt-bg-white wpqt-p-3 wpqt-shadow"
          onClick={openEditTaskModal}
        >
          <div className="wpqt-absolute wpqt-right-[12px] wpqt-top-[12px]">
            <TaskControlsDropdown task={task} />
          </div>

          <div className="wpqt-text-base">{task.name}</div>

          {task.description && (
            <div className="wpqt-text-sm wpqt-italic">{task.description}</div>
          )}

          <div className="wpqt-mt-2">
            <UserAssignementDropdown task={task} />
          </div>
          <TaskActions task={task} />
        </div>
      )}
    </Draggable>
  );
}

type TaskActionsProps = {
  task: Task;
};
function TaskActions({ task }: TaskActionsProps) {
  const { dispatch } = useContext(ActivePipelineContext);
  const { changeTaskDoneStatus } = useTaskActions();
  const [loading, setLoading] = useState(false);
  const isTaskCompleted = task.is_done;

  const changeDone = async (done: boolean) => {
    setLoading(true);
    await changeTaskDoneStatus(task.id, done, (isCompleted) => {
      dispatch({
        type: PIPELINE_CHANGE_TASK_DONE_STATUS,
        payload: { taskId: task.id, done: isCompleted },
      });
    });
    setLoading(false);
  };

  if (loading) {
    return <Loading ovalSize="24" />;
  }

  return (
    <div className="wpqt-flex wpqt-justify-center">
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
          className="wpqt-size-6 wpqt-icon-gray"
          onClick={(e) => {
            e.stopPropagation();
            changeDone(true);
          }}
        />
      )}
    </div>
  );
}

export { Task };
