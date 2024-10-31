import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { OPEN_NEW_PIPELINE_MODAL } from "../../../constants";
import { ModalContext } from "../../../providers/ModalContextProvider";

function PipelineIntro() {
  const { modalDispatch } = useContext(ModalContext);

  const openPipelineModal = async () => {
    modalDispatch({
      type: OPEN_NEW_PIPELINE_MODAL,
    });
  };
  return (
    <div className="wpqt-flex wpqt-h-screen-minus-top-bar wpqt-items-center wpqt-justify-center">
      <div
        onClick={openPipelineModal}
        className="wpqt-flex wpqt-cursor-pointer wpqt-items-center wpqt-gap-2"
      >
        <PlusCircleIcon className="wpqt-icon-green wpqt-size-6 wpqt-cursor-pointer" />
        <span>{__("Add your first Board", "quicktasker")}</span>
      </div>
    </div>
  );
}

export { PipelineIntro };
