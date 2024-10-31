import { useContext } from "@wordpress/element";
import { UserTasksContext } from "../../providers/UserTasksContextProvider";
import { Task } from "../../types/task";

const useUserTasksFilter = () => {
  const {
    state: { searchValue, filteredPipelineId },
  } = useContext(UserTasksContext);

  const filterTasks = (task: Task) => {
    const matchesSearchValue =
      (task.name &&
        task.name.toLowerCase().includes(searchValue.toLowerCase())) ||
      (task.description &&
        task.description.toLowerCase().includes(searchValue.toLowerCase()));

    const matchesPipelineId =
      !filteredPipelineId || task.pipeline_id === filteredPipelineId;

    return matchesSearchValue && matchesPipelineId;
  };

  return {
    filterTasks,
  };
};

export { useUserTasksFilter };
