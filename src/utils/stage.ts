import { Stage, StageFromServer } from "../types/stage";
import { TaskFromServer } from "../types/task";
import { convertTaskFromServer } from "./task";

const convertStageFromServer = (stage: StageFromServer): Stage => ({
  ...stage,
  stage_order: Number(stage.stage_order),
  tasks: (stage.tasks || []).map((task: TaskFromServer) => ({
    ...convertTaskFromServer(task),
  })),
});

export { convertStageFromServer };
