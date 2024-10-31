import {
  ArchiveBoxIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog8ToothIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useContext } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { TfiSave } from "react-icons/tfi";
import { toast } from "react-toastify";
import {
  archiveStageTasksRequest,
  deleteStageRequest,
  moveStageRequest,
} from "../../../api/api";
import {
  OPEN_STAGE_EDIT_MODAL,
  PIPELINE_DELETE_STAGE,
} from "../../../constants";
import { ActivePipelineContext } from "../../../providers/ActivePipelineContextProvider";
import { AppContext } from "../../../providers/AppContextProvider";
import { ModalContext } from "../../../providers/ModalContextProvider";
import { Stage, StageChangeDirection } from "../../../types/stage";
import {
  WPQTDropdown,
  WPQTDropdownIcon,
  WPQTDropdownItem,
} from "../WPQTDropdown";

type Props = {
  stage: Stage;
};

function StageControlsDropdown({ stage }: Props) {
  const {
    dispatch,
    state: { activePipeline },
    fetchAndSetPipelineData,
  } = useContext(ActivePipelineContext);
  const { modalDispatch } = useContext(ModalContext);
  const {
    state: { isUserAllowedToDelete },
  } = useContext(AppContext);
  const stagesLength = activePipeline?.stages?.length ?? 0;
  const stageTasksLenght = stage.tasks?.length ?? 0;
  const stageOrder = +stage.stage_order;
  const showMoveLeft = stageOrder > 0 && stageOrder < stagesLength;
  const showMoveRight = stageOrder !== stagesLength - 1;

  const deleteStage = async () => {
    try {
      await deleteStageRequest(stage.id);

      dispatch({ type: PIPELINE_DELETE_STAGE, payload: stage.id });
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to delete a stage", "quicktasker"));
    }
  };

  const openStageEditModal = () => {
    modalDispatch({
      type: OPEN_STAGE_EDIT_MODAL,
      payload: {
        stageToEdit: stage,
      },
    });
  };

  const moveStage = async (direction: StageChangeDirection) => {
    try {
      await moveStageRequest(stage.id, direction);
      fetchAndSetPipelineData(activePipeline!.id);
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to move a stage", "quicktasker"));
    }
  };

  const archiveAllStageTasks = async () => {
    try {
      await archiveStageTasksRequest(stage.id);
      fetchAndSetPipelineData(activePipeline!.id);
      toast.success(
        sprintf(__("Archived all %s tasks", "quicktasker"), stage.name),
      );
    } catch (error) {
      console.error(error);
      toast.error(
        sprintf(
          __("Failed to archive stage %s tasks", "quicktasker"),
          stage.name,
        ),
      );
    }
  };

  return (
    <WPQTDropdown
      menuBtn={({ active }) => (
        <WPQTDropdownIcon isActive={active} IconComponent={Cog8ToothIcon} />
      )}
    >
      {showMoveLeft && (
        <WPQTDropdownItem
          text={__("Move left", "quicktasker")}
          icon={<ChevronLeftIcon className="wpqt-icon-blue wpqt-size-4" />}
          onClick={() => moveStage("left")}
        />
      )}

      {showMoveRight && (
        <WPQTDropdownItem
          text={__("Move right", "quicktasker")}
          icon={<ChevronRightIcon className="wpqt-icon-blue wpqt-size-4" />}
          onClick={() => moveStage("right")}
        />
      )}
      <WPQTDropdownItem
        text={__("Edit stage", "quicktasker")}
        icon={<TfiSave className="wpqt-icon-blue wpqt-size-3" />}
        onClick={openStageEditModal}
      />
      <WPQTDropdownItem
        text={__("Archive all stage tasks", "quicktasker")}
        icon={<ArchiveBoxIcon className="wpqt-icon-blue wpqt-size-4" />}
        onClick={archiveAllStageTasks}
        disabled={stageTasksLenght === 0}
        id={`item-dropdown-${stage.id}-archive`}
        tooltipText={
          stageTasksLenght === 0
            ? __("No tasks to archive on the stage", "quicktasker")
            : undefined
        }
      />

      {isUserAllowedToDelete && (
        <WPQTDropdownItem
          text={__("Delete stage", "quicktasker")}
          icon={<TrashIcon className="wpqt-icon-red wpqt-size-4" />}
          onClick={deleteStage}
          disabled={stageTasksLenght > 0}
          className="!wpqt-mb-0"
          id={`item-dropdown-${stage.id}`}
          tooltipText={__(
            "Stage can be deleted when there are no tasks on it",
            "quicktasker",
          )}
        />
      )}
    </WPQTDropdown>
  );
}

export { StageControlsDropdown };
