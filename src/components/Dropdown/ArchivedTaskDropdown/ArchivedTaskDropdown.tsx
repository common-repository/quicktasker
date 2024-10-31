import {
  ArrowUturnUpIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useContext } from "@wordpress/element";
import { REMOVE_ARCHIVED_TASK } from "../../../constants";
import { useTaskActions } from "../../../hooks/actions/useTaskActions";
import { AppContext } from "../../../providers/AppContextProvider";
import { ArchiveContext } from "../../../providers/ArchiveContextProvider";
import { Task } from "../../../types/task";
import {
  WPQTDropdown,
  WPQTDropdownIcon,
  WPQTDropdownItem,
} from "../WPQTDropdown";

type Props = {
  task: Task;
};

function ArchivedTaskDropdown({ task }: Props) {
  const {
    state: { isUserAllowedToDelete },
  } = useContext(AppContext);
  const { archiveDispatch } = useContext(ArchiveContext);
  const { deleteTask, restoreArchivedTask } = useTaskActions();
  const pipelineExists = task.pipeline_name !== null;

  return (
    <WPQTDropdown
      menuBtn={({ active }) => (
        <WPQTDropdownIcon
          isActive={active}
          IconComponent={EllipsisHorizontalIcon}
        />
      )}
    >
      <WPQTDropdownItem
        text="View task"
        icon={<EyeIcon className="wpqt-icon-blue wpqt-size-4" />}
      />

      <WPQTDropdownItem
        text="Restore task"
        icon={<ArrowUturnUpIcon className="wpqt-icon-green wpqt-size-4" />}
        disabled={!pipelineExists}
        id={`restore-task-${task.id}-dropdown-item`}
        tooltipText="Task cannot be restored because the board has been deleted."
        onClick={async (e: React.MouseEvent) => {
          e.stopPropagation();
          await restoreArchivedTask(task.id, () => {
            archiveDispatch({
              type: REMOVE_ARCHIVED_TASK,
              payload: task.id,
            });
          });
        }}
      />

      {isUserAllowedToDelete && (
        <WPQTDropdownItem
          text="Delete"
          icon={<TrashIcon className="wpqt-icon-red wpqt-size-4" />}
          onClick={async (e: React.MouseEvent) => {
            e.stopPropagation();
            await deleteTask(task.id, () => {
              archiveDispatch({
                type: REMOVE_ARCHIVED_TASK,
                payload: task.id,
              });
            });
          }}
          className="!wpqt-mb-0"
        />
      )}
    </WPQTDropdown>
  );
}

export { ArchivedTaskDropdown };
