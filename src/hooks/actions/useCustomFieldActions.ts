import { __ } from "@wordpress/i18n";
import { toast } from "react-toastify";
import {
  addCustomFieldRequest,
  markCustomFieldAsDeletedRequest,
  updateCustomFieldValueRequest,
} from "../../api/api";
import {
  CustomField,
  CustomFieldEntityType,
  CustomFieldType,
} from "../../types/custom-field";

function useCustomFieldActions() {
  const addCustomField = async (
    entityId: string,
    entityType: CustomFieldEntityType,
    type: CustomFieldType,
    name: string,
    description: string,
    callback?: (customField: CustomField) => void,
  ) => {
    try {
      const response = await addCustomFieldRequest(
        entityId,
        entityType,
        type,
        name,
        description,
      );
      if (callback) callback(response.data);
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to add a custom field", "quicktasker"));
    }
  };
  const markCustomFieldAsDeleted = async (
    customFieldId: string,
    callback?: () => void,
  ) => {
    try {
      await markCustomFieldAsDeletedRequest(customFieldId);
      if (callback) callback();
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to mark custom field as deleted", "quicktasker"));
    }
  };

  const updateCustomFieldValue = async (
    customFieldId: string,
    value: string,
    entityId: string,
    entityType: "user" | "task",
    callback?: () => void,
  ) => {
    try {
      await updateCustomFieldValueRequest(
        customFieldId,
        value,
        entityId,
        entityType,
      );
      if (callback) callback();
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to update custom field value", "quicktasker"));
    }
  };

  return {
    addCustomField,
    markCustomFieldAsDeleted,
    updateCustomFieldValue,
  };
}

export { useCustomFieldActions };
