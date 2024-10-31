import { ArrowPathIcon, Cog8ToothIcon } from "@heroicons/react/24/outline";
import { useContext } from "@wordpress/element";
import { PipelineSelectionDropdown } from "../../../../components/Dropdown/PipelineSelectionDropdown/PipelineSelectionDropdown";
import { LoadingOval } from "../../../../components/Loading/Loading";
import { OPEN_EDIT_PIPELINE_MODAL } from "../../../../constants";
import { ActivePipelineContext } from "../../../../providers/ActivePipelineContextProvider";
import { ModalContext } from "../../../../providers/ModalContextProvider";

function PipelineHeader() {
  const {
    state: { activePipeline, loading },
    fetchAndSetPipelineData,
  } = useContext(ActivePipelineContext);
  const { modalDispatch } = useContext(ModalContext);

  const openEditPipelineModal = () => {
    if (!activePipeline) {
      return;
    }
    modalDispatch({
      type: OPEN_EDIT_PIPELINE_MODAL,
      payload: {
        pipelineToEdit: activePipeline,
      },
    });
  };

  if (!activePipeline) {
    return null;
  }

  return (
    <div className="wpqt-flex wpqt-items-center wpqt-gap-2 wpqt-py-5">
      <div>
        <div className="wpqt-flex wpqt-items-center wpqt-gap-2">
          <div className="wpqt-text-lg">{activePipeline.name}</div>
          <Cog8ToothIcon
            className="wpqt-icon-gray wpqt-size-6 wpqt-cursor-pointer hover:wpqt-text-qtBlueHover"
            onClick={openEditPipelineModal}
          />
        </div>
        {activePipeline.description && (
          <div className="wpqt-italic">{activePipeline.description}</div>
        )}
      </div>

      <div className="wpqt-ml-auto wpqt-flex wpqt-items-center wpqt-gap-3">
        {loading ? (
          <LoadingOval width="24" height="24" />
        ) : (
          <ArrowPathIcon
            className="wpqt-size-6 wpqt-cursor-pointer hover:wpqt-text-qtBlueHover"
            onClick={() => fetchAndSetPipelineData(activePipeline.id)}
          />
        )}

        <PipelineSelectionDropdown />
      </div>
    </div>
  );
}

export { PipelineHeader };
