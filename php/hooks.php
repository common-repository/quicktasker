<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

use WPQT\Capability\CapabilityService;

register_activation_hook( WP_QUICKTASKER_PLUGIN_MAIN_FILE, 'wpqt_plugin_activate' );
function wpqt_plugin_activate() {
	$capabilityService = new CapabilityService();
	$capabilityService->addQuickTaskerAdminCapabilityToAdminRole();
	
	wpqt_set_up_db();
	wpqt_insert_initial_data();
}

register_deactivation_hook( WP_QUICKTASKER_PLUGIN_MAIN_FILE, 'wpqt_plugin_deactivate' );
function wpqt_plugin_deactivate() {
	$capabilityService = new CapabilityService();
	$capabilityService->removeQuickTaskerAdminCapabilityFromAdminRole();
}