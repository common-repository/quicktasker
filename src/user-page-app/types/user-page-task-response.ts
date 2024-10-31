import { CustomField } from "../../types/custom-field";
import { StageFromServer } from "../../types/stage";
import { TaskFromServer } from "../../types/task";

type UserPageTaskResponse = {
  task: TaskFromServer;
  stages: StageFromServer[];
  customFields: CustomField[];
};

export type { UserPageTaskResponse };
