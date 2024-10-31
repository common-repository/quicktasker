<?php

namespace WPQT\Log;

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

class LogRepository {
    /**
     * Retrieves a log entry by its ID.
     *
     * This function queries the database to fetch a log entry from the wp_quick_tasks_logs table
     * based on the provided log ID.
     *
     * @param int $logId The ID of the log entry to retrieve.
     * @return object|null The log entry object if found, null otherwise.
     */
    public function getLogById($logId) {
        global $wpdb;

        return $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM " . TABLE_WP_QUICKTASKS_LOGS . " WHERE id = %d",
                $logId
            )
        );
    }

    /**
     * Retrieves logs from the database based on the provided type ID and type.
     *
     * This function queries the logs table and joins with the WordPress users table
     * and the quicktasker users table to fetch log details along with the author's name.
     *
     * @param int $typeId The ID of the log type to filter by.
     * @param string $type The type of the log to filter by.
     * @global wpdb $wpdb WordPress database abstraction object.
     * @return array An array of log objects containing log details and author names.
     */
    public function getLogs($typeId, $type) {
        global $wpdb;

        $table_logs = TABLE_WP_QUICKTASKS_LOGS;
        $table_users = $wpdb->users;
        $table_quicktasker_users = TABLE_WP_QUICKTASKER_USERS;

        $sql = "
            SELECT 
                logs.id,
                logs.text,
                logs.type_id,
                logs.type,
                logs.created_by,
                logs.user_id,
                logs.created_at,
                CASE 
                    WHEN logs.created_by = 'admin' THEN wp_users.display_name
                    WHEN logs.created_by = 'quicktasker_user' THEN quicktasker_users.name
                    ELSE 'system'
                END AS author_name
            FROM $table_logs AS logs
            LEFT JOIN $table_users AS wp_users ON logs.created_by = 'admin' AND logs.user_id = wp_users.ID
            LEFT JOIN $table_quicktasker_users AS quicktasker_users ON logs.created_by = 'quicktasker_user' AND logs.user_id = quicktasker_users.id
            WHERE logs.type_id = %d AND logs.type = %s
        ";

        $results = $wpdb->get_results($wpdb->prepare($sql, $typeId, $type));

        return $results;
    }

    /**
     * Retrieves global logs from the database with optional filtering and ordering.
     *
     * @param string|null $logType The type of log to filter by. If null, no filtering by type is applied.
     * @param string|null $logCreatedBy The creator of the log to filter by. If null, no filtering by creator is applied.
     * @param int $numberOfLogs The number of logs to retrieve. Currently not used in the query.
     * @param string $logOrder The order of the logs, either 'ASC' for ascending or 'DESC' for descending.
     * @return array The retrieved logs from the database.
     */
    public function getGlobalLogs($logType, $logCreatedBy, $numberOfLogs, $logOrder) {
        global $wpdb;

        $table_logs = TABLE_WP_QUICKTASKS_LOGS;
        $table_users = $wpdb->users;
        $table_quicktasker_users = TABLE_WP_QUICKTASKER_USERS;
        $order = $logOrder === 'asc' ? 'ASC' : 'DESC';

        $sql = "
            SELECT 
                logs.id,
                logs.text,
                logs.type_id,
                logs.type,
                logs.created_by,
                logs.user_id,
                logs.created_at,
                CASE 
                    WHEN logs.created_by = 'admin' THEN wp_users.display_name
                    WHEN logs.created_by = 'quicktasker_user' THEN quicktasker_users.name
                    ELSE 'system'
                END AS author_name
            FROM $table_logs AS logs
            LEFT JOIN $table_users AS wp_users ON logs.created_by = 'admin' AND logs.user_id = wp_users.ID
            LEFT JOIN $table_quicktasker_users AS quicktasker_users ON logs.created_by = 'quicktasker_user' AND logs.user_id = quicktasker_users.id";
        $whereClauses = [];
        $queryParams = [];

        if ($logType !== null) {
            $whereClauses[] = "logs.type = %s";
            $queryParams[] = $logType;
        }

        if ($logCreatedBy !== null) {
            $whereClauses[] = "logs.created_by = %s";
            $queryParams[] = $logCreatedBy;
        }
    
        if (!empty($whereClauses)) {
            $sql .= ' WHERE ' . implode(' AND ', $whereClauses);
        }

        $sql .= " ORDER BY logs.created_at " . $order;

        $results = $wpdb->get_results($wpdb->prepare($sql, ...$queryParams));

        return $results;
    }
}