<?php
namespace WPQT\Password;

use WPQT\Password\PasswordRepository;

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

class PasswordService {
    protected $passwordRepository;

    public function __construct() {
        $this->passwordRepository = new PasswordRepository();
    }

    /**
     * Creates a password hash using the default algorithm.
     *
     * @param string $password The password to be hashed.
     * @return string The hashed password.
     */
    public function createPasswordHash($password) {
        return password_hash($password, PASSWORD_DEFAULT);
    }

    /**
     * Verifies the password against the stored password.
     *
     * @param string $pageHash The hash of the user page.
     * @param string $password The password to be verified.
     * @return bool Returns true if the password is verified, otherwise throws an exception.
     * @throws Exception Throws an exception if failed to retrieve the stored password.
     */
    public function verifyPassword($pageHash, $password) {
        $storedPassword = $this->passwordRepository->getUserPagePasswordByHash($pageHash);

        if( !$storedPassword ) {
            throw new \Exception('Failed to retrieve stored password');
        }

        return password_verify($password, $storedPassword);
    }

    /**
     * Stores the password for a user.
     *
     * @param int $userId The ID of the user.
     * @param string $password The password to be stored.
     * @return bool Returns true if the password is successfully stored, otherwise throws an exception.
     * @throws Exception Throws an exception if failed to store the password.
     */
    public function storePassword($userId, $password) {
        global $wpdb;

        $passwordHash = $this->createPasswordHash($password);
       
        $rowsUpdated = $wpdb->update(
            TABLE_WP_QUICKTASKER_USERS,
            array(
                'password' => $passwordHash,
            ),
            array(
                'id' => $userId
            )
        );

        if( $rowsUpdated === false ) {
            throw new \Exception('Failed to store password');
        }

        return true;
    }
}