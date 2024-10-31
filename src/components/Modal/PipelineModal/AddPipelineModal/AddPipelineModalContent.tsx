import { forwardRef, useImperativeHandle, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { WPQTInput } from "../../../common/Input/Input";
import { WPQTTextarea } from "../../../common/TextArea/TextArea";
import {
  WPQTModalField,
  WPQTModalFieldSet,
  WPQTModalFooter,
} from "../../WPQTModal";

type Props = {
  addPipeline: (name: string, description: string) => void;
  modalSaving: boolean;
  setModalSaving: (value: boolean) => void;
};

const PipelineModalContent = forwardRef(
  ({ addPipeline, modalSaving }: Props, ref) => {
    const [pipelineName, setPipelineName] = useState("");
    const [pipelineDescription, setPipelineDescription] = useState("");

    const savePipeline = () => {
      addPipeline(pipelineName, pipelineDescription);
    };

    const clearContent = () => {
      setPipelineName("");
      setPipelineDescription("");
    };

    useImperativeHandle(ref, () => ({
      clearContent,
    }));

    return (
      <>
        <WPQTModalFieldSet>
          <WPQTModalField label={__("Name", "quicktasker")}>
            <WPQTInput
              isAutoFocus={true}
              value={pipelineName}
              onChange={(newValue: string) => setPipelineName(newValue)}
            />
          </WPQTModalField>
          <WPQTModalField label={__("Description", "quicktasker")}>
            <WPQTTextarea
              rowsCount={3}
              value={pipelineDescription}
              onChange={(newValue: string) => setPipelineDescription(newValue)}
            />
          </WPQTModalField>
        </WPQTModalFieldSet>
        <WPQTModalFooter
          onSave={savePipeline}
          loading={modalSaving}
          saveBtnText={__("Add board", "quicktasker")}
        />
      </>
    );
  },
);

export { PipelineModalContent };
