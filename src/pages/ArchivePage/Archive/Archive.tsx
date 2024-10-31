import { useContext } from "@wordpress/element";
import { ArchiveFilter } from "../../../components/Filter/ArchiveFilter/ArchiveFilter";
import { Loading } from "../../../components/Loading/Loading";
import { TaskModal } from "../../../components/Modal/TaskModal/TaskModal";
import { EDIT_ARCHIVED_TASK, REMOVE_ARCHIVED_TASK } from "../../../constants";
import { ArchiveContext } from "../../../providers/ArchiveContextProvider";
import { TaskFromServer } from "../../../types/task";
import { ArchiveItems } from "./ArchiveItems/ArchiveItems";

function Archive() {
  const {
    state: { archivedTasks },
    archiveDispatch,
  } = useContext(ArchiveContext);

  if (!archivedTasks) {
    return <Loading className="wpqt-h-[200px]" />;
  }

  return (
    <div>
      <ArchiveFilter />
      <ArchiveItems />
      <TaskModal
        editTaskCallback={(task: TaskFromServer) => {
          archiveDispatch({
            type: EDIT_ARCHIVED_TASK,
            payload: task,
          });
        }}
        deleteTaskCallback={(task) => {
          archiveDispatch({
            type: REMOVE_ARCHIVED_TASK,
            payload: task.id,
          });
        }}
      />
    </div>
  );
}

export { Archive };
