import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "@wordpress/element";
import { Task, TaskFromServer } from "../../types/task";
import { getAssignedTasksRequest } from "../api/user-page-api";
import { SET_ASSIGNED_TASKS, SET_ASSIGNED_TASKS_LOADING } from "../constants";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { reducer } from "../reducers/user-assigned-tasks-reducer";
import { UserPageAppContext } from "./UserPageAppContextProvider";

const initialState: State = {
  loading: true,
  assignedTasks: [],
};

type State = {
  loading: boolean;
  assignedTasks: Task[];
};

type Action =
  | { type: typeof SET_ASSIGNED_TASKS; payload: TaskFromServer[] }
  | { type: typeof SET_ASSIGNED_TASKS_LOADING; payload: boolean };

type Dispatch = (action: Action) => void;

type UserAssignedTasksContextType = {
  state: State;
  userAssignedTasksDispatch: Dispatch;
  loadAssignedTasks: () => void;
};

const UserAssignedTasksContext = createContext<UserAssignedTasksContextType>({
  state: initialState,
  userAssignedTasksDispatch: () => {},
  loadAssignedTasks: () => {},
});

const UserAssignedTasksContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, userAssignedTasksDispatch] = useReducer<
    React.Reducer<State, Action>
  >(reducer, initialState);
  const {
    state: { pageHash },
  } = useContext(UserPageAppContext);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    loadAssignedTasks();
  }, [pageHash]);

  const loadAssignedTasks = async () => {
    try {
      userAssignedTasksDispatch({
        type: SET_ASSIGNED_TASKS_LOADING,
        payload: true,
      });
      const response = await getAssignedTasksRequest(pageHash);

      userAssignedTasksDispatch({
        type: SET_ASSIGNED_TASKS,
        payload: response.data,
      });
    } catch (error) {
      handleError(error);
    } finally {
      userAssignedTasksDispatch({
        type: SET_ASSIGNED_TASKS_LOADING,
        payload: false,
      });
    }
  };

  return (
    <UserAssignedTasksContext.Provider
      value={{ state, userAssignedTasksDispatch, loadAssignedTasks }}
    >
      {children}
    </UserAssignedTasksContext.Provider>
  );
};

export {
  UserAssignedTasksContext,
  UserAssignedTasksContextProvider,
  type Action,
  type State,
};
