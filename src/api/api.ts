import apiFetch from "@wordpress/api-fetch";
import { ServerLogsFilterType } from "../pages/LogsPage/components/LogsPageContent/LogsPageContent";
import { WPQTCommentFromServer } from "../types/comment";
import { CustomField, CustomFieldEntityType } from "../types/custom-field";
import { WPQTTypes } from "../types/enums";
import { LogFromServer } from "../types/log";
import {
  FullPipelineDataFromServer,
  Pipeline,
  PipelineFromServer,
} from "../types/pipeline";
import { DeletePipelineResponse } from "../types/requestResponse/delete-pipeline-response";
import { WPQTResponse } from "../types/response";
import { Stage, StageChangeDirection, StageFromServer } from "../types/stage";
import { Task, TaskFromServer } from "../types/task";
import { ServerExtendedUser, ServerUser, User } from "../types/user";
import { ServerUserSession } from "../types/user-session";

function getCommonHeaders() {
  return {
    "Content-Type": "application/json",
    "X-WPQT-API-Nonce": window.wpqt.apiNonce,
  };
}

/*
  ==================================================================================================================================================================================================================
  Pipeline requests
  ==================================================================================================================================================================================================================
*/

function getPipelineData(
  pipelineId: string,
): Promise<WPQTResponse<FullPipelineDataFromServer>> {
  return apiFetch({
    path: `/wpqt/v1/pipelines/${pipelineId}`,
    headers: getCommonHeaders(),
  });
}

function createPipelineRequest(
  name: string,
  description: string,
): Promise<WPQTResponse<PipelineFromServer>> {
  return apiFetch({
    path: `/wpqt/v1/pipelines`,
    method: "POST",
    data: { name, description },
    headers: getCommonHeaders(),
  });
}

function editPipelineRequest(
  pipeline: Pipeline,
): Promise<WPQTResponse<PipelineFromServer>> {
  return apiFetch({
    path: `/wpqt/v1/pipelines/${pipeline.id}`,
    method: "PATCH",
    data: {
      name: pipeline.name,
      description: pipeline.description,
      is_primary: pipeline.is_primary,
    },
    headers: getCommonHeaders(),
  });
}

function setPipelinePrimaryRequest(pipelineId: string): Promise<WPQTResponse> {
  return apiFetch({
    path: `/wpqt/v1/pipelines/${pipelineId}/set-primary`,
    method: "PATCH",
    headers: getCommonHeaders(),
  });
}

function deletePipelineRequest(
  pipelineId: string,
): Promise<WPQTResponse<DeletePipelineResponse>> {
  return apiFetch({
    path: `/wpqt/v1/pipelines/${pipelineId}`,
    method: "DELETE",
    headers: getCommonHeaders(),
  });
}

/*
  ==================================================================================================================================================================================================================
  Task requests
  ==================================================================================================================================================================================================================
*/

function moveTaskRequest(
  taskId: string,
  stageId: string,
  order: number,
): Promise<WPQTResponse> {
  return apiFetch({
    path: `/wpqt/v1/tasks/${taskId}/move`,
    method: "PATCH",
    data: { stageId, order },
    headers: getCommonHeaders(),
  });
}

function createTaskRequest(
  stageId: string,
  pipelineId: string,
  name: string,
): Promise<WPQTResponse<TaskFromServer>> {
  return apiFetch({
    path: `/wpqt/v1/tasks`,
    method: "POST",
    data: {
      stageId,
      name,
      pipelineId,
    },
    headers: getCommonHeaders(),
  });
}

function editTaskRequest(task: Task): Promise<WPQTResponse<TaskFromServer>> {
  return apiFetch({
    path: `/wpqt/v1/tasks/${task.id}`,
    method: "PATCH",
    data: {
      id: task.id,
      name: task.name,
      description: task.description,
      freeForAll: task.free_for_all,
    },
    headers: getCommonHeaders(),
  });
}

