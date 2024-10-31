<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

use WPQT\Location\LocationService;
/**
 * Adds a filter to modify the admin body class.
 *
 * This function is hooked to the 'admin_body_class' filter.
 * It checks if the current page is a WP Quick Tasks page and adds the 'wpqt-admin-page' class to the body class.
 * Useful for scoping styles to WP Quick Tasks pages.
 *
 * @param array $classes The array of body classes.
 * @return array The modified array of body classes.
 */
add_filter( 'admin_body_class', 'wpqt_admin_body_class' );
function wpqt_admin_body_class($classes) {
    $locationService = new LocationService();

	if( $locationService->isWPQTPage() ) {
		return "$classes wpqt-admin-page"; 
	}

	return $classes;
}

/**
 * This function is a filter callback for the 'template_include' hook.
 * It checks if the current page is a WP Quick Tasks public user page and sets the page template accordingly.
 *
 * @param string $page_template The current page template.
 * @return string The updated page template.
 */
add_filter( 'template_include', 'wpqt_public_user_page_template' );
function wpqt_public_user_page_template( $page_template ){
	$locationService = new LocationService();

    if ( $locationService->isWPQTPublicUserPage() ) {
        $page_template = WP_QUICKTASKER_PLUGIN_FOLDER_DIR . '/src/user-page-app/index.php';
    }

    return $page_template;
}