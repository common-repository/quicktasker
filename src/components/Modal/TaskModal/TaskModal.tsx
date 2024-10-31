import { useContext } from "@wordpress/element";
import { editTaskRequest } from "../../../api/api";
import { CLOSE_TASK_MODAL, PIPELINE_EDIT_TASK } from "../../../constants";
import { useTaskActions } from "../../../hooks/actions/useTaskActions";
import { DispatchType, useModal } from "../../../hooks/useModal";
import { ModalContext } from "../../../providers/ModalContextProvider";
import { Task, TaskFromServer } from "../../../types/task";
import { WPQTModal } from "../WPQTModal";
import { TaskModalContent } from "./TaskModalContent";

type Props = {
  editTaskCallback?: (task: TaskFromServer) => void;
  deleteTaskCallback?: (task: Task) => void;
};
function TaskModal({ editTaskCallback, deleteTaskCallback }: Props) {
  const {
    state: { taskModalOpen },
  } = useContext(ModalContext);
  const { deleteTask } = useTaskActions();

  const {
    modalSaving,
    setModalSaving,
    modalContentRef,
    closeModal,
    handleSuccess,
    handleError,
  } = useModal(CLOSE_TASK_MODAL);

  const editTask = async (task: Task) => {
    try {
      setModalSaving(true);
      const response = await editTaskRequest(task);

      handleSuccess(
        PIPELINE_EDIT_TASK,
        response.data,
        DispatchType.ACTIVE_PIPELINE,
      );
      if (editTaskCallback) {
        editTaskCallback(response.data);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const onDeleteTask = async (task: Task) => {
    deleteTask(task.id, () => {
      if (deleteTaskCallback) {
        deleteTaskCallback(task);
      }
    });
  };

  return (
    <WPQTModal modalOpen={taskModalOpen} closeModal={closeModal} size="xl">
      <TaskModalContent
        ref={modalContentRef}
        editTask={editTask}
        deleteTask={onDeleteTask}
        taskModalSaving={modalSaving}
      />
    </WPQTModal>
  );
}

export { TaskModal };
