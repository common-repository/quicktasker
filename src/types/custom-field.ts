enum CustomFieldType {
  Text = "text",
  Select = "select",
  Checkbox = "checkbox",
  Radio = "radio",
  Datetime = "datetime",
  File = "file",
}

enum CustomFieldEntityType {
  User = "user",
  Pipeline = "pipeline",
  Users = "users",
  Task = "task",
}

type CustomField = {
  id: string;
  name: string;
  description: string;
  type: CustomFieldType;
  entity_type: CustomFieldEntityType;
  entity_id: string;
  created_at: string;
  updated_at: string;
  value?: string;
};

export { CustomFieldEntityType, CustomFieldType, type CustomField };
