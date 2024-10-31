import {
  ADD_ASSIGNED_USER_TO_ARCHIVED_TASK,
  CHANGE_ARCHIVE_TASK_DONE_FILTER,
  CHANGE_ARCHIVED_TASK_DONE_STATUS,
  EDIT_ARCHIVED_TASK,
  REMOVE_ARCHIVED_TASK,
  REMOVE_ASSINGED_USER_FROM_ARCHIVED_TASK,
  SET_ARCHIVE_FILTERED_PIPELINE,
  SET_ARCHIVE_SEARCH_VALUE,
  SET_ARCHIVE_TASKS,
} from "../constants";
import { Action, State } from "../providers/ArchiveContextProvider";
import { TaskFromServer } from "../types/task";
import { convertTaskFromServer } from "../utils/task";

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case SET_ARCHIVE_TASKS: {
      const archivedTasks: TaskFromServer[] = action.payload;

      return {
        ...state,
        archivedTasks: archivedTasks.map(convertTaskFromServer),
      };
    }
    case SET_ARCHIVE_SEARCH_VALUE: {
      const archiveSearchValue: string = action.payload;

      return {
        ...state,
        archiveSearchValue,
      };
    }
    case SET_ARCHIVE_FILTERED_PIPELINE: {
      const archiveFilteredPipelineId: string = action.payload;

      return {
        ...state,
        archiveFilteredPipelineId,
      };
    }
    case REMOVE_ARCHIVED_TASK: {
      const archivedTasks = (state.archivedTasks ?? []).filter(
        (task) => task.id !== action.payload,
      );

      return {
        ...state,
        archivedTasks,
      };
    }
    case ADD_ASSIGNED_USER_TO_ARCHIVED_TASK: {
      const { taskId, user } = action.payload;

      const archivedTasks = (state.archivedTasks ?? []).map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            assigned_users: [user, ...task.assigned_users],
          };
        }

        return task;
      });

      return {
        ...state,
        archivedTasks,
      };
    }
    case REMOVE_ASSINGED_USER_FROM_ARCHIVED_TASK: {
      const { taskId, user } = action.payload;

      const archivedTasks = (state.archivedTasks ?? []).map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            assigned_users: task.assigned_users.filter(
              (assignedUser) => assignedUser.id !== user.id,
            ),
          };
        }

        return task;
      });

      return {
        ...state,
        archivedTasks,
      };
    }
    case CHANGE_ARCHIVED_TASK_DONE_STATUS: {
      const { taskId, done } = action.payload;

      const archivedTasks = (state.archivedTasks ?? []).map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            is_done: done,
          };
        }

        return task;
      });

      return {
        ...state,
        archivedTasks,
      };
    }
    case EDIT_ARCHIVED_TASK: {
      const editedTask: TaskFromServer = action.payload;

      const archivedTasks = (state.archivedTasks ?? []).map((task) => {
        if (task.id === editedTask.id) {
          return convertTaskFromServer(editedTask);
        }

        return task;
      });

      return {
        ...state,
        archivedTasks,
      };
    }
    case CHANGE_ARCHIVE_TASK_DONE_FILTER: {
      const archiveTaskDoneFilter = action.payload;

      return {
        ...state,
        archiveTaskDoneFilter,
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer };
