import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { toast } from "react-toastify";
import { getArchivedTasksRequest } from "../api/api";
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
  SET_FULL_PAGE_LOADING,
} from "../constants";
import { reducer } from "../reducers/archive-reducer";
import { WPQTArchiveDoneFilter } from "../types/enums";
import { Task, TaskFromServer } from "../types/task";
import { User } from "../types/user";
import { LoadingContext } from "./LoadingContextProvider";

const initialState: State = {
  archivedTasks: null,
  archiveLoading: false,
  archiveSearchValue: "",
  archiveFilteredPipelineId: "",
  archiveTaskDoneFilter: WPQTArchiveDoneFilter.All,
};

type State = {
  archivedTasks: Task[] | null;
  archiveLoading: boolean;
  archiveSearchValue: string;
  archiveFilteredPipelineId: string;
  archiveTaskDoneFilter: WPQTArchiveDoneFilter;
};

type Action =
  | { type: typeof SET_ARCHIVE_TASKS; payload: TaskFromServer[] }
  | { type: typeof SET_ARCHIVE_SEARCH_VALUE; payload: string }
  | { type: typeof SET_ARCHIVE_FILTERED_PIPELINE; payload: string }
  | {
      type: typeof ADD_ASSIGNED_USER_TO_ARCHIVED_TASK;
      payload: { taskId: string; user: User };
    }
  | {
      type: typeof REMOVE_ASSINGED_USER_FROM_ARCHIVED_TASK;
      payload: { taskId: string; user: User };
    }
  | { type: typeof REMOVE_ARCHIVED_TASK; payload: string }
  | { type: typeof EDIT_ARCHIVED_TASK; payload: TaskFromServer }
  | {
      type: typeof CHANGE_ARCHIVE_TASK_DONE_FILTER;
      payload: WPQTArchiveDoneFilter;
    }
  | {
      type: typeof CHANGE_ARCHIVED_TASK_DONE_STATUS;
      payload: { taskId: string; done: boolean };
    };

type Dispatch = (action: Action) => void;

type ArchiveContextType = {
  state: State;
  archiveDispatch: Dispatch;
};

const ArchiveContext = createContext<ArchiveContextType>({
  state: initialState,
  archiveDispatch: () => {},
});

const ArchiveContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, archiveDispatch] = useReducer(reducer, initialState);
  const { loadingDispatch } = useContext(LoadingContext);

  useEffect(() => {
    fetchAndSetArchivedTasks();
  }, []);

  const fetchAndSetArchivedTasks = async () => {
    try {
      loadingDispatch({
        type: SET_FULL_PAGE_LOADING,
        payload: true,
      });
      const { data } = await getArchivedTasksRequest();

      archiveDispatch({ type: SET_ARCHIVE_TASKS, payload: data });
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to fetch archived tasks", "quicktasker"));
    } finally {
      loadingDispatch({
        type: SET_FULL_PAGE_LOADING,
        payload: false,
      });
    }
  };

  return (
    <ArchiveContext.Provider value={{ state, archiveDispatch }}>
      {children}
    </ArchiveContext.Provider>
  );
};

export { ArchiveContext, ArchiveContextProvider, type Action, type State };
