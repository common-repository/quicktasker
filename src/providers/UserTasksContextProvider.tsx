import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { toast } from "react-toastify";
import { getUserTasksRequest } from "../api/api";
import {
  ADD_ASSIGNED_USER_TO_USER_TASK,
  CHANGE_USER_TASK_DONE_STATUS,
  EDIT_USER_TASK,
  REMOVE_ASSIGNED_USER_FROM_USER_TASK,
  REMOVE_USER_TASK,
  SET_FULL_PAGE_LOADING,
  SET_USER_TASKS,
  SET_USER_TASKS_FILTERED_PIPELINE,
  SET_USER_TASKS_SEARCH_VALUE,
} from "../constants";
import { reducer } from "../reducers/user-tasks-reducer";
import { Task, TaskFromServer } from "../types/task";
import { User } from "../types/user";
import { LoadingContext } from "./LoadingContextProvider";

const initialState: State = {
  tasks: [],
  searchValue: "",
  filteredPipelineId: "",
};

type State = {
  tasks: Task[];
  searchValue: string;
  filteredPipelineId: string;
};

type Action =
  | { type: typeof SET_USER_TASKS; payload: TaskFromServer[] }
  | { type: typeof REMOVE_USER_TASK; payload: string }
  | { type: typeof EDIT_USER_TASK; payload: TaskFromServer }
  | { type: typeof SET_USER_TASKS_FILTERED_PIPELINE; payload: string }
  | { type: typeof SET_USER_TASKS_SEARCH_VALUE; payload: string }
  | {
      type: typeof ADD_ASSIGNED_USER_TO_USER_TASK;
      payload: { taskId: string; user: User };
    }
  | {
      type: typeof CHANGE_USER_TASK_DONE_STATUS;
      payload: { taskId: string; done: boolean };
    }
  | {
      type: typeof REMOVE_ASSIGNED_USER_FROM_USER_TASK;
      payload: { taskId: string; user: User };
    };

type Dispatch = (action: Action) => void;

type UserTasksContextType = {
  state: State;
  userTasksDispatch: Dispatch;
  fetchAndSetUserTasks: () => Promise<void>;
};

const UserTasksContext = createContext<UserTasksContextType>({
  state: initialState,
  userTasksDispatch: () => {},
  fetchAndSetUserTasks: async () => {},
});

const UserTasksContextProvider = ({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) => {
  const [state, userTasksDispatch] = useReducer<React.Reducer<State, Action>>(
    reducer,
    initialState,
  );
  const { loadingDispatch } = useContext(LoadingContext);

  useEffect(() => {
    fetchAndSetUserTasks();
  }, []);

  const fetchAndSetUserTasks = async () => {
    try {
      loadingDispatch({ type: SET_FULL_PAGE_LOADING, payload: true });
      const response = await getUserTasksRequest(userId);
      userTasksDispatch({ type: SET_USER_TASKS, payload: response.data });
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to fetch user tasks", "quicktasker"));
    } finally {
      loadingDispatch({ type: SET_FULL_PAGE_LOADING, payload: false });
    }
  };

  return (
    <UserTasksContext.Provider
      value={{ state, userTasksDispatch, fetchAndSetUserTasks }}
    >
      {children}
    </UserTasksContext.Provider>
  );
};

export { UserTasksContext, UserTasksContextProvider, type Action, type State };