function deleteTaskRequest(taskId: string): Promise<WPQTResponse> {
  return apiFetch({
    path: `/wpqt/v1/tasks/${taskId}`,
    method: "DELETE",
    headers: getCommonHeaders(),
  });
}

function archiveTaskRequest(taskId: string): Promise<WPQTResponse> {
  return apiFetch({
    path: `/wpqt/v1/tasks/${taskId}/archive`,
    method: "PATCH",
    headers: getCommonHeaders(),
  });
}

function restoreArchivedTaskRequest(taskId: string): Promise<WPQTResponse> {
  return apiFetch({
    path: `/wpqt/v1/tasks/${taskId}/archive-restore`,
    method: "PATCH",
    headers: getCommonHeaders(),
  });
}

function getArchivedTasksRequest(): Promise<WPQTResponse<TaskFromServer[]>> {
  return apiFetch({
    path: `/wpqt/v1/tasks/archived`,
    method: "GET",
    headers: getCommonHeaders(),
  });
}

function markTaskDoneRequest(
  taskId: string,
  done: boolean,
): Promise<WPQTResponse> {
  return apiFetch({
    path: `/wpqt/v1/tasks/${taskId}/done`,
    method: "PATCH",
    data: { done },
    headers: getCommonHeaders(),
  });
}

/*
  ==================================================================================================================================================================================================================
  Comment requests
  ==================================================================================================================================================================================================================
*/

function getComments(
  typeId: string,
  type: string,
  isPrivate: boolean,
): Promise<WPQTResponse<WPQTCommentFromServer[]>> {
  const queryParams = new URLSearchParams({
    typeId,
    type,
    isPrivate: isPrivate.toString(),
  }).toString();
  return apiFetch({
    path: `/wpqt/v1/comments?${queryParams}`,
    method: "GET",
    headers: getCommonHeaders(),
  });
}

function addCommentRequest(
  typeId: string,
  type: string,
  isPrivate: boolean,
  comment: string,
): Promise<WPQTResponse<WPQTCommentFromServer>> {
  return apiFetch({
    path: `/wpqt/v1/comments`,
    data: { comment, typeId, type, isPrivate },
    method: "POST",
    headers: getCommonHeaders(),
  });
}

/*
  ==================================================================================================================================================================================================================
  Logs requests
  ==================================================================================================================================================================================================================
*/

function getTaskLogs(taskId: string): Promise<WPQTResponse<LogFromServer[]>> {
  return apiFetch({
    path: `/wpqt/v1/tasks/${taskId}/logs`,
    headers: getCommonHeaders(),
  });
}

function getLogsRequest(
  typeId: string,
  type: WPQTTypes,
): Promise<WPQTResponse<LogFromServer[]>> {
  const queryParams = new URLSearchParams({
    typeId,
    type,
  });
  return apiFetch({
    path: `/wpqt/v1/logs?${queryParams.toString()}`,
    method: "GET",
    headers: getCommonHeaders(),
  });
}

function getGlobalLogsRequest(
  logsFilter: ServerLogsFilterType,
): Promise<WPQTResponse<LogFromServer[]>> {
  const queryParams = new URLSearchParams(
    Object.entries(logsFilter).reduce(
      (acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      },
      {} as Record<string, string>,
    ),
  );

  return apiFetch({
    path: `/wpqt/v1/global-logs?${queryParams.toString()}`,
    method: "GET",
    headers: getCommonHeaders(),
  });
}

/*
  ==================================================================================================================================================================================================================
  Stage requests
  ==================================================================================================================================================================================================================
*/

function createNewStageRequest(
  pipelineId: string,
  name: string,
  description: string,
): Promise<WPQTResponse<StageFromServer>> {
  return apiFetch({
    path: `/wpqt/v1/stages`,
    method: "POST",
    data: { pipelineId, name, description },
    headers: getCommonHeaders(),
  });
}

