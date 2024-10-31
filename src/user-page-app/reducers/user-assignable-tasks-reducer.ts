import { TaskFromServer } from "../../types/task";
import { convertTaskFromServer } from "../../utils/task";
import {
  REMOVE_ASSIGNABLE_TASK,
  SET_ASSIGNABLE_TASKS,
  SET_ASSIGNABLE_TASKS_LOADING,
} from "../constants";
import { Action, State } from "../providers/UserAssignableTasksContextProvider";

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case SET_ASSIGNABLE_TASKS_LOADING: {
      const loading: boolean = action.payload;

      return {
        ...state,
        loading,
      };
    }
    case SET_ASSIGNABLE_TASKS: {
      const tasks: TaskFromServer[] = action.payload;

      return {
        ...state,
        assignableTasks: tasks.map(convertTaskFromServer),
      };
    }
    case REMOVE_ASSIGNABLE_TASK: {
      const taskId: string = action.payload;

      return {
        ...state,
        assignableTasks: state.assignableTasks.filter(
          (task) => task.id !== taskId,
        ),
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer };
