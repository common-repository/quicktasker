import { ServerUser, User } from "./user";

type BaseTask = {
  id: string;
  pipeline_id: string;
  pipeline_name: string | null;
  stage_id: string;
  name: string;
  description: string;
  task_hash: string;
  created_at: string;
};

type Task = BaseTask & {
  task_order: number;
  free_for_all: boolean;
  assigned_users: User[];
  is_archived: boolean;
  is_done: boolean;
};

type TaskFromServer = BaseTask & {
  task_order: string;
  free_for_all: string;
  assigned_users: ServerUser[];
  is_archived: string;
  is_done: string;
};

export type { Task, TaskFromServer };