function editStageRequest(
  stage: Stage,
): Promise<WPQTResponse<StageFromServer>> {
  return apiFetch({
    path: `/wpqt/v1/stages/${stage.id}`,
    method: "PATCH",
    data: { name: stage.name, description: stage.description },
    headers: getCommonHeaders(),
  });
}

function moveStageRequest(
  stageId: string,
  direction: StageChangeDirection,
): Promise<WPQTResponse<StageFromServer>> {
  return apiFetch({
    path: `/wpqt/v1/stages/${stageId}/move`,
    method: "PATCH",
    data: { direction },
    headers: getCommonHeaders(),
  });
}

function deleteStageRequest(stageId: string): Promise<WPQTResponse> {
  return apiFetch({
    path: `/wpqt/v1/stages/${stageId}`,
    method: "DELETE",
    data: { stageId },
    headers: getCommonHeaders(),
  });
}

function archiveStageTasksRequest(stageId: string): Promise<WPQTResponse> {
  return apiFetch({
    path: `/wpqt/v1/stages/${stageId}/archive-tasks`,
    method: "PATCH",
    headers: getCommonHeaders(),
  });
}

/*
  ==================================================================================================================================================================================================================
  User requests
  ==================================================================================================================================================================================================================
*/

function getUsersRequest(): Promise<WPQTResponse<ServerUser[]>> {
  return apiFetch({
    path: `/wpqt/v1/users`,
    method: "GET",
    headers: getCommonHeaders(),
  });
}

function getExtendedUserRequest(
  userId: string,
): Promise<WPQTResponse<ServerExtendedUser>> {
  return apiFetch({
    path: `/wpqt/v1/users/${userId}/extended`,
    method: "GET",
    headers: getCommonHeaders(),
  });
}

function createUserRequest(
  name: string,
  description: string,
): Promise<WPQTResponse<ServerUser>> {
  return apiFetch({
    path: `/wpqt/v1/users`,
    method: "POST",
    data: { name, description },
    headers: getCommonHeaders(),
  });
}

function editUserRequest(user: User): Promise<WPQTResponse<ServerUser>> {
  return apiFetch({
    path: `/wpqt/v1/users/${user.id}`,
    method: "PATCH",
    data: { user },
    headers: getCommonHeaders(),
  });
}

function changeUserStatusRequest(
  userId: string,
  status: boolean,
): Promise<WPQTResponse<ServerUser>> {
  return apiFetch({
    path: `/wpqt/v1/users/${userId}/status`,
    method: "PATCH",
    data: { status },
    headers: getCommonHeaders(),
  });
}

function assignTaskToUserRequest(
  userId: string,
  taskId: string,
): Promise<WPQTResponse> {
  return apiFetch({
    path: `/wpqt/v1/users/${userId}/tasks`,
    method: "POST",
    data: { task_id: taskId },
    headers: getCommonHeaders(),
  });
}

function removeTaskFromUserRequest(
  userId: string,
  taskId: string,
): Promise<WPQTResponse> {
  return apiFetch({
    path: `/wpqt/v1/users/${userId}/tasks`,
    method: "DELETE",
    data: { task_id: taskId },
    headers: getCommonHeaders(),
  });
}

function deleteUserRequest(userId: string): Promise<WPQTResponse> {
  return apiFetch({
    path: `/wpqt/v1/users/${userId}`,
    method: "DELETE",
    headers: getCommonHeaders(),
  });
}

function getUserTasksRequest(
  userId: string,
): Promise<WPQTResponse<TaskFromServer[]>> {
  return apiFetch({
    path: `/wpqt/v1/users/${userId}/tasks`,
    method: "GET",
    headers: getCommonHeaders(),
  });
}

function resetUserPasswordRequest(userId: string): Promise<WPQTResponse> {
  return apiFetch({
    path: `/wpqt/v1/users/${userId}/password-reset`,
    method: "PATCH",
    headers: getCommonHeaders(),
  });
}

