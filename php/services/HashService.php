<?php

namespace WPQT\Hash;

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

class HashService {

    /**
     * Generates a hash for a user page.
     *
     * This function generates a 16-character hash using the MD5 algorithm.
     * The hash is created by combining the current microtime with a provided salt.
     *
     * @param string $salt A string used to salt the hash.
     * @return string A 16-character hash.
     */
    public function generateUserPageHash($salt) {
        return substr(md5(microtime() . $salt), 0, 16);
    }

    /**
     * Generates a hash for a given task.
     *
     * This function creates a 16-character hash by concatenating the task ID, 
     * the current microtime, and a provided salt, then applying the MD5 hash 
     * function and taking the first 16 characters of the result.
     *
     * @param string $salt A salt value to add additional randomness to the hash.
     * @return string A 16-character hash string.
     */
    public function generateTaskHash($salt) {
        return substr(md5(microtime() . $salt), 0, 16);
    }
}