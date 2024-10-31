import { useContext } from "@wordpress/element";
import { WPQTComment, WPQTCommentFromServer } from "../../../types/comment";
import { convertCommentFromServer } from "../../../utils/comment";
import {
  addTaskCommentRequest,
  addUserCommentRequest,
  getTaskCommentsRequest,
  getUserCommentsRequest,
} from "../../api/user-page-api";
import { UserPageAppContext } from "../../providers/UserPageAppContextProvider";
import { useErrorHandler } from "../useErrorHandler";

function useCommentActions() {
  const {
    state: { pageHash },
  } = useContext(UserPageAppContext);
  const { handleError } = useErrorHandler();

  const loadTaskComments = async (
    pageHash: string,
    taskHash: string,
    callback?: (comments: WPQTCommentFromServer[]) => void,
  ) => {
    try {
      const response = await getTaskCommentsRequest(pageHash, taskHash);
      if (callback) callback(response.data);
    } catch (error) {
      handleError(error);
    }
  };
  const addTaskComment = async (
    taskHash: string,
    comment: string,
    callback?: (comments: WPQTComment[]) => void,
  ) => {
    try {
      const response = await addTaskCommentRequest(pageHash, taskHash, comment);
      const comments = response.data.map(convertCommentFromServer);
      if (callback) callback(comments);
    } catch (error) {
      handleError(error);
    }
  };

  const loadUserComments = async (
    callback: (comments: WPQTComment[]) => void,
  ) => {
    try {
      const response = await getUserCommentsRequest(pageHash);
      const comments = response.data.map(convertCommentFromServer);
      callback(comments);
    } catch (error) {
      handleError(error);
    }
  };

  const addUserComment = async (
    commentText: string,
    callback: (comments: WPQTComment[]) => void,
  ) => {
    try {
      const response = await addUserCommentRequest(pageHash, commentText);
      const comments = response.data.map(convertCommentFromServer);
      callback(comments);
    } catch (error) {
      handleError(error);
    }
  };

  return { loadTaskComments, addTaskComment, loadUserComments, addUserComment };
}

export { useCommentActions };
