<?php

namespace WPQT\Customfield;

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

use WPQT\Task\TaskRepository;

class CustomFieldRepository {

    protected $taskRepository;

    public function __construct() {
        $this->taskRepository = new TaskRepository();
    }

    /**
     * Retrieves a custom field by its ID.
     *
     * This function queries the database to fetch a custom field record
     * based on the provided ID. It returns an object containing the custom
     * field details such as id, name, description, type, entity_type, entity_id,
     * created_at, and updated_at.
     *
     * @param int $id The ID of the custom field to retrieve.
     * @return object|null The custom field object if found, null otherwise.
     */
    public function getCustomFieldById($id) {
        global $wpdb;

        $query = $wpdb->prepare(
            "SELECT id, name, description, type, entity_type, entity_id, created_at, updated_at FROM " . TABLE_WP_QUICKTASKER_CUSTOM_FIELDS . "
            WHERE id = %d",
            $id
        );

        return $wpdb->get_row($query);
    }

    /**
     * Retrieves custom fields for a given entity.
     *
     * @param int|'null' $entityId The ID of the entity to retrieve custom fields for.
     * @param string $entityType The type of the entity to retrieve custom fields for.
     * @return array|null An array of custom fields or null if none found.
     */
    public function getCustomFields($entityId, $entityType, $isDeleted = false) {
        global $wpdb;

        $isDeletedCondition = $isDeleted ? 1 : 0;
        $query = '';

        if($entityId === "null") {
            $query = $wpdb->prepare(
                "SELECT id, name, description, type, entity_type, entity_id, created_at, updated_at FROM " . TABLE_WP_QUICKTASKER_CUSTOM_FIELDS . "
                WHERE entity_id IS NULL AND entity_type = %s AND is_deleted = %d",
                $entityType, $isDeletedCondition
            );
        } else {
            $query = $wpdb->prepare(
                "SELECT id, name, description, type, entity_type, entity_id, created_at, updated_at FROM " . TABLE_WP_QUICKTASKER_CUSTOM_FIELDS . "
                WHERE entity_id = %s AND entity_type = %s AND is_deleted = %d",
                $entityId, $entityType, $isDeletedCondition
            );
        }

        return $wpdb->get_results($query);
    }

    public function getRelatedCustomFields($entityId, $entityType) {
        if($entityType === 'task') {
            return $this->getTaskRelatedCustomFields($entityId);
        }else if($entityType === 'user') {
            return $this->getUserRelatedCustomFields($entityId);
        }
        return $this->getCustomFields($entityId, $entityType);
    }

    /**
     * Retrieves custom fields related to a specific task and its pipeline.
     *
     * This function fetches custom fields and their values associated with a given task ID and pipeline ID.
     * It joins the custom fields table with the custom field values table to get the relevant data.
     *
     * @param int $taskId The ID of the task for which to retrieve custom fields.
     * @return array|null An array of custom fields and their values, or null if no results are found.
     */
    public function getTaskRelatedCustomFields($taskId) {
        global $wpdb;

        $task = $this->taskRepository->getTaskById($taskId);

        $query = $wpdb->prepare(
            "SELECT custom_fields.*, custom_field_values.value 
             FROM " . TABLE_WP_QUICKTASKER_CUSTOM_FIELDS . " custom_fields
             LEFT JOIN " . TABLE_WP_QUICKTASKER_CUSTOM_FIELDS_VALUES . " custom_field_values
             ON custom_fields.id = custom_field_values.custom_field_id 
             AND custom_field_values.entity_id = %d 
             AND custom_field_values.entity_type = 'task'
             WHERE (custom_fields.entity_id = %d AND custom_fields.entity_type = 'task' AND custom_fields.is_deleted = 0) 
             OR (custom_fields.entity_id = %d AND custom_fields.entity_type = 'pipeline' AND custom_fields.is_deleted = 0)",
            $taskId, $taskId, $task->pipeline_id
        );
    
        return $wpdb->get_results($query);
    }

    public function getUserRelatedCustomFields($userId) {
        global $wpdb;

        $query = $wpdb->prepare(
            "SELECT custom_fields.*, custom_field_values.value 
             FROM " . TABLE_WP_QUICKTASKER_CUSTOM_FIELDS . " custom_fields
             LEFT JOIN " . TABLE_WP_QUICKTASKER_CUSTOM_FIELDS_VALUES . " custom_field_values
             ON custom_fields.id = custom_field_values.custom_field_id 
             AND custom_field_values.entity_id = %d 
             AND custom_field_values.entity_type = 'user'
             WHERE (custom_fields.entity_id = %d AND custom_fields.entity_type = 'user' AND custom_fields.is_deleted = 0) 
             OR (custom_fields.entity_id IS NULL AND custom_fields.entity_type = 'users' AND custom_fields.is_deleted = 0)",
             $userId, $userId
        );
    
        return $wpdb->get_results($query);
    }
}