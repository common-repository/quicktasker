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
} from "../constants";
import { Action, State } from "../providers/ActivePipelineContextProvider";
import { PipelineFromServer } from "../types/pipeline";
import { Stage, StageFromServer } from "../types/stage";
import { Task, TaskFromServer } from "../types/task";
import { User } from "../types/user";
import { convertStageFromServer } from "../utils/stage";
import { convertTaskFromServer, moveTask, reorderTask } from "../utils/task";

const activePipelineReducer = (state: State, action: Action) => {
  switch (action.type) {
    case PIPELINE_SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case PIPELINE_SET_PIPELINE: {
      const pipelineData: PipelineFromServer = action.payload;

      const transformedStages = (pipelineData.stages || []).map(
        (stage: StageFromServer) => {
          return {
            ...convertStageFromServer(stage),
          };
        },
      );

      return {
        ...state,
        activePipeline: {
          ...pipelineData,
          stages: transformedStages,
          is_primary: pipelineData.is_primary === "1",
        },
      };
    }
    case PIPELINE_MOVE_TASK: {
      if (!state.activePipeline || !state.activePipeline.stages) {
        return state;
      }

      const stages = moveTask(
        state.activePipeline.stages,
        action.payload.source,
        action.payload.destination,
      );

      return {
        ...state,
        activePipeline: {
          ...state.activePipeline!,
          stages,
        },
      };
    }
    case PIPELINE_REORDER_TASK: {
      const { source, destination } = action.payload;
      const targetStageId = destination.droppableId;
      const targetIndex = destination.index;

      if (!state.activePipeline) {
        return state;
      }

      const targetStage = state.activePipeline.stages?.find(
        (stage) => stage.id === targetStageId,
      );

      if (!targetStage || !targetStage.tasks) {
        return state;
      }

      const reorderedTasks = reorderTask(
        targetStage!.tasks,
        source.index,
        targetIndex,
      );

      const updatedStages = state.activePipeline.stages?.map((stage) =>
        stage.id === targetStageId
          ? { ...stage, tasks: reorderedTasks }
          : stage,
      );

      return {
        ...state,
        activePipeline: {
          ...state.activePipeline!,
          stages: updatedStages,
        },
      };
    }
    case PIPELINE_ADD_TASK: {
      const newTask: Task = convertTaskFromServer(
        action.payload as TaskFromServer,
      );

      if (!state.activePipeline) {
        return state;
      }

      return {
        ...state,
        activePipeline: {
          ...state.activePipeline!,
          stages: state.activePipeline.stages?.map((stage) =>
            stage.id === newTask.stage_id
              ? {
                  ...stage,
                  tasks: [...(stage.tasks || []), newTask],
                }
              : stage,
          ),
        },
      };
    }
    case PIPELINE_EDIT_TASK: {
      const editedTask: Task = convertTaskFromServer(
        action.payload as TaskFromServer,
      );

      if (!state.activePipeline) {
        return state;
      }

      const updatedStages = state.activePipeline.stages?.map((stage) =>
        stage.id === editedTask.stage_id
          ? {
              ...stage,
              tasks: stage.tasks?.map((task) =>
                task.id === editedTask.id ? editedTask : task,
              ),
            }
          : stage,
      );

      return {
        ...state,
        activePipeline: {
          ...state.activePipeline!,
          stages: updatedStages,
        },
      };
    }
    case PIPELINE_ADD_STAGE: {
      const stage: Stage = action.payload;

      if (!state.activePipeline) {
        return state;
      }

      return {
        ...state,
        activePipeline: {
          ...state.activePipeline,
          stages: [...(state.activePipeline.stages || []), stage],
        },
      };
    }
    case PIPELINE_EDIT_STAGE: {
      const updatedStage: Stage = action.payload;

      if (!state.activePipeline) {
        return state;
      }

      const updateStage = (stage: Stage) => {
        if (stage.id === updatedStage.id) {
          return {
            ...stage,
            name: updatedStage.name,
            description: updatedStage.description,
          };
        }
        return stage;
      };

      const updatedStages = state.activePipeline.stages?.map(updateStage);

      return {
        ...state,
        activePipeline: {
          ...state.activePipeline,
          stages: updatedStages,
        },
      };
    }
    case PIPELINE_DELETE_STAGE: {
      const deletedStageId = action.payload;

      if (!state.activePipeline) {
        return state;
      }

      return {
        ...state,
        activePipeline: {
          ...state.activePipeline,
          stages: state.activePipeline.stages?.filter(
            (stage) => stage.id !== deletedStageId,
          ),
        },
      };
    }
    case PIPELINE_ADD_USER_TO_TASK: {
      const { taskId, user }: { taskId: string; user: User } = action.payload;

      if (!state.activePipeline) {
        return state;
      }

      const updatedStages = state.activePipeline.stages?.map((stage) => {
        const updatedTasks = stage.tasks?.map((task: Task) => {
          if (task.id === taskId) {
            return {
              ...task,
              assigned_users: [user, ...(task.assigned_users || [])],
            };
          }
          return task;
        });

        return {
          ...stage,
          tasks: updatedTasks,
        };
      });

      return {
        ...state,
        activePipeline: {
          ...state.activePipeline,
          stages: updatedStages,
        },
      };
    }
    case PIPELINE_REMOVE_USER_FROM_TASK: {
      const { taskId, userId }: { taskId: string; userId: string } =
        action.payload;

      if (!state.activePipeline) {
        return state;
      }

      const updatedStages = state.activePipeline.stages?.map((stage) => {
        const updatedTasks = stage.tasks?.map((task: Task) => {
          if (task.id === taskId) {
            return {
              ...task,
              assigned_users: task.assigned_users?.filter(
                (user) => user.id !== userId,
              ),
            };
          }
          return task;
        });

        return {
          ...stage,
          tasks: updatedTasks,
        };
      });

      return {
        ...state,
        activePipeline: {
          ...state.activePipeline,
          stages: updatedStages,
        },
      };
    }
    case PIPELINE_EDIT_PIPELINE: {
      const updatedPipeline: PipelineFromServer = action.payload;

      if (!state.activePipeline) {
        return state;
      }

      return {
        ...state,
        activePipeline: {
          ...state.activePipeline,
          name: updatedPipeline.name,
          description: updatedPipeline.description,
          is_primary: updatedPipeline.is_primary === "1",
        },
      };
    }
    case PIPELINE_CHANGE_TASK_DONE_STATUS: {
      const { taskId, done } = action.payload;

      if (!state.activePipeline) {
        return state;
      }

      const updatedStages = state.activePipeline.stages?.map((stage) => {
        const updatedTasks = stage.tasks?.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              is_done: done,
            };
          }
          return task;
        });

        return {
          ...stage,
          tasks: updatedTasks,
        };
      });

      return {
        ...state,
        activePipeline: {
          ...state.activePipeline,
          stages: updatedStages,
        },
      };
    }
    case PIPELINE_REMOVE_ACTIVE_PIPELINE: {
      return {
        ...state,
        activePipeline: null,
      };
    }
    default:
      return state;
  }
};

export { activePipelineReducer };
