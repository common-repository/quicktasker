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
  taskId: string;
};

function CommentsTabContent({ taskId }: Props) {
  const { addComment } = useCommentActions();

  const onAddComment = async (newEntry: string) => {
    const response = await addComment(taskId, WPQTTypes.Task, true, newEntry);

    if (response) {
      return convertCommentFromServer(response);
    }
  };

  const fetchPrivateComments = async () => {
    try {
      const response = await getComments(taskId, WPQTTypes.Task, true);

      return response.data.map(convertCommentFromServer);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load comments");
    }
  };

  return (
    <CommentsAndLogsTabContent<WPQTComment>
      typeId={taskId}
      fetchData={fetchPrivateComments}
      onAdd={onAddComment}
      renderItem={(comment: WPQTComment) => (
        <TabContentCommentItem item={comment} />
      )}
      noDataMessage="No comments available"
      explanation="Comments that can be added and viewed only by WordPress users (with required permissions)."
      enableAdd={true}
    />
  );
}

export { CommentsTabContent };
