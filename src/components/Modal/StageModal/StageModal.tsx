import { useContext } from "@wordpress/element";
import { createNewStageRequest, editStageRequest } from "../../../api/api";
import {
  CLOSE_STAGE_MODAL,
  PIPELINE_ADD_STAGE,
  PIPELINE_EDIT_STAGE,
} from "../../../constants";
import { DispatchType, useModal } from "../../../hooks/useModal";
import { ModalContext } from "../../../providers/ModalContextProvider";
import { Stage } from "../../../types/stage";
import { WPQTModal } from "../WPQTModal";
import { StageModalContent } from "./StageModalContent";

function StageModal() {
  const {
    state: { stageModalOpen, targetPipelineId },
  } = useContext(ModalContext);
  const {
    modalSaving,
    setModalSaving,
    modalContentRef,
    closeModal,
    handleSuccess,
    handleError,
  } = useModal(CLOSE_STAGE_MODAL);

  const addStage = async (stageName: string, stageDescription: string) => {
    try {
      setModalSaving(true);
      const response = await createNewStageRequest(
        targetPipelineId,
        stageName,
        stageDescription,
      );

      handleSuccess(
        PIPELINE_ADD_STAGE,
        {
          ...response.data,
          tasks: [],
        },
        DispatchType.ACTIVE_PIPELINE,
      );
    } catch (error) {
      handleError(error);
    }
  };

  const editStage = async (stage: Stage) => {
    try {
      setModalSaving(true);
      const response = await editStageRequest(stage);

      handleSuccess(
        PIPELINE_EDIT_STAGE,
        response.data,
        DispatchType.ACTIVE_PIPELINE,
      );
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <WPQTModal modalOpen={stageModalOpen} closeModal={closeModal}>
      <StageModalContent
        ref={modalContentRef}
        editStage={editStage}
        addStage={addStage}
        stageModalSaving={modalSaving}
        stageTaskModalSaving={setModalSaving}
      />
    </WPQTModal>
  );
}

export { StageModal };
