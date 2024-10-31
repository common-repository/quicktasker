import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { ModalContext } from "../../../providers/ModalContextProvider";
import { Task } from "../../../types/task";
import {
  WPQTModalField,
  WPQTModalFieldSet,
  WPQTModalFooter,
} from "../WPQTModal";

import {
  ArchiveBoxIcon,
  ArrowUturnUpIcon,
  CheckBadgeIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  ADD_ASSIGNED_USER_TO_EDITING_TASK,
  CLOSE_TASK_MODAL,
  PIPELINE_CHANGE_TASK_DONE_STATUS,
  REMOVE_ARCHIVED_TASK,
  REMOVE_ASSIGNED_USER_FROM_EDITING_TASK,
} from "../../../constants";
import { useTaskActions } from "../../../hooks/actions/useTaskActions";
import { useLoadingStates } from "../../../hooks/useLoadingStates";
import { ActivePipelineContext } from "../../../providers/ActivePipelineContextProvider";
import { AppContext } from "../../../providers/AppContextProvider";
import { ArchiveContext } from "../../../providers/ArchiveContextProvider";
import { CustomFieldEntityType } from "../../../types/custom-field";
import { WPQTIconButton } from "../../common/Button/Button";
import { WPQTInput } from "../../common/Input/Input";
import { WPQTTextarea } from "../../common/TextArea/TextArea";
import { Toggle } from "../../common/Toggle/Toggle";
import { CustomFieldsInModalWrap } from "../../CustomField/CustomFieldsInModalWrap/CustomFieldsInModalWrap";
import { UserAssignementDropdown } from "../../Dropdown/UserAssignementDropdown/UserAssignementDropdown";
import { LoadingOval } from "../../Loading/Loading";
import { TaskModalTabs } from "../../Tab/CommentsAndLogs/TaskModalTabs/TaskModalTabs";

type Props = {
  taskModalSaving: boolean;
  editTask: (task: Task) => void;
  deleteTask: (task: Task) => Promise<void>;
};

