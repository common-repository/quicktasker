import { WPQTComment, WPQTCommentFromServer } from "../types/comment";

const convertCommentFromServer = (
  comment: WPQTCommentFromServer,
): WPQTComment => ({
  ...comment,
  is_admin_comment: comment.is_admin_comment === "1",
});

const filterNewComments = (
  comments: WPQTComment[],
  storedComments: WPQTComment[],
) => {
  return comments.filter(
    (comment) => !storedComments.find((c) => c.id === comment.id),
  );
};

export { convertCommentFromServer, filterNewComments };
