import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { OPEN_NEW_STAGE_MODAL } from "../../../constants";
import { ModalContext } from "../../../providers/ModalContextProvider";

type Props = { pipelineId: string; stagesLength: number | undefined };

function AddStage({ pipelineId, stagesLength = 0 }: Props) {
  const { modalDispatch } = useContext(ModalContext);

  const openNewStageModal = async () => {
    modalDispatch({
      type: OPEN_NEW_STAGE_MODAL,
      payload: {
        targetPipelineId: pipelineId,
      },
    });
  };

  if (stagesLength === 0) {
    return (
      <div className="wpqt-pipeline-height wpqt-flex wpqt-w-full wpqt-items-center wpqt-justify-center">
        <div
          className="wpqt-main-border wpqt-flex wpqt-cursor-pointer wpqt-flex-col wpqt-items-center wpqt-justify-start wpqt-gap-y-1 wpqt-p-3 hover:wpqt-bg-gray-100"
          onClick={openNewStageModal}
        >
          <PlusCircleIcon className="wpqt-size-6 wpqt-text-green-600" />
          <div className="wpqt-whitespace-nowrap">
            {__("Add first stage", "quicktasker")}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="wpqt-main-border wpqt-mb-3 wpqt-flex wpqt-cursor-pointer wpqt-flex-col wpqt-items-center wpqt-justify-start wpqt-self-start wpqt-p-3 hover:wpqt-bg-gray-100"
      onClick={openNewStageModal}
    >
      <PlusCircleIcon className="wpqt-size-6 wpqt-text-green-600" />
      <div className="wpqt-whitespace-nowrap">
        {__("Add stage", "quicktasker")}
      </div>
    </div>
  );
}

export { AddStage };
