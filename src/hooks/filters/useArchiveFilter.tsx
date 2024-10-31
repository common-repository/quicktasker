import { useContext } from "@wordpress/element";
import { ArchiveContext } from "../../providers/ArchiveContextProvider";
import { WPQTArchiveDoneFilter } from "../../types/enums";
import { Task } from "../../types/task";

const useArchiveFilter = () => {
  const {
    state: {
      archiveSearchValue,
      archiveFilteredPipelineId,
      archiveTaskDoneFilter,
    },
  } = useContext(ArchiveContext);

  const filterArchive = (archivedTask: Task) => {
    const matchesSearchValue =
      archivedTask.name
        .toLowerCase()
        .includes(archiveSearchValue.toLowerCase()) ||
      (archivedTask.description &&
        archivedTask.description
          .toLowerCase()
          .includes(archiveSearchValue.toLowerCase()));

    const matchesPipelineId =
      !archiveFilteredPipelineId ||
      archivedTask.pipeline_id === archiveFilteredPipelineId;

    const matchesTaskDoneFilter =
      archiveTaskDoneFilter === WPQTArchiveDoneFilter.All ||
      (archiveTaskDoneFilter === WPQTArchiveDoneFilter.Completed &&
        archivedTask.is_done) ||
      (archiveTaskDoneFilter === WPQTArchiveDoneFilter.NotCompleted &&
        !archivedTask.is_done);

    return matchesSearchValue && matchesPipelineId && matchesTaskDoneFilter;
  };

  return {
    filterArchive,
  };
};

export { useArchiveFilter };
