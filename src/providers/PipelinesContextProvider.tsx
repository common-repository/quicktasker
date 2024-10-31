import { createContext, useEffect, useReducer } from "@wordpress/element";
import {
  PIPELINE_ADD_PIPELINE,
  PIPELINE_EDIT_PIPELINE,
  PIPELINE_REMOVE_PIPELINE,
  PIPELINE_SET_PRIMARY,
  PIPELINES_SET,
} from "../constants";
import { reducer } from "../reducers/pipelines-reducer";
import { Pipeline, PipelineFromServer } from "../types/pipeline";

const initialState: State = {
  pipelines: [],
};

type State = {
  pipelines: Pipeline[];
};

type Action =
  | { type: typeof PIPELINES_SET; payload: PipelineFromServer[] }
  | { type: typeof PIPELINE_ADD_PIPELINE; payload: PipelineFromServer }
  | { type: typeof PIPELINE_EDIT_PIPELINE; payload: Pipeline }
  | { type: typeof PIPELINE_REMOVE_PIPELINE; payload: string }
  | { type: typeof PIPELINE_SET_PRIMARY; payload: string };

type Dispatch = (action: Action) => void;

type PipelinesDispatch = {
  state: State;
  pipelinesDispatch: Dispatch;
};

const PipelinesContext = createContext<PipelinesDispatch>({
  state: initialState,
  pipelinesDispatch: () => {},
});

const PipelinesContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, pipelinesDispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialPipelines = window.wpqt.initialPipelines;

    pipelinesDispatch({ type: PIPELINES_SET, payload: initialPipelines });
  }, []);

  return (
    <PipelinesContext.Provider value={{ state, pipelinesDispatch }}>
      {children}
    </PipelinesContext.Provider>
  );
};

export { PipelinesContext, PipelinesContextProvider, type Action, type State };
