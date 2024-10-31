<?php

namespace WPQT\User;

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

use WPQT\User\UserRepository;
use WPQT\Hash\HashService;
use WPQT\WPQTException;
use WPQT\Task\TaskRepository;
use WPQT\Time\TimeRepository;

class UserService {
    protected $userRepository;
    protected $taskRepository;
    protected $hashService;
    protected $timeRepository;

    public function __construct() {
        $this->userRepository = new UserRepository();
        $this->hashService = new HashService();
        $this->taskRepository = new TaskRepository();
        $this->timeRepository = new TimeRepository();
    }

    /**
     * Creates a new user.
     *
     * @param array $args The user data.
     * @return User The newly created user.
     * @throws Exception If failed to create a user or user page.
     */
    public function createUser($args) {
        global $wpdb;

        $result = $wpdb->insert(
            TABLE_WP_QUICKTASKER_USERS,
            array(
                'name' => $args['name'],
                'description' => $args['description'],
                'created_at' => $this->timeRepository->getCurrentUTCTime(),
                'updated_at' => $this->timeRepository->getCurrentUTCTime(),
            ),
            array('%s', '%s', '%s', '%s')
        );

        if (!$result) {
            throw new Exception('Failed to create a user');
        }

        $newUserId = $wpdb->insert_id;
        $pageHash = $this->hashService->generateUserPageHash($args['name']);

        $result2 = $wpdb->insert(
            TABLE_WP_QUICKTASKER_USER_PAGES,
            array(
                'user_id' => $newUserId,
                'page_hash' => $pageHash,
                'created_at' => $this->timeRepository->getCurrentUTCTime(),
                'updated_at' => $this->timeRepository->getCurrentUTCTime(),
            ),
            array('%d', '%s', '%s', '%s')
        );

        if (!$result2) {
            throw new \Exception('Failed to create a user page');
        }

        return $this->userRepository->getUserById($newUserId);
    }

    /**
     * Updates a user's information.
     *
     * @param int $userId The ID of the user to be updated.
     * @param array $args The updated user data.
     *   - 'name' (string) The new name of the user.
     *   - 'description' (string) The new description of the user.
     * @return User The updated user object.
     * @throws Exception If the update operation fails.
     */
    public function editUser($userId, $args) {
        global $wpdb;

        $result = $wpdb->update(
            TABLE_WP_QUICKTASKER_USERS,
            array(
                'name' => $args['name'],
                'description' => $args['description'],
                'updated_at' => $this->timeRepository->getCurrentUTCTime(),
            ),
            array('id' => $userId),
            array('%s', '%s', '%s'),
            array('%d')
        );

        if ($result === false) {
            throw new \Exception('Failed to update a user');
        }

        return $this->userRepository->getUserById($userId);
    }

    /**
     * Change the status of a user.
     *
     * @param int $userId The ID of the user.
     * @param boolean $status The new status of the user.
     * @return User The updated user object.
     * @throws Exception If failed to disable a user.
     */
    public function changeUserStatus($userId, $status) {
        global $wpdb;

        $result = $wpdb->update(
            TABLE_WP_QUICKTASKER_USERS,
            array(
                'is_active' => $status,
                'updated_at' => $this->timeRepository->getCurrentUTCTime(),
            ),
            array('id' => $userId),
            array('%d', '%s'),
        );

        if (!$result) {
            throw new \Exception('Failed to disable a user');
        }

        return $this->userRepository->getUserById($userId);
    }

    /**
     * Deletes a user.
     *
     * @param int $userId The ID of the user to delete.
     * @return bool True if the user was successfully deleted, false otherwise.
     * @throws Exception If the user deletion fails.
     */
    public function deleteUser($userId) {
        global $wpdb;

        $result = $wpdb->update(
            TABLE_WP_QUICKTASKER_USERS,
            array(
                'deleted' => 1,
                'updated_at' => $this->timeRepository->getCurrentUTCTime(),
            ),
            array('id' => $userId),
            array('%d', '%s')
        );

        if (!$result) {
            throw new \Exception('Failed to delete a user');
        }

        return $this->userRepository->getUserById($userId);
    }

    /**
     * Check if a user has a password.
     *
     * @param int $userId The ID of the user.
     * @return bool Returns true if the user has a password, false otherwise.
     */
    public function checkIfUserHasPassword($userId) {
        global $wpdb;

        $result = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM " . TABLE_WP_QUICKTASKER_USERS . " WHERE id = %d AND password IS NOT NULL",
                $userId
            )
        );

        if ($result > 0) {
            return true;
        } else {
            return false;
        }
    }


    /**
     * Assigns a task to a user.
     *
     * This method inserts a record into the `TABLE_WP_QUICKTASKER_USER_TASK` table
     * to associate a user with a task. If the insertion fails, an exception is thrown.
     *
     * @param int $userId The ID of the user to whom the task is being assigned.
     * @param int $taskId The ID of the task being assigned to the user.
     * @return mixed The task details retrieved from the task repository.
     * @throws \Exception If the task assignment fails.
     */
    public function assignTaskToUser($userId, $taskId) {
        global $wpdb;

        $result = $wpdb->insert(
            TABLE_WP_QUICKTASKER_USER_TASK,
            array(
                'user_id' => $userId,
                'task_id' => $taskId,
                'created_at' => $this->timeRepository->getCurrentUTCTime(),
                'updated_at' => $this->timeRepository->getCurrentUTCTime(),
            ),
            array('%d', '%d', '%s', '%s')
        );

        if (!$result) {
            throw new \Exception('Failed to assign a task to a user');
        }

        return $this->taskRepository->getTaskById($taskId);
    }


    /**
     * Removes a task from a user.
     *
     * This function deletes the association between a user and a task in the database.
     *
     * @param int $userId The ID of the user.
     * @param int $taskId The ID of the task.
     * @return mixed The task details after removal.
     * @throws \Exception If the task could not be removed from the user.
     */
    public function removeTaskFromUser($userId, $taskId) {
        global $wpdb;

        $result = $wpdb->delete(
            TABLE_WP_QUICKTASKER_USER_TASK,
            array(
                'user_id' => $userId,
                'task_id' => $taskId,
            ),
            array('%d', '%d')
        );

        if (!$result) {
            throw new \Exception('Failed to remove a user from a task');
        }

        return $this->taskRepository->getTaskById($taskId);
    }



    /**
     * Resets the password for a given user.
     *
     * This method will set the user's password to null and update the 
     * 'updated_at' timestamp to the current UTC time. It will also delete 
     * all sessions associated with the user.
     *
     * @param int $userId The ID of the user whose password is to be reset.
     * @throws \Exception If the user does not have a password set or if the 
     *                    password reset or session deletion fails.
     * @return mixed The user object after the password reset.
     */
    public function resetUserPassword($userId) {
        global $wpdb;

        $hasPassword = $this->checkIfUserHasPassword($userId);

        if (!$hasPassword) {
            throw new \Exception('Cannot reset user password if it is not set');
        }

        $result = $wpdb->update(
            TABLE_WP_QUICKTASKER_USERS,
            array(
                'password' => null,
                'updated_at' => $this->timeRepository->getCurrentUTCTime(),
            ),
            array('id' => $userId),
            array('%s', '%s'),
            array('%d')
        );

        if (!$result) {
            throw new \Exception('Failed to reset a user password');
        }

        $result2 = $wpdb->delete(
            TABLE_WP_QUICKTASKER_USER_SESSIONS,
            array('user_id' => $userId)
        );

        if ($result2 === false) {
            throw new \Exception('Failed to reset a user sessions');
        }

        return $this->userRepository->getUserById($userId);
    }
}