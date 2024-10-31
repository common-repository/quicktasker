import { Field, Label, Radio, RadioGroup } from "@headlessui/react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { WPQTIconButton } from "../../../../components/common/Button/Button";
import { LoadingOval } from "../../../../components/Loading/Loading";
import { WPQTModal } from "../../../../components/Modal/WPQTModal";
import { Stage } from "../../../../types/stage";
import { Task } from "../../../../types/task";
import { UPDATE_USER_PAGE_TASK_STAGE } from "../../../constants";
import { useTaskActions } from "../../../hooks/actions/useTaskActions";
import { UserPageTaskContext } from "../../../providers/UserPageTaskContextProvider";

type Props = {
  task: Task;
  stages: Stage[];
  pageHash: string;
  open: boolean;
  onClose: () => void;
};

function StageSelectionModal({ task, stages, pageHash, open, onClose }: Props) {
  const { userTaskDispatch } = useContext(UserPageTaskContext);
  const [selectedStageId, setSelectedStageId] = useState(task.stage_id);
  const [loading, setLoading] = useState(false);
  const { changeTaskStage } = useTaskActions();

  const onSave = async () => {
    setLoading(true);
    await changeTaskStage(task.task_hash, selectedStageId, pageHash, () => {
      userTaskDispatch({
        type: UPDATE_USER_PAGE_TASK_STAGE,
        payload: selectedStageId,
      });
    });
    setLoading(false);
    onClose();
  };

  return (
    <WPQTModal modalOpen={open} closeModal={onClose} size="sm">
      <h3 className="wpqt-text-center">
        {__("Task stage selection", "quicktasker")}
      </h3>
      <RadioGroup
        value={selectedStageId}
        onChange={setSelectedStageId}
        className="wpqt-flex wpqt-flex-col wpqt-items-center wpqt-gap-5"
      >
        {stages.map((stage) => (
          <Field
            key={stage.id}
            className="wpqt-flex wpqt-items-center wpqt-gap-2"
          >
            <Radio
              value={stage.id}
              className="wpqt-group wpqt-flex wpqt-size-5 wpqt-items-center wpqt-justify-center wpqt-rounded-full wpqt-border data-[checked]:wpqt-bg-blue-400"
            >
              <span className="wpqt-invisible wpqt-size-2 wpqt-rounded-full wpqt-bg-white group-data-[checked]:wpqt-visible" />
            </Radio>
            <Label>{stage.name}</Label>
          </Field>
        ))}
      </RadioGroup>
      <div className="wpqt-mt-5 wpqt-flex wpqt-justify-center">
        {loading ? (
          <LoadingOval width="32" height="32" />
        ) : (
          <WPQTIconButton
            text={__("Save", "quicktasker")}
            icon={<PencilSquareIcon className="wpqt-icon-green wpqt-size-5" />}
            onClick={onSave}
          />
        )}
      </div>
    </WPQTModal>
  );
}

export { StageSelectionModal };
