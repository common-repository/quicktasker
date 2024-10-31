import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
  SET_USER_TASKS_FILTERED_PIPELINE,
  SET_USER_TASKS_SEARCH_VALUE,
} from "../../../constants";
import { UserTasksContext } from "../../../providers/UserTasksContextProvider";
import { WPQTInput } from "../../common/Input/Input";
import { PipelineFilterSelect } from "../../common/Select/PipelineFilterSelect/PipelineFilterSelect";
import { WPQTFilter } from "../WPQTFilter";

function UserTasksFilter() {
  const {
    state: { searchValue, filteredPipelineId },
    userTasksDispatch,
  } = useContext(UserTasksContext);

  const onValueChange = (value: string) => {
    userTasksDispatch({ type: SET_USER_TASKS_SEARCH_VALUE, payload: value });
  };
  const onPipelineChange = (pipelineId: string) => {
    userTasksDispatch({
      type: SET_USER_TASKS_FILTERED_PIPELINE,
      payload: pipelineId,
    });
  };
  return (
    <WPQTFilter title={__("Filter tasks", "quicktasker")}>
      <WPQTInput
        value={searchValue}
        onChange={onValueChange}
        className="!wpqt-mb-0"
      />
      <PipelineFilterSelect
        selectedOptionValue={filteredPipelineId}
        selectionChange={onPipelineChange}
      />
    </WPQTFilter>
  );
}

export { UserTasksFilter };
