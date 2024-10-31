import { Stage, StageFromServer } from "./stage";

type BasePipeline = {
  id: string;
  name: string;
  description?: string;
};

type Pipeline = BasePipeline & {
  is_primary: boolean;
  stages?: Stage[];
};

type PipelineFromServer = BasePipeline & {
  is_primary: string;
  stages?: StageFromServer[];
};

type FullPipelineDataFromServer = {
  pipeline: PipelineFromServer;
  pipelines: PipelineFromServer[];
};

export type { FullPipelineDataFromServer, Pipeline, PipelineFromServer };
