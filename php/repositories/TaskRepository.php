<?php
namespace WPQT\Task;

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

use WPQT\User\UserRepository;

class TaskRepository {

    protected $userRepository;

    public function __construct() {
        $this->userRepository = new UserRepository();
    }

    /**
     * Retrieves all tasks from the database.
     *
     * @return array The array of tasks retrieved from the database.
     */
    public function getTasks() {
        global $wpdb;
    
        return $wpdb->get_results(
            "SELECT * FROM " . TABLE_WP_QUICKTASKER_TASKS
        );
    }


    /**
     * Retrieves archived tasks from the database.
     *
     * This function fetches tasks that are marked as archived from the database.
     * Optionally, it can also fetch and include the users assigned to each task.
     *
     * @param bool $addAssignedUsers Optional. Whether to include assigned users for each task. Default false.
     * @return array An array of archived tasks. Each task may include assigned users if $addAssignedUsers is true.
     */
    public function getArchivedTasks($addAssignedUsers = false) {
        global $wpdb;

        $tasks = $wpdb->get_results($wpdb->prepare(
           "SELECT a.*, b.task_order, b.stage_id, c.name as pipeline_name
            FROM ". TABLE_WP_QUICKTASKER_TASKS . " AS a
            LEFT JOIN ". TABLE_WP_QUICKTASKER_TASKS_LOCATION ." AS b ON a.id = b.task_id
            LEFT JOIN " . TABLE_WP_QUICKTASKER_PIPELINES . " AS c ON a.pipeline_id = c.id
            WHERE a.is_archived = 1"
        ));
    
        if ($addAssignedUsers) {
            foreach ($tasks as $task) {
                $users = $this->userRepository->getAssignedUsersByTaskId($task->id);
                $task->assigned_users = $users;
            }
        }
    
        return $tasks;
    }

    /**
     * Retrieves a task by its ID.
     *
     * @param int $id The ID of the task to retrieve.
     * @param bool $addAssignedUsers Whether to include assigned users in the task object.
     * @return object|null The task object if found, null otherwise.
     */
    public function getTaskById($id, $addAssignedUsers = false) {
        global $wpdb;

        $task = $wpdb->get_row( $wpdb->prepare(
            "SELECT a.*, b.task_order, b.stage_id FROM ". TABLE_WP_QUICKTASKER_TASKS . " AS a
            LEFT JOIN ". TABLE_WP_QUICKTASKER_TASKS_LOCATION ." AS b
            ON a.id = b.task_id
            WHERE a.id = %d",
            $id
        ) );

        if ( $task && $addAssignedUsers) {
            $users = $this->userRepository->getAssignedUsersByTaskId($task->id);
            $task->assigned_users = $users;
        }

        return $task;
    }

    /**
     * Retrieves a task by its hash value.
     *
     * This function fetches a task from the database using the provided hash value.
     * Optionally, it can also fetch and include the users assigned to the task.
     *
     * @param string $hash The hash value of the task to retrieve.
     * @param bool $addAssignedUsers Optional. Whether to include assigned users in the result. Default false.
     * @return object|null The task object if found, null otherwise. If $addAssignedUsers is true, the task object will include an 'assigned_users' property containing the assigned users.
     */
    public function getTaskByHash($hash, $addAssignedUsers = false) {
        global $wpdb;

        $task = $wpdb->get_row( $wpdb->prepare(
            "SELECT a.*, b.task_order, b.stage_id, c.name as pipeline_name FROM ". TABLE_WP_QUICKTASKER_TASKS . " AS a
            LEFT JOIN ". TABLE_WP_QUICKTASKER_TASKS_LOCATION ." AS b ON a.id = b.task_id
            LEFT JOIN " . TABLE_WP_QUICKTASKER_PIPELINES . " AS c ON a.pipeline_id = c.id
            WHERE a.task_hash = %s",
            $hash
        ) );

        if ( $task && $addAssignedUsers) {
            $users = $this->userRepository->getAssignedUsersByTaskId($task->id);
            $task->assigned_users = $users;
        }

        return $task;
    }

