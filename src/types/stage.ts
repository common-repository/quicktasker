import { Task, TaskFromServer } from "./task";

type BaseStage = {
  id: string;
  pipeline_id: string;
  name: string;
  description: string;
};

type Stage = BaseStage & {
  stage_order: number;
  tasks?: Task[];
};

type StageFromServer = BaseStage & {
  stage_order: string;
  tasks?: TaskFromServer[];
};

type StageChangeDirection = "left" | "right";

export type { Stage, StageChangeDirection, StageFromServer };
