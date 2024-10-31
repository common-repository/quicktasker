import { TrashIcon } from "@heroicons/react/24/outline";
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { toast } from "react-toastify";
import {
  CLOSE_PIPELINE_MODAL,
  PIPELINE_REMOVE_ACTIVE_PIPELINE,
  PIPELINE_REMOVE_PIPELINE,
  PIPELINE_SET_PRIMARY,
} from "../../../../constants";
import { usePipelineActions } from "../../../../hooks/actions/usePipelineActions";
import { useLoadingStates } from "../../../../hooks/useLoadingStates";
import { ActivePipelineContext } from "../../../../providers/ActivePipelineContextProvider";
import { ModalContext } from "../../../../providers/ModalContextProvider";
import { PipelinesContext } from "../../../../providers/PipelinesContextProvider";
import { CustomFieldEntityType } from "../../../../types/custom-field";
import { Pipeline } from "../../../../types/pipeline";
import { WPQTIconButton } from "../../../common/Button/Button";
import { WPQTInput } from "../../../common/Input/Input";
import { WPQTTextarea } from "../../../common/TextArea/TextArea";
import { CustomFieldsInModalWrap } from "../../../CustomField/CustomFieldsInModalWrap/CustomFieldsInModalWrap";
import {
  WPQTModalField,
  WPQTModalFieldSet,
  WPQTModalFooter,
} from "../../WPQTModal";

type Props = {
  editPipeline: (pipeline: Pipeline) => void;
  modalSaving: boolean;
  setModalSaving: (value: boolean) => void;
};

const EditPipelineModalContent = forwardRef(
  ({ editPipeline, modalSaving }: Props, ref) => {
    const {
      state: { pipelineToEdit },
      modalDispatch,
    } = useContext(ModalContext);
    const { fetchAndSetPipelineData, dispatch } = useContext(
      ActivePipelineContext,
    );
    const { pipelinesDispatch } = useContext(PipelinesContext);
    const { deletePipeline } = usePipelineActions();
    const [pipelineName, setPipelineName] = useState("");
    const [pipelineDescription, setPipelineDescription] = useState("");
    const { loading1: isDeletingBoard, setLoading1: setIsDeletingBoard } =
      useLoadingStates();

    useEffect(() => {
      if (pipelineToEdit) {
        setPipelineName(pipelineToEdit.name);
        setPipelineDescription(pipelineToEdit.description || "");
      }
    }, [pipelineToEdit]);

    const savePipeline = () => {
      if (pipelineToEdit) {
        editPipeline({
          ...pipelineToEdit,
          name: pipelineName,
          description: pipelineDescription,
        });
      }
    };

    const onDeletePipeline = () => {
      if (!pipelineToEdit) return;
      setIsDeletingBoard(true);
      deletePipeline(
        pipelineToEdit.id,
        (removedPipelineId, pipelineIdToLoad) => {
          modalDispatch({ type: CLOSE_PIPELINE_MODAL });
          setIsDeletingBoard(false);
          toast.success(__("Board deleted", "quicktasker"));
          pipelinesDispatch({
            type: PIPELINE_REMOVE_PIPELINE,
            payload: removedPipelineId,
          });
          if (pipelineIdToLoad !== null) {
            pipelinesDispatch({
              type: PIPELINE_SET_PRIMARY,
              payload: pipelineIdToLoad,
            });
            fetchAndSetPipelineData(pipelineIdToLoad);
          } else {
            dispatch({ type: PIPELINE_REMOVE_ACTIVE_PIPELINE });
          }
        },
      );
    };

    const clearContent = () => {
      setPipelineName("");
      setPipelineDescription("");
    };

    useImperativeHandle(ref, () => ({
      clearContent,
    }));

    if (!pipelineToEdit) return null;

    return (
      <>
        <div className="wpqt-grid wpqt-grid-cols-1 wpqt-gap-7 md:wpqt-grid-cols-[1fr_auto]">
          <div className="wpqt-border-0 wpqt-border-r wpqt-border-solid wpqt-border-r-gray-300 md:wpqt-pr-3">
            <div className="wpqt-mb-5 wpqt-grid wpqt-grid-cols-1 wpqt-gap-4 md:wpqt-grid-cols-[auto_1fr]">
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
                    onChange={(newValue: string) =>
                      setPipelineDescription(newValue)
                    }
                  />
                </WPQTModalField>
              </WPQTModalFieldSet>
              <CustomFieldsInModalWrap
                entityId={pipelineToEdit.id}
                entityType={CustomFieldEntityType.Pipeline}
              />
            </div>
          </div>
          <div className="wpqt-flex wpqt-flex-col wpqt-gap-2">
            <WPQTIconButton
              icon={<TrashIcon className="wpqt-icon-red wpqt-size-5" />}
              loading={isDeletingBoard}
              text={__("Delete board", "quicktasker")}
              onClick={onDeletePipeline}
            />
          </div>
        </div>
        <WPQTModalFooter
          onSave={savePipeline}
          loading={modalSaving}
          saveBtnText={__("Save", "quicktasker")}
        />
      </>
    );
  },
);

export { EditPipelineModalContent };