const TaskModalContent = forwardRef(
  ({ taskModalSaving, editTask, deleteTask }: Props, ref) => {
    const {
      state: { taskToEdit },
      modalDispatch,
    } = useContext(ModalContext);
    const {
      state: { isUserAllowedToDelete },
    } = useContext(AppContext);
    const {
      state: { activePipeline },
      fetchAndSetPipelineData,
    } = useContext(ActivePipelineContext);
    const { archiveDispatch } = useContext(ArchiveContext);
    const [taskName, setTaskName] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [freeForAllTask, setFreeForAllTask] = useState(false);
    const { archiveTask, restoreArchivedTask } = useTaskActions();
    const {
      loading1: isDeletingTask,
      setLoading1: setIsDeletingTask,
      loading2: archiveLoading,
      setLoading2: setArchiveLoading,
    } = useLoadingStates();

    const isTaskArchived = taskToEdit?.is_archived;
    const pipelineExists = taskToEdit?.pipeline_name !== null;

    useEffect(() => {
      if (taskToEdit) {
        setTaskName(taskToEdit.name);
        setTaskDescription(taskToEdit.description);
        setFreeForAllTask(taskToEdit.free_for_all);
      }
    }, [taskToEdit]);

    const saveTask = () => {
      if (taskToEdit) {
        editTask({
          ...taskToEdit,
          name: taskName,
          description: taskDescription,
          free_for_all: freeForAllTask,
        });
      }
    };

    const clearContent = () => {
      setTaskName("");
      setTaskDescription("");
    };

    useImperativeHandle(ref, () => ({
      clearContent,
    }));

    if (!taskToEdit) {
      return null;
    }

    return (
      <>
        <div className="wpqt-grid wpqt-grid-cols-1 wpqt-gap-7 md:wpqt-grid-cols-[1fr_auto]">
          <div className="wpqt-border-0 wpqt-border-r wpqt-border-solid wpqt-border-r-gray-300 md:wpqt-pr-3">
            <div className="wpqt-mb-5 wpqt-grid wpqt-grid-cols-1 wpqt-gap-4 md:wpqt-grid-cols-[auto_1fr]">
              <WPQTModalFieldSet>
                <WPQTModalField label={__("Name", "quicktasker")}>
                  <WPQTInput
                    isAutoFocus={true}
                    value={taskName}
                    onChange={(newValue: string) => setTaskName(newValue)}
                  />
                </WPQTModalField>

                <WPQTModalField label={__("Description", "quicktasker")}>
                  <WPQTTextarea
                    rowsCount={3}
                    value={taskDescription}
                    onChange={(newValue: string) =>
                      setTaskDescription(newValue)
                    }
                  />
                </WPQTModalField>

                <WPQTModalField label={__("Assigned users", "quicktasker")}>
                  <UserAssignementDropdown
                    task={taskToEdit}
                    onUserAdd={(user) => {
                      modalDispatch({
                        type: ADD_ASSIGNED_USER_TO_EDITING_TASK,
                        payload: user,
                      });
                    }}
                    onUserDelete={(user) => {
                      modalDispatch({
                        type: REMOVE_ASSIGNED_USER_FROM_EDITING_TASK,
                        payload: user,
                      });
                    }}
                  />
                </WPQTModalField>

                <WPQTModalField
                  label={__("Free for all task", "quicktasker")}
                  tooltipId={`free-for-all-${taskToEdit.id}-tooltip`}
                  tooltipText={__(
                    "When enabled, all QuickTasker users have the ability to self-assign or unassign this task.",
                    "quicktasker",
                  )}
                >
                  <Toggle
                    checked={freeForAllTask}
                    handleChange={setFreeForAllTask}
                  />
                </WPQTModalField>

                <TaskDoneStatus
                  taskId={taskToEdit.id}
                  isCompleted={taskToEdit.is_done}
                />
              </WPQTModalFieldSet>
              <div>
                <CustomFieldsInModalWrap
                  entityId={taskToEdit.id}
                  entityType={CustomFieldEntityType.Task}
                />
              </div>
            </div>

            <div className="wpqt-mt-7 md:wpqt-pr-3">
              <TaskModalTabs task={taskToEdit} />
            </div>
          </div>

          <div className="wpqt-flex wpqt-flex-col wpqt-gap-2">
            {isTaskArchived && pipelineExists && (
              <WPQTIconButton
                icon={
                  <ArrowUturnUpIcon className="wpqt-icon-green wpqt-size-5" />
                }
                text={__("Restore task", "quicktasker")}
                onClick={() => {
                  restoreArchivedTask(taskToEdit.id, () => {
                    modalDispatch({ type: CLOSE_TASK_MODAL });
                    archiveDispatch({
                      type: REMOVE_ARCHIVED_TASK,
                      payload: taskToEdit.id,
                    });
                  });
                }}
              />
            )}
            {!isTaskArchived && (
              <WPQTIconButton
                icon={<ArchiveBoxIcon className="wpqt-icon-blue wpqt-size-5" />}
                text={__("Archive task", "quicktasker")}
                loading={archiveLoading}
                onClick={() => {
                  setArchiveLoading(true);
                  archiveTask(taskToEdit.id, () => {
                    modalDispatch({ type: CLOSE_TASK_MODAL });
                    fetchAndSetPipelineData(activePipeline!.id);
                    setArchiveLoading(false);
                  });
                }}
              />
            )}

            {isUserAllowedToDelete && (
              <WPQTIconButton
                icon={<TrashIcon className="wpqt-icon-red wpqt-size-5" />}
                text={__("Delete task", "quicktasker")}
                loading={isDeletingTask}
                onClick={async () => {
                  setIsDeletingTask(true);
                  await deleteTask(taskToEdit);
                  modalDispatch({ type: CLOSE_TASK_MODAL });
                  setIsDeletingTask(false);
                }}
              />
            )}
          </div>
        </div>
        <WPQTModalFooter
          onSave={saveTask}
          saveBtnText={
            taskModalSaving
              ? __("Saving...", "quicktasker")
              : __("Save", "quicktasker")
          }
        />
      </>
    );
  },
);

type TaskDontStatusProps = {
  taskId: string;
  isCompleted: boolean;
};
function TaskDoneStatus({ isCompleted, taskId }: TaskDontStatusProps) {
  const { modalDispatch } = useContext(ModalContext);
  const { dispatch } = useContext(ActivePipelineContext);
  const [isLoading, setIsLoading] = useState(false);
  const { changeTaskDoneStatus } = useTaskActions();

  const toggleTaskDontStatus = async () => {
    setIsLoading(true);
    await changeTaskDoneStatus(taskId, !isCompleted, (isCompleted) => {
      modalDispatch({
        type: PIPELINE_CHANGE_TASK_DONE_STATUS,
        payload: { done: isCompleted },
      });
      dispatch({
        type: PIPELINE_CHANGE_TASK_DONE_STATUS,
        payload: { taskId, done: isCompleted },
      });
    });
    setIsLoading(false);
  };
  return (
    <WPQTModalField
      label={
        isCompleted
          ? __("Task completed", "quicktasker")
          : __("Task not completed", "quicktasker")
      }
    >
      {isLoading ? (
        <LoadingOval width="24" height="24" />
      ) : (
        <CheckBadgeIcon
          onClick={toggleTaskDontStatus}
          className={`wpqt-size-6 ${isCompleted ? "wpqt-icon-green" : "wpqt-text-gray-300"} wpqt-cursor-pointer`}
        />
      )}
    </WPQTModalField>
  );
}

export { TaskModalContent };
