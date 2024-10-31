import { MenuItem } from "@headlessui/react";
import {
  PlusCircleIcon,
  StarIcon as StarIconOutline,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon, StarIcon } from "@heroicons/react/24/solid";
import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { clsx } from "clsx";
import { toast } from "react-toastify";
import { setPipelinePrimaryRequest } from "../../../api/api";
import {
  OPEN_NEW_PIPELINE_MODAL,
  PIPELINE_SET_PRIMARY,
} from "../../../constants";
import { ActivePipelineContext } from "../../../providers/ActivePipelineContextProvider";
import { ModalContext } from "../../../providers/ModalContextProvider";
import { PipelinesContext } from "../../../providers/PipelinesContextProvider";
import { Pipeline } from "../../../types/pipeline";
import { WPQTIconButton } from "../../common/Button/Button";
import { WPQTDropdown } from "../WPQTDropdown";

function PipelineSelectionDropdown() {
  const {
    state: { activePipeline },
    fetchAndSetPipelineData,
  } = useContext(ActivePipelineContext);
  const {
    state: { pipelines },
    pipelinesDispatch,
  } = useContext(PipelinesContext);
  const { modalDispatch } = useContext(ModalContext);

  const changePipelinePrimary = async (pipeline: Pipeline) => {
    try {
      await setPipelinePrimaryRequest(pipeline.id);

      pipelinesDispatch({
        type: PIPELINE_SET_PRIMARY,
        payload: pipeline.id,
      });
    } catch (e) {
      console.error(e);
      toast.error(__("Failed to set primary board", "quicktasker"));
    }
  };

  const openPipelineModal = async () => {
    modalDispatch({
      type: OPEN_NEW_PIPELINE_MODAL,
    });
  };

  return (
    <WPQTDropdown
      menuBtnClasses="wpqt-flex wpqt-cursor-pointer wpqt-items-center wpqt-gap-1 wpqt-rounded-xl wpqt-border wpqt-border-solid wpqt-border-qtBorder wpqt-p-3"
      menuBtn={({ active }) => (
        <>
          <div className="wpqt-leading-none">{activePipeline?.name}</div>
          <ChevronDownIcon
            className={`wpqt-size-4 ${active ? "wpqt-text-qtBlueHover" : ""}`}
          />
        </>
      )}
    >
      <div className="wpqt-mb-4 wpqt-text-center wpqt-font-bold">
        {__("Change board", "quicktasker")}
      </div>
      {pipelines.map((existingPipeline) => {
        const isPrimary = existingPipeline.is_primary;
        const isCurrentPipeline = activePipeline?.id === existingPipeline.id;

        return (
          <MenuItem key={existingPipeline.id}>
            <div className="wpqt-mb-3 wpqt-flex wpqt-gap-2">
              <div
                className={clsx("wpqt-cursor-pointer wpqt-text-center", {
                  "wpqt-font-bold": isCurrentPipeline,
                })}
                onClick={() => fetchAndSetPipelineData(existingPipeline.id)}
              >
                {existingPipeline.name}
              </div>
              <div className="wpqt-ml-auto">
                {isPrimary ? (
                  <StarIcon className="wpqt-size-4 wpqt-cursor-pointer wpqt-text-blue-500" />
                ) : (
                  <StarIconOutline
                    className="wpqt-size-4 wpqt-cursor-pointer wpqt-text-gray-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      changePipelinePrimary(existingPipeline);
                    }}
                  />
                )}
              </div>
            </div>
          </MenuItem>
        );
      })}
      <MenuItem key="new-pipeline">
        <div className="wpqt-mt-4 wpqt-flex wpqt-cursor-pointer wpqt-items-center wpqt-gap-2">
          <WPQTIconButton
            text={__("Add new board", "quicktasker")}
            onClick={openPipelineModal}
            icon={<PlusCircleIcon className="wpqt-size-6 wpqt-icon-green" />}
            className="wpqt-bg-white hover:!wpqt-bg-gray-100"
          />
        </div>
      </MenuItem>
    </WPQTDropdown>
  );
}

export { PipelineSelectionDropdown };
