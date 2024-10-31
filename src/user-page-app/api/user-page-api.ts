import apiFetch from "@wordpress/api-fetch";
import { WPQTCommentFromServer } from "../../types/comment";
import { CustomFieldEntityType } from "../../types/custom-field";
import { WPQTResponse } from "../../types/response";
import { TaskFromServer } from "../../types/task";
import { UserPageOverview } from "../types/user-page-overview";
import { ServerUserPageStatus } from "../types/user-page-status";
import { UserPageTaskResponse } from "../types/user-page-task-response";
import { UserPageUserResponse } from "../types/user-page-user-response";
import { UserSession } from "../types/user-session";

function getCommonHeaders() {
  return {
    "Content-Type": "application/json",
    "X-WPQT-USER-API-Nonce": window.wpqt_user.userApiNonce,
  };
}

function getUserPageStatusRequest(
  pageHash: string,
): Promise<WPQTResponse<ServerUserPageStatus>> {
  return apiFetch({
    path: `/wpqt/v1/user-pages/${pageHash}/status`,
    method: "GET",
    headers: getCommonHeaders(),
  });
}

function setUpUserPageRequest(
  pageHash: string,
  data: { password: string },
): Promise<WPQTResponse> {
  return apiFetch({
    path: `/wpqt/v1/user-pages/${pageHash}/setup`,
    data,
    method: "POST",
    headers: getCommonHeaders(),
  });
}

function logInUserPageRequest(
  pageHash: string,
  password: string,
): Promise<WPQTResponse<UserSession>> {
  return apiFetch({
    path: `/wpqt/v1/user-pages/${pageHash}/login`,
    method: "POST",
    data: { password },
    headers: getCommonHeaders(),
  });
}

function getOverviewRequest(
  pageHash: string,
): Promise<WPQTResponse<UserPageOverview>> {
  return apiFetch({
    method: "GET",
    path: `/wpqt/v1/user-pages/${pageHash}/overview`,
    headers: getCommonHeaders(),
  });
}

function getAssignedTasksRequest(
  pageHash: string,
): Promise<WPQTResponse<TaskFromServer[]>> {
  return apiFetch({
    method: "GET",
    path: `/wpqt/v1/user-pages/${pageHash}/assigned-tasks`,
    headers: getCommonHeaders(),
  });
}

function getAssignableTasksRequest(
  pageHash: string,
): Promise<WPQTResponse<TaskFromServer[]>> {
  return apiFetch({
    method: "GET",
    path: `/wpqt/v1/user-pages/${pageHash}/assignable-tasks`,
    headers: getCommonHeaders(),
  });
}

function getTaskDataRequest(
  pageHash: string,
  taskHash: string,
): Promise<WPQTResponse<UserPageTaskResponse>> {
  return apiFetch({
    method: "GET",
    path: `/wpqt/v1/user-pages/${pageHash}/tasks/${taskHash}`,
    headers: getCommonHeaders(),
  });
}

function assignTaskToUser(
  pageHash: string,
  taskHash: string,
): Promise<WPQTResponse<TaskFromServer>> {
  return apiFetch({
    method: "POST",
    path: `/wpqt/v1/user-pages/${pageHash}/tasks/${taskHash}/users`,
    headers: getCommonHeaders(),
  });
}

function unAssignTaskFromUser(
  pageHash: string,
  taskHash: string,
): Promise<WPQTResponse<TaskFromServer>> {
  return apiFetch({
    method: "DELETE",
    path: `/wpqt/v1/user-pages/${pageHash}/tasks/${taskHash}/users`,
    headers: getCommonHeaders(),
  });
}

function changeTaskStageRequest(
  pageHash: string,
  taskHash: string,
  stageId: string,
): Promise<WPQTResponse> {
  return apiFetch({
    method: "PATCH",
    path: `/wpqt/v1/user-pages/${pageHash}/tasks/${taskHash}/stage`,
    data: { stageId },
    headers: getCommonHeaders(),
  });
}

