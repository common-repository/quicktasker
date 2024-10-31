<?php

/*
	Plugin Name: QuickTasker
	Description: Task management plugin to get tasks done with the help of assigned users.
	Author: Siim Kirjanen
	Author URI: https://github.com/SiimKirjanen
	Text Domain: quicktasker
	Domain Path: /languages
	Version: 1.7.0
	Requires at least: 5.3
	Requires PHP: 7.2.28
	License: GPLv2 or later
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

require( 'php/constants.php' );
require( 'php/db.php' );
require( 'php/response/ApiResponse.php' );
require( 'php/exeptions/WPQTExeption.php' );
require( 'php/repositories/PipelineRepository.php' );
require( 'php/repositories/TaskRepository.php' );
require( 'php/repositories/StageRepository.php' );
require( 'php/repositories/LogRepository.php' );
require( 'php/repositories/CommentRepository.php' );
require( 'php/repositories/UserRepository.php' );
require( 'php/repositories/UserPageRepository.php' );
require( 'php/repositories/PasswordRepository.php' );
require( 'php/repositories/SessionRepository.php' );
require( 'php/repositories/CustomFieldRepository.php' );
require( 'php/repositories/TimeRepository.php' );
require( 'php/repositories/AssetRepository.php' );
require( 'php/services/PipelineService.php' );
require( 'php/services/PermissionService.php' );
require( 'php/services/StageService.php' );
require( 'php/services/TaskService.php' );
require( 'php/services/LocationService.php' );
require( 'php/services/LogService.php' );
require( 'php/services/UserService.php' );
require( 'php/services/HashService.php' );
require( 'php/services/UserPageService.php' );
require( 'php/services/PasswordService.php' );
require( 'php/services/SessionService.php' );
require( 'php/services/NonceService.php' );
require( 'php/services/CommentService.php' );
require( 'php/services/CustomFieldService.php' );
require( 'php/services/CapabilityService.php' );
require( 'php/services/RequestValidation.php' );
require( 'php/hooks.php' );
require( 'php/actions.php' );
require( 'php/filters.php' );
require( 'php/api/admin-api.php' );
require( 'php/api/user-page-api.php' );
require( 'php/side-effects.php' );

if( is_admin() ) {
	require( 'php/admin-pages.php' );
	require( 'php/enqueue-admin.php' );	
}

if( !is_admin() ) {
	require( 'php/enqueue-user-page-public.php' );
}