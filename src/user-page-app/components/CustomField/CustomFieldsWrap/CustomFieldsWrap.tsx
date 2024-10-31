import { useContext } from "@wordpress/element";
import {
  CustomField,
  CustomFieldEntityType,
} from "../../../../types/custom-field";
import { Task } from "../../../../types/task";
import { User } from "../../../../types/user";
import { useCustomFieldActions } from "../../../hooks/actions/useCustomFieldActions";
import { UserPageAppContext } from "../../../providers/UserPageAppContextProvider";
import { CustomField as CustomFieldComponent } from "../CustomField/CustomField";

type Props = {
  entityId: string;
  entityType: CustomFieldEntityType.Task | CustomFieldEntityType.User;
  entity: Task | User;
  customFields: CustomField[];
};

function CustomFieldsWrap({
  entityId,
  entityType,
  entity,
  customFields,
}: Props) {
  const {
    state: { cf, userId },
  } = useContext(UserPageAppContext);
  const { updateCustomFieldValue } = useCustomFieldActions();
  const valueChangeEnabled =
    entityType === CustomFieldEntityType.User ||
    (entityType === CustomFieldEntityType.Task &&
      "assigned_users" in entity &&
      entity.assigned_users.some((user: User) => user.id === userId));

  const saveCustomFieldValueChange = async (
    customFieldId: string,
    value: string,
  ) => {
    await updateCustomFieldValue(entityId, entityType, customFieldId, value);
  };

  if (!cf || !customFields) {
    return null;
  }

  return (
    <div className="wpqt-flex wpqt-flex-col wpqt-items-center wpqt-gap-3">
      {customFields.map((cf) => (
        <CustomFieldComponent
          key={cf.id}
          data={cf}
          valueChangeEnabled={valueChangeEnabled}
          saveCustomFieldValueChange={saveCustomFieldValueChange}
        ></CustomFieldComponent>
      ))}
    </div>
  );
}

export { CustomFieldsWrap };
