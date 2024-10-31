import { TaskFromServer } from "../../types/task";
import { convertStageFromServer } from "../../utils/stage";
import { convertTaskFromServer } from "../../utils/task";
import {
  SET_USER_PAGE_TASK_DATA,
  SET_USER_PAGE_TASK_LOADING,
  UPDATE_USER_PAGE_TASK_DATA,
  UPDATE_USER_PAGE_TASK_DONE,
  UPDATE_USER_PAGE_TASK_STAGE,
} from "../constants";
import { Action, State } from "../providers/UserPageTaskContextProvider";
import { UserPageTaskResponse } from "../types/user-page-task-response";

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case SET_USER_PAGE_TASK_DATA: {
      const data: UserPageTaskResponse = action.payload;

      return {
        ...state,
        task: convertTaskFromServer(data.task),
        taskStages: data.stages.map(convertStageFromServer),
        customFields: data.customFields,
      };
    }
    case UPDATE_USER_PAGE_TASK_DATA: {
      const data: TaskFromServer = action.payload;

      return {
        ...state,
        task: convertTaskFromServer(data),
      };
    }
    case SET_USER_PAGE_TASK_LOADING: {
      return {
        ...state,
        loading: action.payload,
      };
    }
    case UPDATE_USER_PAGE_TASK_STAGE: {
      const stageId = action.payload;

      return {
        ...state,
        task: state.task
          ? {
              ...state.task,
              stage_id: stageId,
            }
          : null,
      };
    }
    case UPDATE_USER_PAGE_TASK_DONE: {
      const { done } = action.payload;

      return {
        ...state,
        task: state.task
          ? {
              ...state.task,
              is_done: done,
            }
          : null,
      };
    }
    default:
      return state;
  }
};

export { reducer };
