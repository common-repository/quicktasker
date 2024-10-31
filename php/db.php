<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}
use WPQT\Pipeline\PipelineRepository;
use WPQT\Pipeline\PipelineService;
use WPQT\Stage\StageService;
use WPQT\Task\TaskService;

function wpqt_set_up_db() {
	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
	global $wpdb;

	$wp_quicktasker_db_current_version = get_option( "wp_quicktasker_db_current_version" );
    $charset_collate = $wpdb->get_charset_collate() . ' ENGINE = innoDB';

	if ( WP_QUICKTASKER_DB_VERSION != $wp_quicktasker_db_current_version ) {

        $sql = "CREATE TABLE " . TABLE_WP_QUICKTASKER_PIPELINES . " (
			id int(11) NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            description text,
			is_primary tinyint(1) DEFAULT 0,
			created_at datetime NOT NULL COMMENT 'UTC',
			updated_at datetime NOT NULL COMMENT 'UTC',
			PRIMARY KEY  (id)
		  ) $charset_collate;";
	  
		dbDelta( $sql );  

        $sql2 = "CREATE TABLE " . TABLE_WP_QUICKTASKER_PIPELINE_STAGES . " (
			id int(11) NOT NULL AUTO_INCREMENT,
            pipeline_id int(11) NOT NULL,
            name varchar(255) NOT NULL,
            description text,
			created_at datetime NOT NULL COMMENT 'UTC',
			updated_at datetime NOT NULL COMMENT 'UTC',
			PRIMARY KEY  (id),
			INDEX (pipeline_id)
		  ) $charset_collate;";
	  
		dbDelta( $sql2 );
          
        $sql3 = "CREATE TABLE " . TABLE_WP_QUICKTASKER_TASKS . " (
			id int(11) NOT NULL AUTO_INCREMENT,
			pipeline_id int(11) NOT NULL,
            name varchar(255) NOT NULL,
            description text,
			is_archived tinyint(1) DEFAULT 0,
			is_done tinyint(1) DEFAULT 0,
			free_for_all tinyint(1) DEFAULT 0,
			created_at datetime NOT NULL COMMENT 'UTC',
			updated_at datetime NOT NULL COMMENT 'UTC',
			task_hash varchar(255) NOT NULL,
			PRIMARY KEY  (id),
			UNIQUE KEY task_hash (task_hash),
			INDEX (pipeline_id),
			INDEX (is_archived)
		  ) $charset_collate;";
	  
		dbDelta( $sql3 ); 

        $sql4 = "CREATE TABLE " . TABLE_WP_QUICKTASKER_USERS . " (
			id int(11) NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            description text,
			created_at datetime NOT NULL COMMENT 'UTC',
			updated_at datetime NOT NULL COMMENT 'UTC',
			is_active tinyint(1) DEFAULT 1,
			password varchar(255) DEFAULT NULL,
			deleted tinyint(1) DEFAULT 0,
			PRIMARY KEY  (id),
			INDEX (deleted)
		  ) $charset_collate;";
	  
		dbDelta( $sql4 ); 

		$sql5 = "CREATE TABLE " . TABLE_WP_QUICKTASKER_TASKS_LOCATION . " (
			id int(11) NOT NULL AUTO_INCREMENT,
            stage_id int(11) NOT NULL,
			task_id int(11) NOT NULL,
			task_order int(11),
			created_at datetime NOT NULL COMMENT 'UTC',
			updated_at datetime NOT NULL COMMENT 'UTC',
			is_archived tinyint(1) DEFAULT 0,
			PRIMARY KEY  (id),
			UNIQUE KEY task_id (task_id),
			INDEX (stage_id),
			INDEX (task_order)
		  ) $charset_collate;";
		
		dbDelta( $sql5 ); 
	  
		$sql6 = "CREATE TABLE " . TABLE_WP_QUICKTASKER_STAGES_LOCATION . " (
			id int(11) NOT NULL AUTO_INCREMENT,
			pipeline_id int(11) NOT NULL,
            stage_id int(11) NOT NULL,
			stage_order int(11),
			created_at datetime NOT NULL COMMENT 'UTC',
			updated_at datetime NOT NULL COMMENT 'UTC',
			PRIMARY KEY  (id),
			UNIQUE KEY stage_id (stage_id),
			INDEX (pipeline_id),
			INDEX (stage_order)
		  ) $charset_collate;";

		dbDelta( $sql6 ); 

		$sql7 = "CREATE TABLE " . TABLE_WP_QUICKTASKS_LOGS . " (
			id int(11) NOT NULL AUTO_INCREMENT,
            text text NOT NULL,
			type_id int(11) DEFAULT NULL,
			type ENUM('task', 'pipeline', 'stage', 'user', 'users') NOT NULL,
			created_by ENUM('system', 'admin', 'quicktasker_user') NOT NULL,
			user_id int(11) DEFAULT NULL,
			created_at datetime NOT NULL COMMENT 'UTC',
			PRIMARY KEY  (id),
			INDEX (type_id),
			INDEX (type),
			INDEX (created_by),
			INDEX (user_id)
		  ) $charset_collate;";

		  dbDelta( $sql7 ); 

		  $sql8 = "CREATE TABLE " . TABLE_WP_QUICKTASKER_COMMENTS . " (
			id int(11) NOT NULL AUTO_INCREMENT,
            text text NOT NULL,
			type_id int(11) NOT NULL,
			type ENUM('task', 'user') NOT NULL,
			is_private tinyint(1) DEFAULT 1,
			created_at datetime NOT NULL COMMENT 'UTC',
			author_id int(11) NOT NULL,
			is_admin_comment tinyint(1) DEFAULT 0,
			PRIMARY KEY  (id),
			INDEX (type_id),
			INDEX (type),
			INDEX (is_private),
			INDEX (author_id),
			INDEX (is_admin_comment)
		  ) $charset_collate;";

		  dbDelta( $sql8 ); 

		  $sql9 = "CREATE TABLE " . TABLE_WP_QUICKTASKER_USER_PAGES . " (
			id int(11) NOT NULL AUTO_INCREMENT,
			user_id int(11) NOT NULL,
			created_at datetime NOT NULL COMMENT 'UTC',
			updated_at datetime NOT NULL COMMENT 'UTC',
			page_hash varchar(255) NOT NULL,
			PRIMARY KEY  (id),
			UNIQUE KEY page_hash (page_hash),
			INDEX (user_id)
		  ) $charset_collate;";

		  dbDelta( $sql9 ); 

		  $sql10 = "CREATE TABLE " . TABLE_WP_QUICKTASKER_USER_SESSIONS . " (
			id int(11) NOT NULL AUTO_INCREMENT,
			session_token varchar(255) NOT NULL,
			user_id int(11) NOT NULL,
			page_hash varchar(255) NOT NULL,
			is_active tinyint(1) DEFAULT 1,
			created_at_utc datetime NOT NULL COMMENT 'UTC',
			expires_at_utc datetime NOT NULL COMMENT 'UTC',
			PRIMARY KEY  (id),
			UNIQUE KEY session_token (session_token),
			INDEX (user_id),
			INDEX (is_active),
			INDEX (created_at_utc),
			INDEX (expires_at_utc)
		  ) $charset_collate;";

		  dbDelta( $sql10 ); 

		  $sql11 = "CREATE TABLE " . TABLE_WP_QUICKTASKER_USER_TASK . " (
			id int(11) NOT NULL AUTO_INCREMENT,
			user_id int(11) NOT NULL,
			task_id int(11) NOT NULL,
			created_at datetime NOT NULL COMMENT 'UTC',
			updated_at datetime NOT NULL COMMENT 'UTC',
			PRIMARY KEY  (id),
			UNIQUE KEY unique_user_task (user_id, task_id),
			INDEX (task_id)
		  ) $charset_collate;";

		  dbDelta( $sql11 );
		  
		  $sql12 = "CREATE TABLE " . TABLE_WP_QUICKTASKER_CUSTOM_FIELDS . " (
			id int(11) NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			description text,
			type ENUM('text', 'select', 'checkbox', 'radio', 'datetime', 'file') NOT NULL,
			entity_type ENUM('task', 'user', 'pipeline', 'users') NOT NULL,
			entity_id int(11) DEFAULT NULL,
			created_at datetime NOT NULL COMMENT 'UTC',
			updated_at datetime NOT NULL COMMENT 'UTC',
			is_deleted tinyint(1) DEFAULT 0,
			PRIMARY KEY  (id),
			INDEX (entity_type),
			INDEX (entity_id),
			INDEX (is_deleted)
		  ) $charset_collate;";

		  dbDelta( $sql12 );

		  $sql13 = "CREATE TABLE " . TABLE_WP_QUICKTASKER_CUSTOM_FIELDS_VALUES . " (
			id int(11) NOT NULL AUTO_INCREMENT,
			custom_field_id int(11) NOT NULL,
			entity_id int(11) NOT NULL,
    		entity_type ENUM('task', 'user') NOT NULL,
			value TEXT,
			created_at datetime NOT NULL COMMENT 'UTC',
			updated_at datetime NOT NULL COMMENT 'UTC',
			PRIMARY KEY  (id),
			INDEX (custom_field_id),
			INDEX (entity_id),
			INDEX (entity_type)
		  ) $charset_collate;";

		  dbDelta( $sql13 );

		update_option( "wp_quicktasker_db_current_version", WP_QUICKTASKER_DB_VERSION );
	}
}

