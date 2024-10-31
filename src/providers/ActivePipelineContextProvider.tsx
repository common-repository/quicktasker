import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { toast } from "react-toastify";
import { getPipelineData } from "../api/api";
import {
  PIPELINE_ADD_STAGE,
  PIPELINE_ADD_TASK,
  PIPELINE_ADD_USER_TO_TASK,
  PIPELINE_CHANGE_TASK_DONE_STATUS,
  PIPELINE_DELETE_STAGE,
  PIPELINE_EDIT_PIPELINE,
  PIPELINE_EDIT_STAGE,
  PIPELINE_EDIT_TASK,
  PIPELINE_MOVE_TASK,
  PIPELINE_REMOVE_ACTIVE_PIPELINE,
  PIPELINE_REMOVE_USER_FROM_TASK,
  PIPELINE_REORDER_TASK,
  PIPELINE_SET_LOADING,
  PIPELINE_SET_PIPELINE,
  SET_FULL_PAGE_LOADING,
} from "../constants";
import { activePipelineReducer } from "../reducers/active-pipeline-reducer";
import { Pipeline, PipelineFromServer } from "../types/pipeline";
import { Stage } from "../types/stage";
import { TaskFromServer } from "../types/task";
import { User } from "../types/user";
import { LoadingContext } from "./LoadingContextProvider";

const initialState = {
  loading: false,
  activePipeline: null,
};

type State = {
  loading: boolean;
  activePipeline: Pipeline | null;
};

type Action =
  | { type: typeof PIPELINE_SET_LOADING; payload: boolean }
  | { type: typeof PIPELINE_SET_PIPELINE; payload: PipelineFromServer }
  | {
      type: typeof PIPELINE_MOVE_TASK;
      payload: {
        source: { index: number; droppableId: string };
        destination: { index: number; droppableId: string };
      };
    }
  | {
      type: typeof PIPELINE_REORDER_TASK;
      payload: {
        source: { index: number; droppableId: string };
        destination: { index: number; droppableId: string };
      };
    }
  | {
      type: typeof PIPELINE_CHANGE_TASK_DONE_STATUS;
      payload: { taskId: string; done: boolean };
    }
  | { type: typeof PIPELINE_ADD_TASK; payload: TaskFromServer }
  | { type: typeof PIPELINE_EDIT_TASK; payload: TaskFromServer }
  | { type: typeof PIPELINE_ADD_STAGE; payload: Stage }
  | { type: typeof PIPELINE_EDIT_STAGE; payload: Stage }
  | { type: typeof PIPELINE_DELETE_STAGE; payload: string }
  | {
      type: typeof PIPELINE_ADD_USER_TO_TASK;
      payload: { taskId: string; user: User };
    }
  | {
      type: typeof PIPELINE_REMOVE_USER_FROM_TASK;
      payload: { taskId: string; userId: string };
    }
  | { type: typeof PIPELINE_REMOVE_ACTIVE_PIPELINE }
  | { type: typeof PIPELINE_EDIT_PIPELINE; payload: PipelineFromServer };

type Dispatch = (action: Action) => void;

type PipelineContextType = {
  state: State;
  dispatch: Dispatch;
  fetchAndSetPipelineData: (pipelineId: string) => void;
};

const ActivePipelineContext = createContext<PipelineContextType>({
  state: initialState,
  dispatch: () => {},
  fetchAndSetPipelineData: () => {},
});

const ActivePipelineContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(activePipelineReducer, initialState);
  const { loadingDispatch } = useContext(LoadingContext);

  useEffect(() => {
    const initialActivePipelineId = window.wpqt.initialActivePipelineId;

    if (initialActivePipelineId) {
      fetchAndSetPipelineData(initialActivePipelineId, true);
    }
  }, []);

  const setLoadingState = (isLoading: boolean, fullPageLoading: boolean) => {
    if (fullPageLoading) {
      loadingDispatch({
        type: SET_FULL_PAGE_LOADING,
        payload: isLoading,
      });
    } else {
      dispatch({ type: PIPELINE_SET_LOADING, payload: isLoading });
    }
  };

  const fetchAndSetPipelineData = async (
    pipelineId: string,
    fullPageLoading = false,
  ) => {
    try {
      setLoadingState(true, fullPageLoading);

      const {
        data: { pipeline },
      } = await getPipelineData(pipelineId);

      dispatch({ type: PIPELINE_SET_PIPELINE, payload: pipeline });
    } catch (e) {
      console.error(e);
      toast.error(
        __("Unable to load the board. Please try again later.", "quicktasker"),
      );
    } finally {
      setLoadingState(false, fullPageLoading);
    }
  };

  return (
    <ActivePipelineContext.Provider
      value={{ state, dispatch, fetchAndSetPipelineData }}
    >
      {children}
    </ActivePipelineContext.Provider>
  );
};

export {
  ActivePipelineContext,
  ActivePipelineContextProvider,
  type Action,
  type State,
};
