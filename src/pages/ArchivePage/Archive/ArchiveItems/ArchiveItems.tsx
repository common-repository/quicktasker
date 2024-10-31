import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { NoFilterResults } from "../../../../components/Filter/NoFilterResults/NoFilterResults";
import { useArchiveFilter } from "../../../../hooks/filters/useArchiveFilter";
import { ArchiveContext } from "../../../../providers/ArchiveContextProvider";
import { ArchiveItem } from "../ArchiveItem/ArchiveItem";

function ArchiveItems() {
  const {
    state: { archivedTasks = [] },
  } = useContext(ArchiveContext);
  const { filterArchive } = useArchiveFilter();
  const filteredArchiveItems = archivedTasks?.filter(filterArchive) ?? [];

  if (archivedTasks && archivedTasks.length === 0) {
    return <NoFilterResults text={__("No tasks archived", "quicktasker")} />;
  }

  if (filteredArchiveItems && filteredArchiveItems.length === 0) {
    return <NoFilterResults />;
  }

  return (
    <div>
      <div className="wpqt-card-grid">
        {filteredArchiveItems.map((task) => (
          <ArchiveItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

export { ArchiveItems };
