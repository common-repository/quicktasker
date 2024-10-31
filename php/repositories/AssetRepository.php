<?php

namespace WPQT\Asset;

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

class AssetRepository {
    public static function getWPQTScriptBildAssets() {
        return require(WP_QUICKTASKER_PLUGIN_FOLDER_DIR . '/build/app.asset.php');
    }
    public static function getWPQTScriptDependencies() {
        $build_asset = require(WP_QUICKTASKER_PLUGIN_FOLDER_DIR . '/build/app.asset.php');
        $dependencies = array_merge(array('wp-element', 'wp-api-fetch'), $build_asset['dependencies']);

        return $dependencies;
    }
}