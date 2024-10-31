<?php
namespace WPQT;

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

use WPQT\Nonce\NonceService;
use WPQT\WPQTException;
use WPQT\UserPage\UserPageService;
use WPQT\Session\SessionService;
use WPQT\User\UserRepository;

class RequestValidation {

    /**
     * Validates the user page API request.
     *
     * This method validates the incoming request data based on the provided arguments.
     * It checks for nonce, hash, and session validity.
     *
     * @param object $data The request data object.
     * @param array $args Optional. An array of arguments to control the validation process.
     *                    Default values:
     *                    - 'nonce' => true (validates the nonce)
     *                    - 'hash' => true (validates the user page hash)
     *                    - 'session' => true (validates the session token)
     *
     * @return array An array containing the session information if session validation is enabled.
     *
     * @throws WPQTException If the user page hash does not exist.
     */
    public static function validateUserPageApiRequest($data, $args = array()) {
        $returnValue = array();
        $defaults = array(
            'nonce' => true,
            'hash' => true,
            'session' => true,
            'userActive' => true
        );
        $args = wp_parse_args($args, $defaults);

        if ($args['nonce'] === true) {
            $nonce = $data->get_header('X-WPQT-USER-API-Nonce');
            NonceService::verifyNonce($nonce, WPQT_USER_API_NONCE);
        }

        if ($args['hash'] === true) {
            $userPageService = new UserPageService();
            if( !$userPageService->checkIfUserPageHashExists($data['hash']) ) {
                throw new WPQTException('User page does not exist', true);
            }
        }

        if ($args['session'] === true) {
            $sessionService = new SessionService();
            $session = $sessionService->verifySessionToken($data['hash']);
            $returnValue['session'] = $session;
        }

        if ($args['userActive'] === true && isset($returnValue['session'])) {
            $userRepo = new UserRepository();
            $isActive = $userRepo->isUserActive($returnValue['session']->user_id);

            if (!$isActive) {
                throw new WPQTException('User is not active', true);
            }
            
        }

        return $returnValue;
    }


    /**
     * Validates if a given parameter is numeric.
     *
     * @param mixed  $param   The parameter to validate.
     * @param object $request The request object (not used in the current implementation).
     * @param string $key     The key associated with the parameter (not used in the current implementation).
     *
     * @return bool Returns true if the parameter is numeric, false otherwise.
     */
    public static function validateNumericParam($param, $request, $key) {
        return is_numeric($param);
    }

    /**
     * Sanitizes a parameter to ensure it is an absolute integer.
     *
     * @param mixed  $param   The parameter to sanitize.
     * @param object $request The request object (not used in this function).
     * @param string $key     The key associated with the parameter (not used in this function).
     *
     * @return int The sanitized absolute integer value of the parameter.
     */
    public static function sanitizeAbsint($param, $request, $key) {
        return absint($param);
    }

     /**
     * Checks if the given parameter is a string.
     *
     * @param mixed $param The parameter to check.
     * @return bool Returns true if the parameter is a string, false otherwise.
     */
    public static function validateStringParam($param) {
        return is_string($param);
    }

    /**
     * Sanitizes a string parameter to ensure it is safe for use.
     *
     * @param mixed  $param   The parameter to sanitize.
     * @param object $request The request object (not used in this function).
     * @param string $key     The key associated with the parameter (not used in this function).
     *
     * @return string The sanitized string value of the parameter.
     */
    public static function sanitizeStringParam($param, $request, $key) {
        return sanitize_text_field($param);
    }

    /**
     * Validates if a given parameter is boolean.
     *
     * @param mixed  $param   The parameter to validate.
     * @param object $request The request object (not used in the current implementation).
     * @param string $key     The key associated with the parameter (not used in the current implementation).
     *
     * @return bool Returns true if the parameter is boolean, false otherwise.
     */
    public static function validateBooleanParam($param, $request, $key) {
        return is_bool($param) || in_array(strtolower($param), array('true', 'false', '1', '0'), true);
    }

     /**
     * Sanitizes a boolean parameter to ensure it is safe for use.
     *
     * @param mixed  $param   The parameter to sanitize.
     * @param object $request The request object (not used in this function).
     * @param string $key     The key associated with the parameter (not used in this function).
     *
     * @return bool The sanitized boolean value of the parameter.
     */
    public static function sanitizeBooleanParam($param, $request, $key) {
        return rest_sanitize_boolean($param);
    }

    /**
     * Validates if the provided parameter is a valid custom field entity type for a user page.
     *
     * @param string $param The parameter to validate.
     * @return bool Returns true if the parameter is 'task' or 'user', false otherwise.
     */
    public static function validateUserPageCustomFieldEntityType($param) {
        return in_array($param, array('task', 'user'));
    }
}