/*
  ==================================================================================================================================================================================================================
  User session requests
  ==================================================================================================================================================================================================================
*/

function getUserSessionsRequest(): Promise<WPQTResponse<ServerUserSession[]>> {
  return apiFetch({
    path: `/wpqt/v1/users/sessions`,
    method: "GET",
    headers: getCommonHeaders(),
  });
}

function changeUserSessionStatusRequest(
  sessionId: string,
  status: boolean,
): Promise<WPQTResponse> {
  return apiFetch({
    path: `/wpqt/v1/users/sessions/${sessionId}/status`,
    method: "PATCH",
    data: { status },
    headers: getCommonHeaders(),
  });
}

function deleteUserSessionRequest(sessionId: string): Promise<WPQTResponse> {
  return apiFetch({
    path: `/wpqt/v1/users/sessions/${sessionId}`,
    method: "DELETE",
    headers: getCommonHeaders(),
  });
}

/*
  ==================================================================================================================================================================================================================
  Custom Field requests
  ==================================================================================================================================================================================================================
*/

function getCustomFieldsRequest(
  entityId: string,
  entityType: CustomFieldEntityType,
): Promise<WPQTResponse<CustomField[]>> {
  const queryParams = new URLSearchParams({
    entityId,
    entityType,
  });

  return apiFetch({
    path: `/wpqt/v1/custom-fields?${queryParams.toString()}`,
    method: "GET",
    headers: getCommonHeaders(),
  });
}

function addCustomFieldRequest(
  entityId: string,
  entityType: CustomFieldEntityType,
  type: string,
  name: string,
  description: string,
): Promise<WPQTResponse<CustomField>> {
  return apiFetch({
    path: `/wpqt/v1/custom-fields`,
    method: "POST",
    data: { entityId, entityType, type, name, description },
    headers: getCommonHeaders(),
  });
}

function markCustomFieldAsDeletedRequest(
  customFieldId: string,
): Promise<WPQTResponse> {
  return apiFetch({
    path: `/wpqt/v1/custom-fields/${customFieldId}`,
    method: "DELETE",
    headers: getCommonHeaders(),
  });
}

function updateCustomFieldValueRequest(
  customFieldId: string,
  value: string,
  entityId: string,
  entityType: "user" | "task",
): Promise<WPQTResponse> {
  return apiFetch({
    path: `/wpqt/v1/custom-fields/${customFieldId}/value`,
    method: "PATCH",
    data: { value, entityId: String(entityId), entityType },
    headers: getCommonHeaders(),
  });
}
export {
  addCommentRequest,
  addCustomFieldRequest,
  archiveStageTasksRequest,
  archiveTaskRequest,
  assignTaskToUserRequest,
  changeUserSessionStatusRequest,
  changeUserStatusRequest,
  createNewStageRequest,
  createPipelineRequest,
  createTaskRequest,
  createUserRequest,
  deletePipelineRequest,
  deleteStageRequest,
  deleteTaskRequest,
  deleteUserRequest,
  deleteUserSessionRequest,
  editPipelineRequest,
  editStageRequest,
  editTaskRequest,
  editUserRequest,
  getArchivedTasksRequest,
  getComments,
  getCustomFieldsRequest,
  getExtendedUserRequest,
  getGlobalLogsRequest,
  getLogsRequest,
  getPipelineData,
  getTaskLogs,
  getUserSessionsRequest,
  getUsersRequest,
  getUserTasksRequest,
  markCustomFieldAsDeletedRequest,
  markTaskDoneRequest,
  moveStageRequest,
  moveTaskRequest,
  removeTaskFromUserRequest,
  resetUserPasswordRequest,
  restoreArchivedTaskRequest,
  setPipelinePrimaryRequest,
  updateCustomFieldValueRequest,
};
