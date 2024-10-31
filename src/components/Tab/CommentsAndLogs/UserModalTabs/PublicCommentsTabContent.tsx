import { __ } from "@wordpress/i18n";
import { toast } from "react-toastify";
import { getComments } from "../../../../api/api";
import { useCommentActions } from "../../../../hooks/actions/useCommentActions";
import { WPQTComment } from "../../../../types/comment";
import { WPQTTypes } from "../../../../types/enums";
import { convertCommentFromServer } from "../../../../utils/comment";
import {
  CommentsAndLogsTabContent,
  TabContentCommentItem,
} from "../CommentsAndLogsTabContent";

type Props = {
  userId: string;
};

function PublicCommentsTabContent({ userId }: Props) {
  const { addComment } = useCommentActions();

  const onAddComment = async (newEntry: string) => {
    const connemntFromServer = await addComment(
      userId,
      WPQTTypes.User,
      false,
      newEntry,
    );

    if (connemntFromServer) {
      return convertCommentFromServer(connemntFromServer);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getComments(userId, WPQTTypes.User, false);

      return response.data.map(convertCommentFromServer);
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to load comments", "quicktasker"));
    }
  };

  return (
    <CommentsAndLogsTabContent<WPQTComment>
      typeId={userId}
      fetchData={fetchComments}
      onAdd={onAddComment}
      renderItem={(comment: WPQTComment) => (
        <TabContentCommentItem item={comment} />
      )}
      noDataMessage={__("No comments available", "quicktasker")}
      explanation={__(
        "Comments that can be added and viewed by WordPress users (with required permissions) and current QuickTasker user (in user page).",
        "quicktasker",
      )}
      enableAdd={true}
    />
  );
}

export { PublicCommentsTabContent };