function changeTaskDoneStatusRequest(
  pageHash: string,
  taskHash: string,
  isDone: boolean,
): Promise<WPQTResponse> {
  return apiFetch({
    method: "PATCH",
    path: `/wpqt/v1/user-pages/${pageHash}/tasks/${taskHash}/done`,
    data: { done: isDone },
    headers: getCommonHeaders(),
  });
}

function logoutUserPageRequest(pageHash: string): Promise<WPQTResponse> {
  return apiFetch({
    method: "POST",
    path: `/wpqt/v1/user-pages/${pageHash}/logout`,
    headers: getCommonHeaders(),
  });
}

function getTaskCommentsRequest(
  pageHash: string,
  taskHash: string,
): Promise<WPQTResponse<WPQTCommentFromServer[]>> {
  return apiFetch({
    method: "GET",
    path: `/wpqt/v1/user-pages/${pageHash}/tasks/${taskHash}/comments`,
    headers: getCommonHeaders(),
  });
}

function addTaskCommentRequest(
  pageHash: string,
  taskHash: string,
  comment: string,
): Promise<WPQTResponse<WPQTCommentFromServer[]>> {
  return apiFetch({
    method: "POST",
    path: `/wpqt/v1/user-pages/${pageHash}/tasks/${taskHash}/comments`,
    data: { comment },
    headers: getCommonHeaders(),
  });
}

function getUserCommentsRequest(
  pageHash: string,
): Promise<WPQTResponse<WPQTCommentFromServer[]>> {
  return apiFetch({
    method: "GET",
    path: `/wpqt/v1/user-pages/${pageHash}/user/comments`,
    headers: getCommonHeaders(),
  });
}

function addUserCommentRequest(
  pageHash: string,
  comment: string,
): Promise<WPQTResponse<WPQTCommentFromServer[]>> {
  return apiFetch({
    method: "POST",
    path: `/wpqt/v1/user-pages/${pageHash}/user/comments`,
    data: { comment },
    headers: getCommonHeaders(),
  });
}

function getUserPageCommentsRequest(
  pageHash: string,
): Promise<WPQTResponse<WPQTCommentFromServer[]>> {
  return apiFetch({
    method: "GET",
    path: `/wpqt/v1/user-pages/${pageHash}/comments`,
    headers: getCommonHeaders(),
  });
}

function getUserPageUserDataRequest(
  pageHash: string,
): Promise<WPQTResponse<UserPageUserResponse>> {
  return apiFetch({
    method: "GET",
    path: `/wpqt/v1/user-pages/${pageHash}/user`,
    headers: getCommonHeaders(),
  });
}

/*
  ==================================================================================================================================================================================================================
  Custom Field requests
  ==================================================================================================================================================================================================================
*/

function updateCustomFieldValueRequest(
  pageHash: string,
  entityId: string,
  entityType: CustomFieldEntityType.Task | CustomFieldEntityType.User,
  customFieldId: string,
  value: string,
): Promise<WPQTResponse> {
  return apiFetch({
    method: "PATCH",
    path: `/wpqt/v1/user-pages/${pageHash}/custom-fields/${customFieldId}`,
    data: { entityId, entityType, customFieldId, value },
    headers: getCommonHeaders(),
  });
}

export {
  addTaskCommentRequest,
  addUserCommentRequest,
  assignTaskToUser,
  changeTaskDoneStatusRequest,
  changeTaskStageRequest,
  getAssignableTasksRequest,
  getAssignedTasksRequest,
  getOverviewRequest,
  getTaskCommentsRequest,
  getTaskDataRequest,
  getUserCommentsRequest,
  getUserPageCommentsRequest,
  getUserPageStatusRequest,
  getUserPageUserDataRequest,
  logInUserPageRequest,
  logoutUserPageRequest,
  setUpUserPageRequest,
  unAssignTaskFromUser,
  updateCustomFieldValueRequest,
};
