import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { toast } from "react-toastify";
import { TaskFromServer } from "../../../types/task";
import {
  assignTaskToUser,
  changeTaskDoneStatusRequest,
  changeTaskStageRequest,
  getTaskDataRequest,
  unAssignTaskFromUser,
} from "../../api/user-page-api";
import { UserPageAppContext } from "../../providers/UserPageAppContextProvider";
import { UserPageTaskResponse } from "../../types/user-page-task-response";
import { useErrorHandler } from "../useErrorHandler";

function useTaskActions() {
  const {
    state: { pageHash },
  } = useContext(UserPageAppContext);
  const { handleError } = useErrorHandler();

  const getTask = async (
    pageHash: string,
    taskHash: string,
    callback?: (data: UserPageTaskResponse) => void,
  ) => {
    try {
      const response = await getTaskDataRequest(pageHash, taskHash);
      if (callback) callback(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const assignToTask = async (
    pageHash: string,
    taskHash: string,
    callback?: (task: TaskFromServer) => void,
  ) => {
    try {
      const response = await assignTaskToUser(pageHash, taskHash);
      toast.success(__("Task assigned successfully", "quicktasker"));
      if (callback) callback(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const unAssignFromTask = async (
    pageHash: string,
    taskHash: string,
    callback?: (task: TaskFromServer) => void,
  ) => {
    try {
      const response = await unAssignTaskFromUser(pageHash, taskHash);
      toast.success(__("Task unassigned successfully", "quicktasker"));
      if (callback) callback(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const changeTaskStage = async (
    taskHash: string,
    stageId: string,
    pageHash: string,
    callback?: () => void,
  ) => {
    try {
      await changeTaskStageRequest(pageHash, taskHash, stageId);
      toast.success(__("Task stage changed successfully", "quicktasker"));
      if (callback) callback();
    } catch (error) {
      handleError(error);
    }
  };

  const changeTaskDoneStatus = async (
    taskHash: string,
    doneStatus: boolean,
    callback?: (doneStatus: boolean) => void,
  ) => {
    try {
      const successMessage = doneStatus
        ? __("Task marked as completed", "quicktasker")
        : __("Task marked as incomplete", "quicktasker");
      await changeTaskDoneStatusRequest(pageHash, taskHash, doneStatus);
      toast.success(successMessage);
      if (callback) callback(doneStatus);
    } catch (error) {
      handleError(error);
    }
  };

  return {
    getTask,
    assignToTask,
    changeTaskStage,
    unAssignFromTask,
    changeTaskDoneStatus,
  };
}

export { useTaskActions };
