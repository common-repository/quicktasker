import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { ADD_CUSTOM_FIELD } from "../../../constants";
import { useCustomFieldActions } from "../../../hooks/actions/useCustomFieldActions";
import { CustomFieldsContext } from "../../../providers/CustomFieldsContextProvider";
import { CustomFieldType } from "../../../types/custom-field";
import { WPQTIconButton } from "../../common/Button/Button";
import { WPQTInput } from "../../common/Input/Input";
import { Option, WPQTSelect } from "../../common/Select/WPQTSelect";
import { WPQTTextarea } from "../../common/TextArea/TextArea";

type Props = {
  description: string;
};
function CustomFieldCreation({ description }: Props) {
  const [customFieldName, setCustomFieldName] = useState("");
  const [customFieldDescription, setCustomFieldDescription] = useState("");
  const [isCreationOpen, setIsCreationOpen] = useState(false);
  const [selectedCustomFieldType, setSelectedCustomFieldType] =
    useState<CustomFieldType>(CustomFieldType.Text);
  const { addCustomField } = useCustomFieldActions();
  const {
    state: { entityId, entityType },
    customFieldsDispatch,
  } = useContext(CustomFieldsContext);
  const [loading, setLoading] = useState(false);

  const customFieldTypeOptions: Option[] = [
    { value: CustomFieldType.Text, label: "Text" },
    { value: CustomFieldType.Checkbox, label: "Checkbox" },
  ];

  const createCustomField = async () => {
    if (!entityId || !entityType) {
      console.error("Entity ID or Entity Type is missing");
      return;
    }
    setLoading(true);
    await addCustomField(
      entityId,
      entityType,
      selectedCustomFieldType,
      customFieldName,
      customFieldDescription,
      (newCustomField) => {
        customFieldsDispatch({
          type: ADD_CUSTOM_FIELD,
          payload: newCustomField,
        });
        resetState();
      },
    );
    setLoading(false);
  };

  const resetState = () => {
    setCustomFieldName("");
    setCustomFieldDescription("");
    setSelectedCustomFieldType(CustomFieldType.Text);
    setIsCreationOpen(false);
  };
  return (
    <div className="wpqt-mb-6 wpqt-flex wpqt-flex-col wpqt-items-center">
      <h2>{__("Custom Fields", "quicktasker")}</h2>
      <div className="wpqt-mb-4 wpqt-text-center">{description}</div>

      {isCreationOpen && (
        <div className="wpqt-flex wpqt-gap-4">
          <div>
            <div className="wpqt-mb-2">{__("Name", "quicktasker")}</div>
            <WPQTInput value={customFieldName} onChange={setCustomFieldName} />
          </div>
          <div>
            <div className="wpqt-mb-2">{__("Description", "quicktasker")}</div>
            <WPQTTextarea
              value={customFieldDescription}
              onChange={setCustomFieldDescription}
            />
          </div>
          <div>
            <div className="wpqt-mb-2">{__("Type", "quicktasker")}</div>
            <WPQTSelect
              selectedOptionValue={selectedCustomFieldType}
              options={customFieldTypeOptions}
              onSelectionChange={(selection: string) => {
                setSelectedCustomFieldType(selection as CustomFieldType);
              }}
              allSelector={false}
            />
          </div>
        </div>
      )}

      <div className="wpqt-flex wpqt-justify-end wpqt-gap-3">
        <WPQTIconButton
          text={
            isCreationOpen
              ? __("Cancel", "quicktasker")
              : __("Add new custom field", "quicktasker")
          }
          onClick={() => setIsCreationOpen(!isCreationOpen)}
          icon={
            isCreationOpen ? (
              <XCircleIcon className="wpqt-icon-red wpqt-size-5" />
            ) : (
              <PlusCircleIcon className="wpqt-icon-green wpqt-size-5" />
            )
          }
        />
        {isCreationOpen && (
          <WPQTIconButton
            text={__("Add", "quicktasker")}
            onClick={createCustomField}
            loading={loading}
            icon={<PlusCircleIcon className="wpqt-icon-green wpqt-size-5" />}
          />
        )}
      </div>
    </div>
  );
}

export { CustomFieldCreation };
