<?php
namespace WPQT\UserPage;

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

class UserPageRepository {

    /**
     * Retrieves a user page by its hash.
     *
     * @param string $pageHash The hash of the user page.
     * @return object|null The user page object if found, null otherwise.
     */
    public function getUserPageByHash($pageHash) {
        global $wpdb;

        return $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM " . TABLE_WP_QUICKTASKER_USER_PAGES . " WHERE page_hash = %s",
                $pageHash
            )
        );
    }

    /**
     * Retrieves a user by its page hash.
     *
     * @param string $pageHash The hash of the user page.
     * @return object|null The user object if found, null otherwise.
     */
    public function getPageUserByHash($pageHash) {
        global $wpdb;

        return $wpdb->get_row(
            $wpdb->prepare(
                "SELECT a.id, a.name, a.description, a.created_at, a.updated_at, a.is_active, b.page_hash, b.user_id FROM " . TABLE_WP_QUICKTASKER_USERS . " AS a 
                LEFT JOIN " . TABLE_WP_QUICKTASKER_USER_PAGES . " AS b
                ON a.id = b.user_id 
                WHERE b.page_hash = %s",
                $pageHash
            )
        );
    }

}