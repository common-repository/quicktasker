import { useContext } from "@wordpress/element";
import { createPipelineRequest } from "../../../../api/api";
import {
  CLOSE_PIPELINE_MODAL,
  PIPELINE_ADD_PIPELINE,
} from "../../../../constants";
import { ModalContext } from "../../../../providers/ModalContextProvider";
import { WPQTModal } from "../../WPQTModal";
import { PipelineModalContent } from "./AddPipelineModalContent";

import { DispatchType, useModal } from "../../../../hooks/useModal";
import { ActivePipelineContext } from "../../../../providers/ActivePipelineContextProvider";

function AddPipelineModal() {
  const {
    state: { newPipelineModalOpen },
  } = useContext(ModalContext);
  const { fetchAndSetPipelineData } = useContext(ActivePipelineContext);
  const {
    modalSaving,
    setModalSaving,
    modalContentRef,
    closeModal,
    handleSuccess,
    handleError,
  } = useModal(CLOSE_PIPELINE_MODAL);

  const addPipeline = async (
    pipelineName: string,
    pipelineDescription: string,
  ) => {
    try {
      setModalSaving(true);
      const response = await createPipelineRequest(
        pipelineName,
        pipelineDescription,
      );

      handleSuccess(
        PIPELINE_ADD_PIPELINE,
        response.data,
        DispatchType.PIPELINES,
      );
      fetchAndSetPipelineData(response.data.id);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <WPQTModal modalOpen={newPipelineModalOpen} closeModal={closeModal}>
      <PipelineModalContent
        ref={modalContentRef}
        addPipeline={addPipeline}
        modalSaving={modalSaving}
        setModalSaving={setModalSaving}
      />
    </WPQTModal>
  );
}

export { AddPipelineModal };
