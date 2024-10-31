import { useContext, useMemo } from "@wordpress/element";
import { PipelinesContext } from "../../../../providers/PipelinesContextProvider";
import { WPQTSelect } from "../WPQTSelect";

type Props = {
  selectedOptionValue: string;
  selectionChange: (selection: string) => void;
};
function PipelineFilterSelect({ selectedOptionValue, selectionChange }: Props) {
  const {
    state: { pipelines },
  } = useContext(PipelinesContext);

  const pipelineOptions = useMemo(
    () =>
      pipelines.map((pipeline) => ({
        value: pipeline.id,
        label: pipeline.name,
      })),
    [pipelines],
  );

  return (
    <WPQTSelect
      options={pipelineOptions}
      selectedOptionValue={selectedOptionValue}
      onSelectionChange={selectionChange}
    />
  );
}

export { PipelineFilterSelect };
