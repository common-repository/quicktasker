import { createContext, useReducer } from "@wordpress/element";
import {
  ADD_ASSIGNED_USER_TO_EDITING_TASK,
  CHANGE_TASK_DONE_STATUS,
  CHANGE_USER_SETTINGS_MODAL_OPEN,
  CLOSE_ARCHIVE_TASK_MODAL,
  CLOSE_PIPELINE_MODAL,
  CLOSE_STAGE_MODAL,
  CLOSE_TASK_MODAL,
  CLOSE_USER_MODAL,
  OPEN_ARCHIVE_TASK_MODAL,
  OPEN_EDIT_PIPELINE_MODAL,
  OPEN_EDIT_TASK_MODAL,
  OPEN_EDIT_USER_MODAL,
  OPEN_NEW_PIPELINE_MODAL,
  OPEN_NEW_STAGE_MODAL,
  OPEN_NEW_USER_MODAL,
  OPEN_STAGE_EDIT_MODAL,
  REMOVE_ASSIGNED_USER_FROM_EDITING_TASK,
} from "../constants";
import { reducer } from "../reducers/modal-reducer";
import { Pipeline } from "../types/pipeline";
import { Stage } from "../types/stage";
import { Task } from "../types/task";
import { User } from "../types/user";

const initialState: State = {
  taskModalOpen: false,
  targetStageId: "",
  taskToEdit: null,
  stageModalOpen: false,
  stageToEdit: null,
  targetPipelineId: "",
  pipelineModalOpen: false,
  newPipelineModalOpen: false,
  pipelineToEdit: null,
  archiveTaskModalOpen: false,
  archiveModalTask: null,
  userModalOpen: false,
  userToEdit: null,
  userSettingsModalOpen: false,
};

type State = {
  taskModalOpen: boolean;
  targetStageId: string;
  taskToEdit: Task | null;
  stageModalOpen: boolean;
  stageToEdit: Stage | null;
  targetPipelineId: string;
  pipelineModalOpen: boolean;
  newPipelineModalOpen: boolean;
  pipelineToEdit: Pipeline | null;
  archiveTaskModalOpen: boolean;
  archiveModalTask: Task | null;
  userModalOpen: boolean;
  userToEdit: User | null;
  userSettingsModalOpen: boolean;
};

type Action =
  | { type: typeof OPEN_EDIT_TASK_MODAL; payload: { taskToEdit: Task } }
  | { type: typeof CLOSE_TASK_MODAL }
  | { type: typeof ADD_ASSIGNED_USER_TO_EDITING_TASK; payload: User }
  | { type: typeof REMOVE_ASSIGNED_USER_FROM_EDITING_TASK; payload: User }
  | { type: typeof OPEN_NEW_STAGE_MODAL; payload: { targetPipelineId: string } }
  | { type: typeof OPEN_STAGE_EDIT_MODAL; payload: { stageToEdit: Stage } }
  | { type: typeof CLOSE_STAGE_MODAL }
  | { type: typeof OPEN_NEW_PIPELINE_MODAL }
  | {
      type: typeof OPEN_EDIT_PIPELINE_MODAL;
      payload: { pipelineToEdit: Pipeline };
    }
  | { type: typeof CLOSE_PIPELINE_MODAL }
  | { type: typeof OPEN_ARCHIVE_TASK_MODAL; payload: Task }
  | { type: typeof CLOSE_ARCHIVE_TASK_MODAL }
  | { type: typeof OPEN_NEW_USER_MODAL }
  | { type: typeof OPEN_EDIT_USER_MODAL; payload: User }
  | { type: typeof CHANGE_USER_SETTINGS_MODAL_OPEN; payload: boolean }
  | {
      type: typeof CHANGE_TASK_DONE_STATUS;
      payload: { done: boolean };
    }
  | { type: typeof CLOSE_USER_MODAL };

type ModalDispatch = (action: Action) => void;

type ModalContextType = {
  state: State;
  modalDispatch: ModalDispatch;
};

const ModalContext = createContext<ModalContextType>({
  state: initialState,
  modalDispatch: () => {},
});

const ModalContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, modalDispatch] = useReducer(reducer, initialState);

  return (
    <ModalContext.Provider value={{ state, modalDispatch }}>
      {children}
    </ModalContext.Provider>
  );
};

export {
  initialState,
  ModalContext,
  ModalContextProvider,
  type Action,
  type ModalDispatch,
  type State,
};
