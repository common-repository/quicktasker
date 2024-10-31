import {
  ADD_ASSIGNED_USER_TO_USER_TASK,
  CHANGE_USER_TASK_DONE_STATUS,
  EDIT_USER_TASK,
  REMOVE_ASSIGNED_USER_FROM_USER_TASK,
  REMOVE_USER_TASK,
  SET_USER_TASKS,
  SET_USER_TASKS_FILTERED_PIPELINE,
  SET_USER_TASKS_SEARCH_VALUE,
} from "../constants";
import { Action, State } from "../providers/UserTasksContextProvider";
import { TaskFromServer } from "../types/task";
import { convertTaskFromServer } from "../utils/task";

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case SET_USER_TASKS: {
      const payload: TaskFromServer[] = action.payload;
      const tasks = payload.map(convertTaskFromServer);

      return {
        ...state,
        tasks,
      };
    }
    case REMOVE_USER_TASK: {
      const taskId: string = action.payload;

      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== taskId),
      };
    }
    case EDIT_USER_TASK: {
      const task: TaskFromServer = action.payload;
      const updatedTasks = state.tasks.map((t) => {
        if (t.id === task.id) {
          return convertTaskFromServer(task);
        }
        return t;
      });

      return {
        ...state,
        tasks: updatedTasks,
      };
    }
    case SET_USER_TASKS_SEARCH_VALUE: {
      const searchValue = action.payload;

      return {
        ...state,
        searchValue,
      };
    }
    case SET_USER_TASKS_FILTERED_PIPELINE: {
      const filteredPipelineId = action.payload;

      return {
        ...state,
        filteredPipelineId,
      };
    }
    case ADD_ASSIGNED_USER_TO_USER_TASK: {
      const { taskId, user } = action.payload;

      const updatedTasks = state.tasks.map((task) => {
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
        tasks: updatedTasks,
      };
    }
    case REMOVE_ASSIGNED_USER_FROM_USER_TASK: {
      const { taskId, user } = action.payload;

      const updatedTasks = state.tasks.map((task) => {
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
        tasks: updatedTasks,
      };
    }
    case CHANGE_USER_TASK_DONE_STATUS: {
      const { taskId, done } = action.payload;

      const updatedTasks = state.tasks.map((task) => {
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
        tasks: updatedTasks,
      };
    }
    default:
      return state;
  }
};

export { reducer };
