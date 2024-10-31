import { useContext, useEffect, useState } from "@wordpress/element";
import { DELETE_CUSTOM_FIELD } from "../../../../../constants";
import { useCustomFieldActions } from "../../../../../hooks/actions/useCustomFieldActions";
import { CustomFieldsContext } from "../../../../../providers/CustomFieldsContextProvider";
import {
  CustomField,
  CustomFieldEntityType,
  CustomFieldType,
} from "../../../../../types/custom-field";
import { WPQTInput } from "../../../../common/Input/Input";
import { CustomFieldActions } from "../CustomFieldActions/CustomFieldActions";

type Props = {
  data: CustomField;
};

function CustomField({ data }: Props) {
  const [value, setValue] = useState("");
  const {
    state: { entityType, entityId },
    customFieldsDispatch,
  } = useContext(CustomFieldsContext);
  const { updateCustomFieldValue, markCustomFieldAsDeleted } =
    useCustomFieldActions();
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (data.value) {
      setValue(data.value);
    }
  }, [data.value]);

  const handleSave = async () => {
    if (
      entityType === CustomFieldEntityType.User ||
      entityType === CustomFieldEntityType.Task
    ) {
      setActionLoading(true);
      await updateCustomFieldValue(data.id, value, entityId, entityType);
      setActionLoading(false);
    } else {
      console.error("Invalid entity type for saving custom field value");
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    await markCustomFieldAsDeleted(data.id, () => {
      customFieldsDispatch({ type: DELETE_CUSTOM_FIELD, payload: data.id });
    });
    setActionLoading(false);
  };

  let customFieldElement;

  switch (data.type) {
    case CustomFieldType.Text: {
      customFieldElement = (
        <TextCustomField data={data} value={value} onChange={setValue} />
      );
      break;
    }
    case CustomFieldType.Checkbox: {
      customFieldElement = (
        <CheckboxCustomField data={data} value={value} onChange={setValue} />
      );
      break;
    }
  }

  return (
    <>
      <div></div>
      {customFieldElement}
      <CustomFieldActions
        data={data}
        locationOfCustomFields={entityType}
        onSave={handleSave}
        onDelete={handleDelete}
        actionLoading={actionLoading}
      />
    </>
  );
}

type TextCustomFieldProps = {
  value: string;
  onChange: (value: string) => void;
  data: CustomField;
};
function TextCustomField({ data, value, onChange }: TextCustomFieldProps) {
  return (
    <div className="wpqt-flex wpqt-flex-col wpqt-items-center wpqt-justify-center">
      <CustomFieldTitle name={data.name} description={data.description} />
      <WPQTInput value={value} onChange={onChange} />
    </div>
  );
}

type CheckboxCustomFieldProps = {
  value: string;
  onChange: (value: string) => void;
  data: CustomField;
};
function CheckboxCustomField({
  data,
  value,
  onChange,
}: CheckboxCustomFieldProps) {
  return (
    <div className="wpqt-flex wpqt-flex-col wpqt-items-center">
      <CustomFieldTitle name={data.name} description={data.description} />
      <input
        type="checkbox"
        checked={value === "true"}
        className="!wpqt-block"
        onChange={(e) => onChange(e.target.checked ? "true" : "false")}
      />
    </div>
  );
}

type CustomFieldTitleProps = {
  name: string;
  description: string | null;
};
function CustomFieldTitle({ name, description = "" }: CustomFieldTitleProps) {
  return (
    <>
      <div className="wpqt-mb-1 wpqt-text-base wpqt-font-semibold">{name}</div>
      {description && (
        <div className="wpqt-mb-2 wpqt-italic">{description}</div>
      )}
    </>
  );
}

export { CustomField, CustomFieldTitle };
