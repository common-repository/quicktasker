import { useCallback, useEffect, useState } from "@wordpress/element";
import { WPQTInput } from "../../../../components/common/Input/Input";
import { CustomFieldTitle } from "../../../../components/CustomField/CustomFields/components/CustomField/CustomField";
import { Loading } from "../../../../components/Loading/Loading";
import { CustomField, CustomFieldType } from "../../../../types/custom-field";
import { debounce } from "../../../../utils/debounce";

type Props = {
  data: CustomField;
  saveCustomFieldValueChange: (
    customFieldId: string,
    value: string,
  ) => Promise<void>;
  valueChangeEnabled?: boolean;
};
function CustomField({
  data,
  saveCustomFieldValueChange,
  valueChangeEnabled = true,
}: Props) {
  const handleChange = async (value: string) => {
    await saveCustomFieldValueChange(data.id, value);
  };
  switch (data.type) {
    case CustomFieldType.Text: {
      return (
        <TextCustomField
          data={data}
          onHandleChange={handleChange}
          valueChangeEnabled={valueChangeEnabled}
        />
      );
    }
    case CustomFieldType.Checkbox: {
      return (
        <CheckboxCustomField
          data={data}
          onHandleChange={handleChange}
          valueChangeEnabled={valueChangeEnabled}
        />
      );
    }
  }
}

type TextCustomFieldProps = {
  data: CustomField;
  onHandleChange: (value: string) => Promise<void>;
  valueChangeEnabled: boolean;
};
function TextCustomField({
  data,
  onHandleChange,
  valueChangeEnabled,
}: TextCustomFieldProps) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue(data.value || "");
  }, [data.value]);

  const debouncedHandleChange = useCallback(
    debounce(async (newValue: string) => {
      setLoading(true);
      await onHandleChange(newValue);
      setLoading(false);
    }, 600),
    [onHandleChange],
  );

  const onChange = (newValue: string) => {
    setValue(newValue);
    debouncedHandleChange(newValue);
  };

  return (
    <div className="wpqt-text-center">
      <CustomFieldTitle name={data.name} description={data.description} />
      <WPQTInput
        value={value}
        onChange={onChange}
        disabled={!valueChangeEnabled}
        loading={loading}
      />
    </div>
  );
}

type CheckboxCustomFieldProps = {
  data: CustomField;
  onHandleChange: (value: string) => Promise<void>;
  valueChangeEnabled: boolean;
};
function CheckboxCustomField({
  data,
  onHandleChange,
  valueChangeEnabled,
}: CheckboxCustomFieldProps) {
  const [isChecked, setIsChecked] = useState(data.value === "true");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsChecked(data.value === "true");
  }, [data.value]);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    setLoading(true);
    await onHandleChange(e.target.checked ? "true" : "false");
    setLoading(false);
  };
  return (
    <div className="wpqt-text-center">
      <CustomFieldTitle name={data.name} description={data.description} />
      {loading ? (
        <Loading ovalSize="24" />
      ) : (
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onChange}
          disabled={!valueChangeEnabled}
        />
      )}
    </div>
  );
}

export { CustomField };
