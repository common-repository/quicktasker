import { __ } from "@wordpress/i18n";
import { toast } from "react-toastify";
import { addCommentRequest, getComments } from "../../../../api/api";
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

function PrivateCommentsTabContent({ userId }: Props) {
  const addComment = async (newEntry: string) => {
    try {
      const response = await addCommentRequest(
        userId,
        WPQTTypes.User,
        true,
        newEntry,
      );

      return convertCommentFromServer(response.data);
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to add private comment", "quicktasker"));
    }
  };

  const fetchPrivateComments = async () => {
    try {
      const response = await getComments(userId, WPQTTypes.User, true);

      return response.data.map(convertCommentFromServer);
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to load private comments", "quicktasker"));
    }
  };

  return (
    <CommentsAndLogsTabContent<WPQTComment>
      typeId={userId}
      fetchData={fetchPrivateComments}
      onAdd={addComment}
      renderItem={(comment: WPQTComment) => (
        <TabContentCommentItem item={comment} />
      )}
      noDataMessage={__("No comments available", "quicktasker")}
      explanation={__(
        "Comments that can be added and viewed only by WordPress users (with required permissions).",
        "quicktasker",
      )}
      enableAdd={true}
    />
  );
}

export { PrivateCommentsTabContent };
