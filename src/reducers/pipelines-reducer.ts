import {
  PIPELINE_ADD_PIPELINE,
  PIPELINE_EDIT_PIPELINE,
  PIPELINE_REMOVE_PIPELINE,
  PIPELINE_SET_PRIMARY,
  PIPELINES_SET,
} from "../constants";
import { Action, State } from "../providers/PipelinesContextProvider";
import { Pipeline, PipelineFromServer } from "../types/pipeline";
import { Stage, StageFromServer } from "../types/stage";
import { convertStageFromServer } from "../utils/stage";

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case PIPELINES_SET: {
      const pipelines: PipelineFromServer[] = action.payload;

      const transformStage = (stage: StageFromServer): Stage => {
        return {
          ...convertStageFromServer(stage),
        };
      };

      const transformPipeline = (pipeline: PipelineFromServer): Pipeline => {
        return {
          ...pipeline,
          stages: pipeline.stages?.map(transformStage),
          is_primary: pipeline.is_primary === "1",
        };
      };

      return {
        ...state,
        pipelines: pipelines.map(transformPipeline),
      };
    }
    case PIPELINE_ADD_PIPELINE: {
      const pipeline: PipelineFromServer = action.payload;

      const transformStage = (stage: StageFromServer): Stage => {
        return {
          ...convertStageFromServer(stage),
        };
      };

      const transformedPipeline: Pipeline = {
        ...pipeline,
        stages: pipeline.stages?.map(transformStage),
        is_primary: false,
      };

      return {
        ...state,
        pipelines: [...state.pipelines, transformedPipeline],
      };
    }
    case PIPELINE_SET_PRIMARY: {
      const primaryPipelineId: string = action.payload;

      return {
        ...state,
        pipelines: state.pipelines.map((pipeline) => ({
          ...pipeline,
          is_primary: pipeline.id === primaryPipelineId,
        })),
      };
    }
    case PIPELINE_EDIT_PIPELINE: {
      const pipeline: Pipeline = action.payload;

      return {
        ...state,
        pipelines: state.pipelines.map((p) =>
          p.id === pipeline.id ? pipeline : p,
        ),
      };
    }
    case PIPELINE_REMOVE_PIPELINE: {
      const pipelineId: string = action.payload;

      return {
        ...state,
        pipelines: state.pipelines.filter(
          (pipeline) => pipeline.id !== pipelineId,
        ),
      };
    }
    default:
      return state;
  }
};

export { reducer };
