import { WPQTLogCreatedBy } from "./enums";

type BaseLog = {
  id: string;
  text: string;
  type: "task" | "stage" | "pipeline" | "user";
  type_id: string;
  created_at: string;
  author_name: string;
  user_id: string;
  created_by: WPQTLogCreatedBy;
};

type Log = BaseLog;
type LogFromServer = BaseLog;

export type { Log, LogFromServer };