    /**
     * Retrieves tasks by stage ID.
     *
     * @param int $stageId The ID of the stage.
     * @return array The array of tasks retrieved from the database.
     */
    public function getTasksByStageId($stageId) {
        global $wpdb;

        return $wpdb->get_results( $wpdb->prepare(
            "SELECT a.*, b.task_order, b.stage_id FROM ". TABLE_WP_QUICKTASKER_TASKS . " AS a
            LEFT JOIN ". TABLE_WP_QUICKTASKER_TASKS_LOCATION ." AS b
            ON a.id = b.task_id
            WHERE b.stage_id = %d
            AND a.is_archived = 0
            ORDER BY b.task_order",
            $stageId
        ) );
    }

    /**
     * Retrieves the task order based on the task ID and stage ID.
     *
     * @param int $taskId The ID of the task.
     * @param int $stageId The ID of the stage.
     * @return object|null The task order object if found, null otherwise.
     */
    public function getTaskOrder($taskId, $stageId) {
        global $wpdb;

        return $wpdb->get_row( $wpdb->prepare(
            "SELECT * FROM ". TABLE_WP_QUICKTASKER_TASKS_LOCATION ."
            WHERE task_id = %d AND stage_id = %d",
            $taskId,
            $stageId
        ) );
    }

    /**
     * Retrieves tasks by their stage IDs.
     *
     * This function fetches tasks from the database that are associated with the given stage IDs.
     * It joins the tasks table with the tasks location table to get the stage IDs and orders the results by task order.
     *
     * @param array $stageIds An array of stage IDs to filter the tasks.
     * @return array An array of task objects that match the given stage IDs.
     */
    public function getTasksByStageIds($stageIds) {
        global $wpdb;

        if ( empty($stageIds) ) {
            return [];
        }

        // Prepare the placeholders for the IN clause
        $placeholders = implode(',', array_fill(0, count($stageIds), '%d'));

        // Prepare the SQL query
        $sql = $wpdb->prepare(
            "SELECT a.*, b.stage_id 
             FROM " . TABLE_WP_QUICKTASKER_TASKS . " AS a
             INNER JOIN " . TABLE_WP_QUICKTASKER_TASKS_LOCATION . " AS b
             ON a.id = b.task_id
             WHERE b.stage_id IN ($placeholders)
             AND a.is_archived = 0
             ORDER BY b.task_order",
            $stageIds
        );

        // Execute the query and get the results
        $results = $wpdb->get_results($sql);

        return $results;
    }

    /**
     * Retrieves tasks assigned to a specific user.
     *
     * @param int $userId The ID of the user.
     * @return array The tasks assigned to the user.
     */
    public function getTasksAssignedToUser($userId, $addAssignedUsers = false) {
        global $wpdb;
    
        $tasks = $wpdb->get_results($wpdb->prepare(
            "SELECT b.*, c.name as pipeline_name FROM " . TABLE_WP_QUICKTASKER_USER_TASK . " AS a
            LEFT JOIN " . TABLE_WP_QUICKTASKER_TASKS . " AS b ON a.task_id = b.id
            LEFT JOIN " . TABLE_WP_QUICKTASKER_PIPELINES . " AS c ON b.pipeline_id = c.id
            WHERE a.user_id = %d
            AND b.is_archived = 0
            ORDER BY b.created_at DESC",
            $userId
        ));
    
        if ($addAssignedUsers) {
            foreach ($tasks as $task) {
                $users = $this->userRepository->getAssignedUsersByTaskId($task->id);
                $task->assigned_users = $users;
            }
        }
    
        return $tasks;
    }

    /**
     * Retrieves tasks that are assignable to a specific user.
     *
     * @param int $userId The ID of the user.
     * @return array The list of tasks that are assignable to the user.
     */
    public function getTasksAssignableToUser($userId) {
        global $wpdb;
    
        return $wpdb->get_results( $wpdb->prepare(
            "SELECT a.*, c.name as pipeline_name FROM ". TABLE_WP_QUICKTASKER_TASKS . " AS a
            LEFT JOIN " . TABLE_WP_QUICKTASKER_USER_TASK . " AS b ON a.id = b.task_id
            LEFT JOIN " . TABLE_WP_QUICKTASKER_PIPELINES . " AS c ON a.pipeline_id = c.id
           
            WHERE b.task_id IS NULL AND a.is_archived = 0 AND a.free_for_all = 1 ORDER BY a.created_at DESC",
        ) );
    }
}