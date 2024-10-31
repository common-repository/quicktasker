<?php
namespace WPQT\Session;

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

class SessionRepository{

    /**
     * Retrieves the user session based on the session token.
     *
     * @param string $sessionToken The session token to retrieve the user session.
     * @return object|null The user session object if found, null otherwise.
     */
    public function getUserSession($sessionToken){
        global $wpdb;

        return $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM " . TABLE_WP_QUICKTASKER_USER_SESSIONS . " WHERE session_token = %s",
                $sessionToken
            )
        );
    }

    /**
     * Retrieves the active user session based on the provided session token.
     *
     * @param string $sessionToken The session token used to identify the active user session.
     * @return object|null The active user session object if found, null otherwise.
     */
    public function getActiveUserSession($sessionToken){
        global $wpdb;

        return $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM " . TABLE_WP_QUICKTASKER_USER_SESSIONS . " WHERE session_token = %s AND is_active = 1",
                $sessionToken
            )
        );
    }
    /**
     * Retrieves a user session by its ID.
     *
     * @param int $sessionId The ID of the session to retrieve.
     * @return object|null The session object if found, null otherwise.
     */
    public function getUserSessionById($sessionId){
        global $wpdb;

        return $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM " . TABLE_WP_QUICKTASKER_USER_SESSIONS . " WHERE id = %d",
                $sessionId
            )
        );
    }

    /**
     * Retrieves user sessions from the database.
     *
     * This function queries the database to fetch all user sessions, including
     * the session ID, user ID, page hash, creation time (UTC), and expiration time (UTC).
     *
     * @global wpdb $wpdb WordPress database abstraction object.
     *
     * @return array|null List of user sessions or null if no sessions are found.
     */
    public function getUserSessions(){
        global $wpdb;

        return $wpdb->get_results(
            "SELECT a.id, a.user_id, a.created_at_utc, a.expires_at_utc, a.is_active, b.name AS user_name, b.description AS user_description FROM " . TABLE_WP_QUICKTASKER_USER_SESSIONS . " AS a
            INNER JOIN " . TABLE_WP_QUICKTASKER_USERS . " AS b 
            ON a.user_id = b.id ORDER BY a.created_at_utc DESC"
        );
    }
}