import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "@wordpress/element";
import { CustomField } from "../../types/custom-field";
import { Stage } from "../../types/stage";
import { Task, TaskFromServer } from "../../types/task";
import { getTaskDataRequest } from "../api/user-page-api";
import {
  SET_USER_PAGE_TASK_DATA,
  SET_USER_PAGE_TASK_LOADING,
  UPDATE_USER_PAGE_TASK_DATA,
  UPDATE_USER_PAGE_TASK_DONE,
  UPDATE_USER_PAGE_TASK_STAGE,
} from "../constants";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { reducer } from "../reducers/user-page-task-reducer";
import { UserPageTaskResponse } from "../types/user-page-task-response";
import { UserPageAppContext } from "./UserPageAppContextProvider";

const initialState: State = {
  task: null,
  taskStages: [],
  customFields: [],
  loading: true,
};

type State = {
  task: Task | null;
  taskStages: Stage[];
  customFields: CustomField[];
  loading: boolean;
};

type Action =
  | { type: typeof SET_USER_PAGE_TASK_DATA; payload: UserPageTaskResponse }
  | { type: typeof UPDATE_USER_PAGE_TASK_DATA; payload: TaskFromServer }
  | {
      type: typeof UPDATE_USER_PAGE_TASK_DONE;
      payload: { done: boolean };
    }
  | { type: typeof UPDATE_USER_PAGE_TASK_STAGE; payload: string }
  | { type: typeof SET_USER_PAGE_TASK_LOADING; payload: boolean };

type Dispatch = (action: Action) => void;

type UserPageTaskContextType = {
  state: State;
  userTaskDispatch: Dispatch;
  loadTask: () => void;
};

const UserPageTaskContext = createContext<UserPageTaskContextType>({
  state: initialState,
  userTaskDispatch: () => {},
  loadTask: () => {},
});

const UserPageTaskContextProvider = ({
  children,
  taskHash,
}: {
  children: React.ReactNode;
  taskHash: string | undefined;
}) => {
  const [state, userTaskDispatch] = useReducer<React.Reducer<State, Action>>(
    reducer,
    initialState,
  );
  const {
    state: { pageHash },
  } = useContext(UserPageAppContext);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    loadTask();
  }, []);

  const loadTask = async () => {
    if (taskHash) {
      try {
        userTaskDispatch({ type: SET_USER_PAGE_TASK_LOADING, payload: true });
        const response = await getTaskDataRequest(pageHash, taskHash);
        userTaskDispatch({
          type: SET_USER_PAGE_TASK_DATA,
          payload: {
            task: response.data.task,
            stages: response.data.stages,
            customFields: response.data.customFields,
          },
        });
      } catch (error) {
        handleError(error);
      } finally {
        userTaskDispatch({ type: SET_USER_PAGE_TASK_LOADING, payload: false });
      }
    }
  };

  return (
    <UserPageTaskContext.Provider value={{ state, userTaskDispatch, loadTask }}>
      {children}
    </UserPageTaskContext.Provider>
  );
};

export {
  UserPageTaskContext,
  UserPageTaskContextProvider,
  type Action,
  type State,
};
