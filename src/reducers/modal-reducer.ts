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
import { Action, State, initialState } from "../providers/ModalContextProvider";
import { Pipeline } from "../types/pipeline";
import { Stage } from "../types/stage";
import { Task } from "../types/task";
import { User } from "../types/user";

const closeModal = () => {
  return {
    ...initialState,
  };
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case OPEN_EDIT_TASK_MODAL: {
      const { taskToEdit }: { taskToEdit: Task } = action.payload;

      return {
        ...state,
        taskModalOpen: true,
        taskToEdit,
        targetStageId: taskToEdit.stage_id,
      };
    }
    case CLOSE_TASK_MODAL: {
      return closeModal();
    }
    case ADD_ASSIGNED_USER_TO_EDITING_TASK: {
      const user: User = action.payload;

      return {
        ...state,
        taskToEdit: {
          ...state.taskToEdit!,
          assigned_users: [user, ...(state.taskToEdit?.assigned_users ?? [])],
        },
      };
    }
    case REMOVE_ASSIGNED_USER_FROM_EDITING_TASK: {
      const user: User = action.payload;

      return {
        ...state,
        taskToEdit: {
          ...state.taskToEdit!,
          assigned_users: (state.taskToEdit?.assigned_users ?? []).filter(
            (assignedUser: User) => assignedUser.id !== user.id,
          ),
        },
      };
    }
    case OPEN_NEW_STAGE_MODAL: {
      const { targetPipelineId }: { targetPipelineId: string } = action.payload;

      return {
        ...state,
        stageModalOpen: true,
        targetPipelineId,
      };
    }
    case OPEN_STAGE_EDIT_MODAL: {
      const { stageToEdit }: { stageToEdit: Stage } = action.payload;

      return {
        ...state,
        stageModalOpen: true,
        stageToEdit,
      };
    }
    case CLOSE_STAGE_MODAL: {
      return closeModal();
    }
    case OPEN_NEW_PIPELINE_MODAL: {
      return {
        ...state,
        newPipelineModalOpen: true,
      };
    }
    case OPEN_EDIT_PIPELINE_MODAL: {
      const { pipelineToEdit }: { pipelineToEdit: Pipeline } = action.payload;

      return {
        ...state,
        pipelineModalOpen: true,
        pipelineToEdit,
      };
    }
    case CLOSE_PIPELINE_MODAL: {
      return closeModal();
    }
    case OPEN_ARCHIVE_TASK_MODAL: {
      const archiveTask: Task = action.payload;

      return {
        ...state,
        archiveTaskModalOpen: true,
        archiveModalTask: archiveTask,
      };
    }
    case CLOSE_ARCHIVE_TASK_MODAL: {
      return closeModal();
    }
    case OPEN_NEW_USER_MODAL: {
      return {
        ...state,
        userModalOpen: true,
      };
    }
    case OPEN_EDIT_USER_MODAL: {
      const userToEdit: User = action.payload;

      return {
        ...state,
        userModalOpen: true,
        userToEdit,
      };
    }
    case CLOSE_USER_MODAL: {
      return closeModal();
    }
    case CHANGE_USER_SETTINGS_MODAL_OPEN: {
      const open: boolean = action.payload;

      if (open) {
        return {
          ...state,
          userSettingsModalOpen: true,
        };
      }
      return closeModal();
    }
    case CHANGE_TASK_DONE_STATUS: {
      const { done }: { done: boolean } = action.payload;

      return {
        ...state,
        taskToEdit: {
          ...state.taskToEdit!,
          is_done: done,
        },
      };
    }
    default:
      return state;
  }
};

export { reducer };
