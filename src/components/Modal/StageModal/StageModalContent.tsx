import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { ModalContext } from "../../../providers/ModalContextProvider";
import { Stage } from "../../../types/stage";
import { WPQTInput } from "../../common/Input/Input";
import { WPQTTextarea } from "../../common/TextArea/TextArea";
import {
  WPQTModalField,
  WPQTModalFieldSet,
  WPQTModalFooter,
  WPQTModalTitle,
} from "../WPQTModal";

type Props = {
  editStage: (stage: Stage) => void;
  addStage: (name: string, description: string) => void;
  stageModalSaving: boolean;
  stageTaskModalSaving: (value: boolean) => void;
};

const StageModalContent = forwardRef(
  ({ editStage, addStage, stageModalSaving }: Props, ref) => {
    const {
      state: { stageToEdit },
    } = useContext(ModalContext);
    const [stageName, setStageName] = useState("");
    const [stageDescription, setStageDescription] = useState("");
    const editingStage = !!stageToEdit;

    useEffect(() => {
      if (stageToEdit) {
        setStageName(stageToEdit.name);
        setStageDescription(stageToEdit.description);
      }
    }, [stageToEdit]);

    const saveStage = () => {
      editingStage
        ? editStage({
            ...stageToEdit,
            name: stageName,
            description: stageDescription,
          })
        : addStage(stageName, stageDescription);
    };

    const clearContent = () => {
      setStageName("");
      setStageDescription("");
    };

    useImperativeHandle(ref, () => ({
      clearContent,
    }));

    return (
      <>
        <WPQTModalTitle>
          {editingStage
            ? __("Edit Stage", "quicktasker")
            : __("Add Stage", "quicktasker")}
        </WPQTModalTitle>
        <WPQTModalFieldSet>
          <WPQTModalField label={__("Name", "quicktasker")}>
            <WPQTInput
              isAutoFocus={true}
              value={stageName}
              onChange={(newValue: string) => setStageName(newValue)}
            />
          </WPQTModalField>
          <WPQTModalField label={__("Description", "quicktasker")}>
            <WPQTTextarea
              rowsCount={3}
              value={stageDescription}
              onChange={(newValue: string) => setStageDescription(newValue)}
            />
          </WPQTModalField>
        </WPQTModalFieldSet>
        <WPQTModalFooter
          onSave={saveStage}
          loading={stageModalSaving}
          saveBtnText={
            editingStage
              ? __("Save", "quicktasker")
              : __("Add stage", "quicktasker")
          }
        />
      </>
    );
  },
);

export { StageModalContent };
