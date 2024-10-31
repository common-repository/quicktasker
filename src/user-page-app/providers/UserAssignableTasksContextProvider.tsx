import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "@wordpress/element";
import { Task, TaskFromServer } from "../../types/task";

import { UserPageAppContext } from "./UserPageAppContextProvider";

import { getAssignableTasksRequest } from "../api/user-page-api";
import {
  REMOVE_ASSIGNABLE_TASK,
  SET_ASSIGNABLE_TASKS,
  SET_ASSIGNABLE_TASKS_LOADING,
} from "../constants";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { reducer } from "../reducers/user-assignable-tasks-reducer";

const initialState: State = {
  loading: true,
  assignableTasks: [],
};

type State = {
  loading: boolean;
  assignableTasks: Task[];
};

type Action =
  | { type: typeof SET_ASSIGNABLE_TASKS_LOADING; payload: boolean }
  | { type: typeof SET_ASSIGNABLE_TASKS; payload: TaskFromServer[] }
  | { type: typeof REMOVE_ASSIGNABLE_TASK; payload: string };

type Dispatch = (action: Action) => void;

type UserAssignableTasksContextType = {
  state: State;
  userAssignableTasksDispatch: Dispatch;
  loadAssignableTasks: () => void;
};

const UserAssignableTasksContext =
  createContext<UserAssignableTasksContextType>({
    state: initialState,
    userAssignableTasksDispatch: () => {},
    loadAssignableTasks: () => {},
  });

const UserAssignableTasksContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, userAssignableTasksDispatch] = useReducer<
    React.Reducer<State, Action>
  >(reducer, initialState);
  const {
    state: { pageHash },
  } = useContext(UserPageAppContext);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    loadAssignableTasks();
  }, [pageHash]);

  const loadAssignableTasks = async () => {
    try {
      userAssignableTasksDispatch({
        type: SET_ASSIGNABLE_TASKS_LOADING,
        payload: true,
      });
      const response = await getAssignableTasksRequest(pageHash);

      userAssignableTasksDispatch({
        type: SET_ASSIGNABLE_TASKS,
        payload: response.data,
      });
    } catch (error) {
      handleError(error);
    } finally {
      userAssignableTasksDispatch({
        type: SET_ASSIGNABLE_TASKS_LOADING,
        payload: false,
      });
    }
  };

  return (
    <UserAssignableTasksContext.Provider
      value={{ state, userAssignableTasksDispatch, loadAssignableTasks }}
    >
      {children}
    </UserAssignableTasksContext.Provider>
  );
};

export {
  UserAssignableTasksContext,
  UserAssignableTasksContextProvider,
  type Action,
  type State,
};
