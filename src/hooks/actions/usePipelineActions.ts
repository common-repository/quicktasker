import { __ } from "@wordpress/i18n";
import { toast } from "react-toastify";
import { deletePipelineRequest } from "../../api/api";

function usePipelineActions() {
  const deletePipeline = async (
    pipelineId: string,
    callback?: (pipelineId: string, pipelineIdToLoad: string | null) => void,
  ) => {
    try {
      const response = await deletePipelineRequest(pipelineId);
      if (callback)
        callback(
          response.data.deletedPipelineId,
          response.data.pipelineIdToLoad,
        );
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to delete board", "quicktasker"));
    }
  };
  return {
    deletePipeline,
  };
}

export { usePipelineActions };
