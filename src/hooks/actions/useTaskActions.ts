import { __ } from "@wordpress/i18n";
import { toast } from "react-toastify";
import {
  archiveTaskRequest,
  deleteTaskRequest,
  markTaskDoneRequest,
  removeTaskFromUserRequest,
  restoreArchivedTaskRequest,
} from "../../api/api";

const useTaskActions = () => {
  const deleteTask = async (taskId: string, callback?: () => void) => {
    try {
      await deleteTaskRequest(taskId);
      if (callback) callback();
      toast.success(__("Task deleted", "quicktasker"));
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to delete a task", "quicktasker"));
    }
  };

  const archiveTask = async (taskId: string, callback?: () => void) => {
    try {
      await archiveTaskRequest(taskId);
      if (callback) callback();
      toast.success(__("Task archived", "quicktasker"));
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to archive a task", "quicktasker"));
    }
  };

  const restoreArchivedTask = async (taskId: string, callback?: () => void) => {
    try {
      await restoreArchivedTaskRequest(taskId);
      if (callback) callback();
      toast.success(__("Task restored", "quicktasker"));
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to restore a task", "quicktasker"));
    }
  };

  const removeTaskFromUser = async (
    userId: string,
    taskId: string,
    callback?: () => void,
  ) => {
    try {
      await removeTaskFromUserRequest(userId, taskId);
      if (callback) callback();
      toast.success(__("Task has been unassigned", "quicktasker"));
    } catch (error) {
      console.error(error);
      toast.error(__("Task unassignment failed. Try again", "quicktasker"));
    }
  };

  const changeTaskDoneStatus = async (
    taskId: string,
    isCompleted: boolean,
    callback?: (isCompleted: boolean) => void,
  ) => {
    try {
      const successMessage = isCompleted
        ? __("Task marked as completed", "quicktasker")
        : __("Task marked as incomplete", "quicktasker");
      await markTaskDoneRequest(taskId, isCompleted);
      if (callback) callback(isCompleted);
      toast.success(successMessage);
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to change task status", "quicktasker"));
    }
  };

  return {
    deleteTask,
    archiveTask,
    restoreArchivedTask,
    removeTaskFromUser,
    changeTaskDoneStatus,
  };
};

export { useTaskActions };