function wpqt_insert_initial_data() {
	global $wpdb;

	$pipeRepo = new PipelineRepository();
	$pipeService = new PipelineService();
	$stageService = new StageService();
	$taskService = new TaskService();
	$transaction_started = false;
	
	try {
		$pipelines = $pipeRepo->getPipelines();

		if( !count($pipelines) ) {
			$wpdb->query('START TRANSACTION');
			$transaction_started = true;

			$newPipeId = $pipeService->createPipeline("QuickTasker Food")->id;
			$pipeService->markPipelineAsPrimary($newPipeId);
			$firstStageId = $stageService->createStage($newPipeId, array('name' => 'Order Received'))->id;
			$secondStageId = $stageService->createStage($newPipeId, array('name' => 'Preparing Order'))->id;
			$thirdStageId = $stageService->createStage($newPipeId, array('name' => 'Out for Delivery'))->id;
			$stageService->createStage($newPipeId, array('name' => 'Delivered'));

			$taskService->createTask($firstStageId, array(
				'name' => 'Order #1001',
				'description' => 'Large pizza and a soda.',
				'pipelineId' => $newPipeId
			));
			$taskService->createTask($firstStageId, array(
				'name' => 'Order #1002',
				'description' => 'Burger and fries.',
				'pipelineId' => $newPipeId
			));
			$taskService->createTask($secondStageId, array(
				'name' => 'Order #1003',
				'description' => 'Tacos and nachos.',
				'pipelineId' => $newPipeId
			));
			$taskService->createTask($thirdStageId, array(
				'name' => 'Order #1004',
				'description' => 'Steak dinner with mashed potatoes.',
				'pipelineId' => $newPipeId
			));

			$wpdb->query('COMMIT');
		}
	} catch (\Throwable $th) {
		if ($transaction_started) {
            $wpdb->query('ROLLBACK');
        }

		//error_log('Error in wpqt_insert_initial_data: ' . $th->getMessage());
	}
}
