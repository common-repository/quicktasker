import { Stage } from "../types/stage";
import { Task, TaskFromServer } from "../types/task";
import { ServerUser } from "../types/user";
import { convertUserFromServer } from "./user";

/**
 * Moves a task from one stage to another within a list of stages.
 *
 * @param stages                           - The list of stages.
 * @param droppableSource                  - The source stage and index of the task being moved.
 * @param droppableDestination             - The destination stage and index where the task will be moved to.
 * @param droppableSource.index
 * @param droppableSource.droppableId
 * @param droppableDestination.index
 * @param droppableDestination.droppableId
 * @return The updated list of stages after moving the task.
 */
const moveTask = (
  stages: Stage[],
  droppableSource: { index: number; droppableId: string },
  droppableDestination: { index: number; droppableId: string },
): Stage[] => {
  const stagesClone = [...stages];

  const sourceStage = stagesClone.find(
    (stage) => stage.id === droppableSource.droppableId,
  );
  const destinationStage = stagesClone.find(
    (stage) => stage.id === droppableDestination.droppableId,
  );
  if (sourceStage?.tasks && destinationStage?.tasks) {
    const [removed] = sourceStage.tasks.splice(droppableSource.index, 1);

    destinationStage.tasks.splice(droppableDestination.index, 0, removed);
  }

  return stagesClone;
};

/**
 * Reorders a list of tasks after a task has been moved.
 *
 * @param list       - The list of tasks.
 * @param startIndex - The index of the task being moved.
 * @param endIndex   - The index where the task will be moved to.
 * @return The updated list of tasks after reordering.
 */
const reorderTask = (list: Task[], startIndex: number, endIndex: number) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Converts a task object received from the server to a Task object.
 * @param task - The task object received from the server.
 * @return The converted Task object.
 */
const convertTaskFromServer = (task: TaskFromServer): Task => ({
  ...task,
  task_order: Number(task.task_order),
  free_for_all: task.free_for_all === "1",
  is_archived: task.is_archived === "1",
  is_done: task.is_done === "1",
  assigned_users: task.assigned_users
    ? task.assigned_users.map((user: ServerUser) => ({
        ...convertUserFromServer(user),
      }))
    : [], // Default to an empty array if assigned_users is undefined
});

export { convertTaskFromServer, moveTask, reorderTask };
