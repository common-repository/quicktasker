<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

use WPQT\User\UserRepository;
use WPQT\Time\TimeRepository;
use WPQT\Asset\AssetRepository;
use WPQT\Nonce\NonceService;
use WPQT\Location\LocationService;
use WPQT\Pipeline\PipelineRepository;

add_action( 'wp_enqueue_scripts', 'wpqt_enqueue_user_public_page' );
function wpqt_enqueue_user_public_page(){
	$locationService = new LocationService();
	$timeRepository = new TimeRepository();

	if( !$locationService->isWPQTPublicUserPage() ) {
		return;
	}

	$pipelineRepo = new PipelineRepository();
	$userRepo = new UserRepository();

	$build_asset = AssetRepository::getWPQTScriptBildAssets();
	$dependencies = AssetRepository::getWPQTScriptDependencies();

	wp_enqueue_style( 'wpqt-tailwind', WP_QUICKTASKER_PLUGIN_FOLDER_URL . 'build/tailwind.css');
    wp_enqueue_script('wpqt-script', WP_QUICKTASKER_PLUGIN_FOLDER_URL . 'build/userApp.js', $dependencies, $build_asset['version'], true);

	wp_localize_script('wpqt-script', 'wpqt_user', array(
		'userApiNonce' => NonceService::createNonce( WPQT_USER_API_NONCE ),
		'siteURL' => site_url(),
		'pluginURL' => WP_QUICKTASKER_PLUGIN_FOLDER_URL,
		'timezone' => $timeRepository->getWPTimezone(),
	));

    wp_enqueue_style( 'wpqt-user-page-font', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap', array(), null );

	// Set script translations
    wp_set_script_translations( 'wpqt-script', 'quicktasker', WP_QUICKTASKER_PLUGIN_FOLDER_DIR . 'languages/json' );

	wp_add_inline_style('wpqt-tailwind', '
	 	html {
            margin-top: 0 !important;
        }
        #wpadminbar {
            display: none;
        }
    ');
}
