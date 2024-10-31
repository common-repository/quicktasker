<?php

namespace WPQT\Customfield;

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

use WPQT\WPQTException;
use WPQT\Customfield\CustomFieldRepository;
use WPQT\Time\TimeRepository;

class CustomFieldService {
    protected $customFieldRepository;
    protected $timeRepository;

    public function __construct() {
        $this->customFieldRepository = new CustomFieldRepository();
        $this->timeRepository = new TimeRepository();
    }

/**
 * Creates a custom field in the database.
 *
 * @param string $name The name of the custom field.
 * @param string $description The description of the custom field.
 * @param string $type The type of the custom field.
 * @param string $entityType The type of the entity the custom field is associated with.
 * @param int|'null' $entityId The ID of the entity the custom field is associated with.
 * @return int The ID of the newly created custom field.
 * @throws WPQTException If the custom field could not be added to the database.
 */
   public function createCustomField($name, $description, $type, $entityType, $entityId) {
        global $wpdb;

        // Convert string "null" to actual NULL
        if ($entityId === "null") {
            $entityId = NULL;
        }

        $result = $wpdb->insert(
            TABLE_WP_QUICKTASKER_CUSTOM_FIELDS,
            array(
                'name' => $name,
                'description' => $description,
                'type' => $type,
                'entity_type' => $entityType,
                'entity_id' => $entityId,
                'created_at' => $this->timeRepository->getCurrentUTCTime(),
                'updated_at' => $this->timeRepository->getCurrentUTCTime()
            ),
            array('%s', '%s', '%s', '%s', '%d', '%s', '%s', '%s')
        ); 

        if ($result === false) {
            // Debugging information
            $error_message = $wpdb->last_error;
            $last_query = $wpdb->last_query;
            throw new WPQTException(esc_html('Failed to add a custom field. Error: ' . $error_message . ' Query: ' . $last_query));
        }

        $customFieldId = $wpdb->insert_id;

        return $this->customFieldRepository->getCustomFieldById($customFieldId);
    }

    /**
     * Marks a custom field as deleted in the database.
     *
     * This function updates the 'is_deleted' status of a custom field to 1,
     * effectively marking it as deleted.
     *
     * @param int $customFieldId The ID of the custom field to be marked as deleted.
     * @return bool Returns true if the custom field was successfully marked as deleted.
     * @throws WPQTException If the update operation fails.
     */
    public function markCustomFieldAsDeleted($customFieldId) {
        global $wpdb;

        $result = $wpdb->update(
            TABLE_WP_QUICKTASKER_CUSTOM_FIELDS,
            array(
                'is_deleted' => 1,
                'updated_at' => $this->timeRepository->getCurrentUTCTime()
            ),
            array(
                'id' => $customFieldId
            ),
            array('%d', '%s'),
            array('%d')
        );

        if( $result === false ) {
            throw new WPQTException('Failed to mark the custom field as deleted');
        }

        return true;
    }

    /**
     * Updates the value of a custom field for a given entity.
     *
     * This method checks if a custom field value already exists for the specified
     * custom field ID, entity ID, and entity type. If it exists, the method updates
     * the existing value. If it does not exist, the method inserts a new custom field value.
     *
     * @param int $customFieldId The ID of the custom field.
     * @param int $entityId The ID of the entity to which the custom field belongs.
     * @param string $entityType The type of the entity (e.g., 'post', 'user').
     * @param mixed $value The value to be set for the custom field.
     * @return bool True on success, throws WPQTException on failure.
     * @throws WPQTException If the custom field value update or insert fails.
     */
    public function updateCustomFieldValue($customFieldId, $entityId, $entityType, $value) {
        global $wpdb;

        // Check if the custom field value already exists
        $existingValue = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM " . TABLE_WP_QUICKTASKER_CUSTOM_FIELDS_VALUES . " 
             WHERE custom_field_id = %d AND entity_id = %d AND entity_type = %s",
            $customFieldId, $entityId, $entityType
        ));

        if ($existingValue) {
            // Update existing custom field value
            $result = $wpdb->update(
                TABLE_WP_QUICKTASKER_CUSTOM_FIELDS_VALUES,
                array(
                    'value' => $value,
                    'updated_at' => $this->timeRepository->getCurrentUTCTime()
                ),
                array(
                    'id' => $existingValue
                ),
                array('%s', '%s'),
                array('%d')
            );
        } else {
            // Insert new custom field value
            $result = $wpdb->insert(
                TABLE_WP_QUICKTASKER_CUSTOM_FIELDS_VALUES,
                array(
                    'custom_field_id' => $customFieldId,
                    'entity_id' => $entityId,
                    'entity_type' => $entityType,
                    'value' => $value,
                    'created_at' => $this->timeRepository->getCurrentUTCTime(),
                    'updated_at' => $this->timeRepository->getCurrentUTCTime()
                )
            );
        }

        if ($result === false) {
            throw new WPQTException('Failed to update the custom field value');
        }

        return true;
    }
}