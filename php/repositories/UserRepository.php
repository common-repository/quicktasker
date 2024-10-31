<?php

namespace WPQT\User;

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

class UserRepository {
    /**
     * Retrieves a list of users along with their assigned tasks count and page hash.
     *
     * This method executes a SQL query to fetch user details from the database.
     * It joins multiple tables to gather additional information such as the number
     * of assigned tasks (excluding archived tasks) and the page hash associated with each user.
     *
     * @global wpdb $wpdb WordPress database abstraction object.
     *
     * @return array|object|null List of users with their details, or null on failure.
     */
    public function getUsers() {
        global $wpdb;
    
        return $wpdb->get_results(
            "SELECT a.id, a.name, a.description, a.created_at, a.updated_at, a.is_active, CASE 
                        WHEN a.password IS NULL THEN 0 
                        ELSE 1 
                    END AS has_password, b.page_hash, 
                    (SELECT COUNT(*)
                     FROM " . TABLE_WP_QUICKTASKER_USER_TASK . " AS c
                     JOIN " . TABLE_WP_QUICKTASKER_TASKS . " AS d
                     ON c.task_id = d.id
                     WHERE c.user_id = a.id AND d.is_archived = 0) AS assigned_tasks_count
             FROM " . TABLE_WP_QUICKTASKER_USERS . " AS a
             LEFT JOIN " . TABLE_WP_QUICKTASKER_USER_PAGES . " AS b ON a.id = b.user_id
             WHERE a.deleted = 0"
        );
    }

    /**
     * Retrieves a user by their ID.
     *
     * This function fetches user details from the database, including the user's ID, name, description,
     * creation and update timestamps, active status, associated page hash, and the count of assigned tasks
     * that are not archived.
     *
     * @param int $id The ID of the user to retrieve.
     * @return object|null The user object containing user details and assigned tasks count, or null if the user is not found.
     */
    public function getUserById($id) {
        global $wpdb;
    
        return $wpdb->get_row(
            $wpdb->prepare(
                "SELECT a.id, a.name, a.description, a.created_at, a.updated_at, a.is_active, b.page_hash, 
                        (SELECT COUNT(*)
                         FROM " . TABLE_WP_QUICKTASKER_USER_TASK . " AS c
                         JOIN " . TABLE_WP_QUICKTASKER_TASKS . " AS d
                         ON c.task_id = d.id
                         WHERE c.user_id = a.id AND d.is_archived = 0) AS assigned_tasks_count
                FROM " . TABLE_WP_QUICKTASKER_USERS . " AS a
                LEFT JOIN " . TABLE_WP_QUICKTASKER_USER_PAGES . " AS b
                ON a.id = b.user_id
                WHERE a.id = %d AND a.deleted = 0",
                $id
            )
        );
    }

    /**
     * Retrieves users based on task IDs.
     *
     * @param array $taskIds An array of task IDs.
     * @return array The users matching the task IDs.
     */
    public function getAssignedUsersByTaskIds($taskIds) {
        global $wpdb;

        if ( empty($taskIds) ) {
            return [];
        }

        // Prepare the placeholders for the IN clause
        $placeholders = implode(',', array_fill(0, count($taskIds), '%d'));

        $sql = $wpdb->prepare(
            "SELECT a.id, a.name, a.description, a.created_at, a.updated_at, a.is_active, b.task_id
             FROM " . TABLE_WP_QUICKTASKER_USERS . " AS a
             INNER JOIN " . TABLE_WP_QUICKTASKER_USER_TASK . " AS b 
             ON a.id = b.user_id
             WHERE b.task_id IN ($placeholders) AND a.deleted = 0",
            $taskIds
        );

        // Execute the query and get the results
        $results = $wpdb->get_results($sql);

        return $results;
    }

    /**
     * Retrieves the assigned users for a specific task.
     *
     * @param int $taskId The ID of the task.
     * @return array|null The assigned users and their associated page hash, or null if no users are assigned.
     */
    public function getAssignedUsersByTaskId($taskId) {
        global $wpdb;

        $query = $wpdb->prepare(
            "SELECT DISTINCT a.id, a.name, a.description, a.created_at, a.updated_at, a.is_active
             FROM " . TABLE_WP_QUICKTASKER_USERS . " AS a
             INNER JOIN " . TABLE_WP_QUICKTASKER_USER_TASK . " AS b
             ON a.id = b.user_id
             WHERE b.task_id = %d AND a.deleted = 0
             ORDER BY b.created_at DESC",
            $taskId
        );

        $results = $wpdb->get_results($query);

        return $results;
    }

    /**
     * Check if a user is assigned to a specific task.
     *
     * This method checks the database to determine if a user has been assigned to a specific task.
     *
     * @param int $userId The ID of the user.
     * @param int $taskId The ID of the task.
     * @return bool True if the user is assigned to the task, false otherwise.
     */
    public function checkIfUserHasAssignedToTask($userId, $taskId) {
        global $wpdb;

        $result = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM " . TABLE_WP_QUICKTASKER_USER_TASK . " WHERE user_id = %d AND task_id = %d",
                $userId,
                $taskId
            )
        );

        if ($result > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks if a user is active.
     *
     * This function queries the database to determine if a user with the given ID is marked as active.
     *
     * @param int $userId The ID of the user to check.
     * @return bool True if the user is active, false otherwise.
     */
    public function isUserActive($userId) {
        global $wpdb;

        $result = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM " . TABLE_WP_QUICKTASKER_USERS . " WHERE id = %d AND is_active = 1",
                $userId
            )
        );

        if ($result > 0) {
            return true;
        } else {
            return false;
        }
    }
}