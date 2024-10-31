<?php
namespace WPQT\Permission;

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

use WPQT\Task\TaskRepository;
use WPQT\User\UserRepository; 

class PermissionService {
    protected $userRepository;
    protected $taskRepository;

    public function __construct() {
        $this->userRepository = new UserRepository();
        $this->taskRepository = new TaskRepository();
    }
    /**
     * Checks if the current user has the required permissions to access the private API.
     *
     * @return bool Returns true if the current user has the required permissions, false otherwise.
     */
    public static function hasRequiredPermissionsForPrivateAPI() {
        return current_user_can( WP_QUICKTASKER_ADMIN_ROLE );
    }

    /**
     * Checks if the current user has the required permissions to access public API delete endpoints.
     *
     * This function verifies if the current user has the necessary permissions defined by the 
     * WP_QUICKTASKER_ADMIN_ROLE_ALLOW_DELETE capability.
     *
     * @return bool True if the user has the required permissions, false otherwise.
     */
    public static function hasRequiredPermissionsForPublicAPIDeleteEndpoints() {
        return current_user_can( WP_QUICKTASKER_ADMIN_ROLE_ALLOW_DELETE );
    }

    /**
     * Checks if a user is allowed to view a task.
     *
     * @param int $userId The ID of the user.
     * @param int $taskId The ID of the task.
     * @return bool Returns true if the user is allowed to view the task, false otherwise.
     */
    public function checkIfUserIsAllowedToViewTask($userId, $taskId) {
        global $wpdb;

        $task = $this->taskRepository->getTaskById($taskId);
        if($task->is_archived === '1') {
            return false;
        }

        $assignedUsers = $this->userRepository->getAssignedUsersByTaskId($taskId);
        $isAssignedToTask = false;

        foreach ($assignedUsers as $user) {
            if ($user->id === $userId) {
                $isAssignedToTask = true;
                break;
            }
        }

        if ($isAssignedToTask === true || ($task->free_for_all === '1' && count($assignedUsers) === 0) ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks if a user can be assigned to a specific task.
     *
     * This method verifies whether a user can be assigned to a task based on the task's
     * properties and the current assigned users. If the task is marked as 'free for all'
     * and there are no users currently assigned, the user can be assigned to the task.
     *
     * @param int $userId The ID of the user to check.
     * @param int $taskId The ID of the task to check.
     * @return bool True if the user can be assigned to the task, false otherwise.
     */
    public function checkIfUserCanBeAssignedToTask($userId, $taskId) {
        global $wpdb;

        $task = $this->taskRepository->getTaskById($taskId);
        if($task->is_archived === '1') {
            return false;
        }
        $assignedUsers = $this->userRepository->getAssignedUsersByTaskId($taskId);
        

        if ($task->free_for_all === '1' && count($assignedUsers) === 0) {
            return true;
        } else {
            return false;
        }

    }

    /**
     * Check if a user is allowed to edit a task.
     *
     * @param int $userId The ID of the user.
     * @param int $taskId The ID of the task.
     * @return bool Returns true if the user is allowed to edit the task, false otherwise.
     */
    public function checkIfUserIsAllowedToEditTask($userId, $taskId) {
        global $wpdb;

        $task = $this->taskRepository->getTaskById($taskId);
        if($task->is_archived === '1') {
            return false;
        }

        $isAssignedToUser = $this->userRepository->checkIfUserHasAssignedToTask($userId, $taskId);

        if ($isAssignedToUser === true) {
            return true;
        } else {
            return false;
        }
    }
}