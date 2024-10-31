import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { WPQTIconButton } from "../../../../../components/common/Button/Button";
import { Task } from "../../../../../types/task";
import { UserPageAppContext } from "../../../../providers/UserPageAppContextProvider";
import { UserPageTaskContext } from "../../../../providers/UserPageTaskContextProvider";
import { StageSelectionModal } from "../../../Modal/StageSelectionModal/StageSelectionModal";

type Props = {
  task: Task | null;
};
function TaskStageSelect({ task }: Props) {
  const {
    state: { taskStages },
  } = useContext(UserPageTaskContext);
  const {
    state: { pageHash, userId },
  } = useContext(UserPageAppContext);
  const [selectionModalOpen, setSelectionModalOpen] = useState(false);
  const changeEnabled = task?.assigned_users.some((user) => user.id === userId);
  const currentTaskStage = taskStages.find(
    (stage) => stage.id === task?.stage_id,
  );

  if (task === null) {
    return null;
  }

  return (
    <div className="wpqt-flex wpqt-flex-col wpqt-items-center wpqt-mb-3">
      <div className="wpqt-mb-3 wpqt-font-medium">
        {sprintf(
          __("Task is on stage %s", "quicktasker"),
          currentTaskStage?.name,
        )}
      </div>
      {changeEnabled && (
        <WPQTIconButton
          text={__("Change stage", "quicktasker")}
          icon={<PaperAirplaneIcon className="wpqt-size-5 wpqt-icon-blue" />}
          onClick={() => setSelectionModalOpen(true)}
        />
      )}
      <StageSelectionModal
        stages={taskStages}
        task={task}
        pageHash={pageHash}
        open={selectionModalOpen}
        onClose={() => setSelectionModalOpen(false)}
      />
    </div>
  );
}

export { TaskStageSelect };
