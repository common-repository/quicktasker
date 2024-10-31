<?php
namespace WPQT\Nonce;

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

use WPQT\WPQTException;

class NonceService {
    public static function createNonce($nonceName) {
        return wp_create_nonce($nonceName);
    }

    public static function verifyNonce($nonce, $nonceName) {
        if(!isset($nonce)) {
            throw new WPQTException('Nonce not provided', true);        
        }
        if( !wp_verify_nonce($nonce, $nonceName) ) {
            throw new WPQTException('Nonce verification failed', true);
        }
        return true;
    }
}