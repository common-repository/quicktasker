import { __ } from "@wordpress/i18n";
import { toast } from "react-toastify";
import { addCommentRequest } from "../../api/api";
import { WPQTTypes } from "../../types/enums";

function useCommentActions() {
  const addComment = async (
    typeId: string,
    type: WPQTTypes,
    isPrivate: boolean,
    commentText: string,
  ) => {
    try {
      const response = await addCommentRequest(
        typeId,
        type,
        isPrivate,
        commentText,
      );
      toast.success(__("Comment added", "quicktasker"));

      return response.data;
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to add comment", "quicktasker"));
    }
  };
  return {
    addComment,
  };
}

export { useCommentActions };
