<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

global $wpdb;

/*
==================================================================================================================================================================================================================
Directories, URL
==================================================================================================================================================================================================================
*/
define('WP_QUICKTASKER_PLUGIN_FOLDER_DIR', plugin_dir_path( dirname( __FILE__ ) ));
define('WP_QUICKTASKER_PLUGIN_MAIN_FILE', WP_QUICKTASKER_PLUGIN_FOLDER_DIR . 'quicktasker.php');
define('WP_QUICKTASKER_PLUGIN_FOLDER_URL', plugin_dir_url( dirname( __FILE__ ) ));
define('WP_QUICKTASKER_PUBLIC_USER_PAGE_ID', 'wp-quick-tasks-user');

/*
==================================================================================================================================================================================================================
DB constants
==================================================================================================================================================================================================================
*/
define('WP_QUICKTASKER_DB_VERSION', "1.1.0");

define('TABLE_WP_QUICKTASKER_USERS', $wpdb->prefix . "quicktasker_users");
define('TABLE_WP_QUICKTASKER_PIPELINES', $wpdb->prefix . "quicktasker_pipelines");
define('TABLE_WP_QUICKTASKER_PIPELINE_STAGES', $wpdb->prefix . "quicktasker_pipeline_stages");
define('TABLE_WP_QUICKTASKER_TASKS', $wpdb->prefix . "quicktasker_tasks");
define('TABLE_WP_QUICKTASKER_TASKS_LOCATION', $wpdb->prefix . "quicktasker_tasks_location");
define('TABLE_WP_QUICKTASKER_STAGES_LOCATION', $wpdb->prefix . "quicktasker_stages_location");
define('TABLE_WP_QUICKTASKS_LOGS', $wpdb->prefix . "quicktasker_logs");
define('TABLE_WP_QUICKTASKER_COMMENTS', $wpdb->prefix . "quicktasker_comments");
define('TABLE_WP_QUICKTASKER_USER_PAGES', $wpdb->prefix . "quicktasker_user_pages");
define('TABLE_WP_QUICKTASKER_USER_SESSIONS', $wpdb->prefix . "quicktasker_user_sessions");
define('TABLE_WP_QUICKTASKER_USER_TASK', $wpdb->prefix . "quicktasker_user_task");
define('TABLE_WP_QUICKTASKER_CUSTOM_FIELDS', $wpdb->prefix . "quicktasker_custom_fields");
define('TABLE_WP_QUICKTASKER_CUSTOM_FIELDS_VALUES', $wpdb->prefix . "quicktasker_custom_fields_values");

/*
==================================================================================================================================================================================================================
Log constants
==================================================================================================================================================================================================================
*/

define('WP_QT_LOG_TYPE_TASK', "task");
define('WP_QT_LOG_TYPE_PIPELINE', "pipeline");
define('WP_QT_LOG_TYPE_STAGE', "stage");
define('WP_QT_LOG_TYPE_USER', "user");
define('WP_QT_LOG_CREATED_BY_ADMIN', "admin");
define('WP_QT_LOG_CREATED_BY_QUICKTASKER_USER', "quicktasker_user");

/*
==================================================================================================================================================================================================================
Session constants
==================================================================================================================================================================================================================
*/

define('WP_QUICKTASKER_SESSION_LENGHT', DAY_IN_SECONDS);

/*
==================================================================================================================================================================================================================
Nonce constants
==================================================================================================================================================================================================================
*/	
define('WPQT_ADMIN_API_NONCE', "wpqt_api_nonce");
define('WPQT_USER_API_NONCE', "wpqt_user_api_nonce");

/*
==================================================================================================================================================================================================================
Miscellaneous constants
==================================================================================================================================================================================================================
*/
define('WP_QUICKTASKER_INVALID_SESSION_TOKEN', "Invalid session token");
define('WP_QUICKTASKER_SIDE_EFFECT_TRIGGER', "3");

/*
==================================================================================================================================================================================================================
Capabilities constants
==================================================================================================================================================================================================================
*/
define('WP_QUICKTASKER_ADMIN_ROLE', "quicktasker_admin_role"); //Allows access to QuickTasker admin pages and private API GET requests
define('WP_QUICKTASKER_ADMIN_ROLE_ALLOW_DELETE', "quicktasker_admin_role_allow_delete"); //Allows private API DELETE requests