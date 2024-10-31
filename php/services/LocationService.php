<?php
namespace WPQT\Location;

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

class LocationService {

    /**
     * Checks if the current page is a WP Quick Tasks page.
     *
     * @return bool Returns true if the current page is a WP Quick Tasks page, false otherwise.
     */
    public function isWPQTPage() {
        if ( isset($_GET['page']) && $_GET['page'] === 'wp-quick-tasks' ) {
            return true;
        }

        return false;
    }

    /**
     * Checks if the current page is the WP Quick Tasks public user page.
     *
     * @return bool Returns true if the current page is the WP Quick Tasks public user page, false otherwise.
     */
    public function isWPQTPublicUserPage() {
        if ( isset($_GET['page']) && $_GET['page'] === WP_QUICKTASKER_PUBLIC_USER_PAGE_ID && isset($_GET['code']) ) {
            return true;
        }

        return false;
    }

}