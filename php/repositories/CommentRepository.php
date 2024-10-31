<?php

namespace WPQT\Comment;

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

use WPQT\Task\TaskRepository;

class CommentRepository {

    protected $taskRepository;

    public function __construct() {
        $this->taskRepository = new TaskRepository();
    }
    /**
     * Retrieves a comment by its ID.
     *
     * This function uses the global $wpdb object to query the database for a comment
     * with the specified ID from the TABLE_WP_QUICKTASKER_COMMENTS table.
     *
     * @param int $commentId The ID of the comment to retrieve.
     * @return object|null The comment object if found, null otherwise.
     */
    public function getCommentById($commentId) {
        global $wpdb;

        return $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM " . TABLE_WP_QUICKTASKER_COMMENTS . " WHERE id = %d",
                $commentId
            )
        );

    }

    /**
     * Retrieves comments based on the specified type ID, type, and privacy status.
     *
     * @param int $typeId The ID of the type to filter comments by.
     * @param string $type The type to filter comments by.
     * @param int $isPrivate The privacy status to filter comments by (1 for private, 0 for public).
     * @return array The list of comments matching the specified criteria.
     */
    public function getComments($typeId, $type, $isPrivate) {
        global $wpdb;
    
        $comments_table = TABLE_WP_QUICKTASKER_COMMENTS;
        $users_table = TABLE_WP_QUICKTASKER_USERS;
        $wp_users_table = $wpdb->users;
    
        $query = "
            SELECT comments.*, 
                   CASE 
                       WHEN comments.is_admin_comment = 1 THEN wp_users.display_name 
                       ELSE users.name 
                   END AS author_name
            FROM $comments_table comments
            LEFT JOIN $users_table users ON comments.author_id = users.id AND comments.is_admin_comment = 0
            LEFT JOIN $wp_users_table wp_users ON comments.author_id = wp_users.ID AND comments.is_admin_comment = 1
            WHERE comments.type_id = %d AND comments.type = %s AND comments.is_private = %d
            ORDER BY comments.created_at
        ";
    
        $prepared_query = $wpdb->prepare($query, $typeId, $type, $isPrivate);
    
        return $wpdb->get_results($prepared_query);
    }

    public function getCommentsRelatedtoTasksAssignedToUser($userId) {
        global $wpdb;

        $query = "
            SELECT comments.*, tasks.name AS subject_name, tasks.task_hash AS subject_hash
            FROM " . TABLE_WP_QUICKTASKER_COMMENTS . " AS comments
            JOIN " . TABLE_WP_QUICKTASKER_TASKS . " AS tasks ON comments.type_id = tasks.id
            JOIN " . TABLE_WP_QUICKTASKER_USER_TASK . " AS task_users ON tasks.id = task_users.task_id
            WHERE task_users.user_id = %d
            AND tasks.is_archived = 0
            AND comments.type = 'task'
            AND comments.is_private = 0
         ";

        $comments = $wpdb->get_results($wpdb->prepare($query, $userId));

        return $comments;
    }

    public function getCommentsRelatedToUser($userId) {
        global $wpdb;

        //Fetch comments related to user
        $userComments = $this->getComments($userId, 'user', 0);

        //Fetch comments related to tasks assigned to user
        $tasksComments = $this->getCommentsRelatedtoTasksAssignedToUser($userId);

        return array_merge($userComments, $tasksComments);
    }
    
}