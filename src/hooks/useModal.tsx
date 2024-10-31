// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useRef, useState } from "@wordpress/element";
import { ActivePipelineContext } from "../providers/ActivePipelineContextProvider";
import { ModalContext } from "../providers/ModalContextProvider";
import { PipelinesContext } from "../providers/PipelinesContextProvider";
import { UserContext } from "../providers/UserContextProvider";

enum DispatchType {
  ACTIVE_PIPELINE = "ACTIVE_PIPELINE",
  PIPELINES = "PIPELINES",
  USER = "USER",
}

type ModalCloseActionType =
  | "CLOSE_TASK_MODAL"
  | "CLOSE_USER_MODAL"
  | "CLOSE_STAGE_MODAL"
  | "CLOSE_PIPELINE_EDIT_MODAL";

interface ModalContentRef {
  clearContent: () => void;
}

export const useModal = (closeActionType: ModalCloseActionType) => {
  const [modalSaving, setModalSaving] = useState(false);
  const modalContentRef = useRef<ModalContentRef | null>(null);
  const { modalDispatch } = useContext(ModalContext);
  const { dispatch: activePipelineDispatch } = useContext(
    ActivePipelineContext,
  );
  const { pipelinesDispatch } = useContext(PipelinesContext);
  const { userDispatch } = useContext(UserContext);

  const closeModal = () => {
    modalDispatch({
      type: closeActionType,
    });
    clearModalContent();
  };

  const clearModalContent = () => {
    if (modalContentRef.current) {
      modalContentRef.current.clearContent();
    }
  };

  const handleSuccess = (
    type: string,
    payload: any,
    dispatchType: DispatchType,
  ) => {
    let dispatchFunction;

    switch (dispatchType) {
      case DispatchType.PIPELINES: {
        dispatchFunction = pipelinesDispatch;
        break;
      }
      case DispatchType.ACTIVE_PIPELINE: {
        dispatchFunction = activePipelineDispatch;
        break;
      }
      case DispatchType.USER: {
        dispatchFunction = userDispatch;
        break;
      }
      default:
        dispatchFunction = activePipelineDispatch;
        break;
    }

    setModalSaving(false);
    dispatchFunction({
      type,
      payload,
    });
    closeModal();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (error: any) => {
    setModalSaving(false);
    console.error(error);
  };

  return {
    modalSaving,
    setModalSaving,
    modalContentRef,
    closeModal,
    handleSuccess,
    handleError,
  };
};

export { DispatchType };
