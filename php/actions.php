<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}
use WPQT\Location\LocationService;
use WPQT\Asset\AssetRepository;

/**
 * Hook into 'plugins_loaded' action to update the database.
 *
 * This function is hooked to the 'plugins_loaded' action and is responsible for
 * calling the wpqt_set_up_db() function to set up or update the database.
 *
 * @return void
 */
add_action('template_redirect', 'wpqt_custom_http_status_code');
function wpqt_custom_http_status_code() {
	$locationService = new LocationService();

    if ( $locationService->isWPQTPublicUserPage() ) {
		global $wp_query;
        $wp_query->is_404 = false;
        status_header(200);
    }
}

/**
 * Removes unnecessary tags and scripts from the WordPress header and footer for public user pages.
 *
 * This function performs the following actions:
 * - Removes WordPress emoji scripts and styles.
 * - Removes various tags from the WordPress header, including RSD link, WordPress generator, feed links, and more.
 * - Disables hreflang type for MultilingualPress.
 * - Removes the skip link script from the footer.
 * - Dequeues block library and global styles inline CSS.
 *
 * The function is hooked to the 'after_setup_theme' action and only executes if the current page is a public user page as determined by the LocationService.
 *
 * @return void
 */
add_action( 'after_setup_theme', 'wpqt_remove_unnecessary_tags_and_more' );
function wpqt_remove_unnecessary_tags_and_more(){
    $locationService = new LocationService();

	if( $locationService->isWPQTPublicUserPage()  ) {
		 // REMOVE WP EMOJI
		 remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
         remove_action( 'wp_print_styles', 'print_emoji_styles' );
         remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		 remove_action( 'admin_print_styles', 'print_emoji_styles' );
	 
		 // remove all tags from header
		 remove_action( 'wp_head', 'rsd_link' );
		 remove_action( 'wp_head', 'wp_generator' );
		 remove_action( 'wp_head', 'feed_links', 2 );
		 remove_action( 'wp_head', 'index_rel_link' );
		 remove_action( 'wp_head', 'wlwmanifest_link' );
		 remove_action( 'wp_head', 'feed_links_extra', 3 );
		 remove_action( 'wp_head', 'start_post_rel_link', 10, 0 );
		 remove_action( 'wp_head', 'parent_post_rel_link', 10, 0 );
		 remove_action( 'wp_head', 'adjacent_posts_rel_link', 10, 0 );
		 remove_action( 'wp_head', 'wp_shortlink_wp_head', 10, 0 );
		 remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0 );
		 remove_action( 'wp_head', 'rest_output_link_wp_head' );
		 remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );
		 remove_action( 'template_redirect', 'rest_output_link_header', 11 );
	 
		 // language
		 add_filter( 'multilingualpress.hreflang_type', '__return_false' );

         // Remove skip link script
         remove_action( 'wp_footer', 'the_block_template_skip_link' );

		 // Remove block library inline CSS
		 add_action( 'wp_enqueue_scripts', function() {
            wp_dequeue_style( 'wp-block-library' );
			wp_dequeue_style( 'global-styles' );
        }, 100 );
	}
}

/**
 * Hooks into the 'wp_print_scripts' action to include allowed scripts.
 *
 * This function checks if the current page is a WPQT public user page. If it is,
 * it retrieves the script dependencies from the AssetRepository and merges them
 * with the 'wpqt-script'. The resulting array of allowed scripts is then set to
 * the global $wp_scripts queue.
 *
 * @return void
 */
add_action('wp_print_scripts', 'wpqt_include_allowed_scripts', PHP_INT_MAX);
function wpqt_include_allowed_scripts() {
	$locationService = new LocationService();

	if( $locationService->isWPQTPublicUserPage() ) {
		global $wp_scripts;

		$dependencies = AssetRepository::getWPQTScriptDependencies();
		$allowedToLoad = array_merge($dependencies, array('wpqt-script'));
		$wp_scripts->queue = $allowedToLoad;
	}
}