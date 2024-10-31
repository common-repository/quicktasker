<?php

namespace WPQT\Log;

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

use WPQT\Log\LogRepository;
use WPQT\Time\TimeRepository;

class LogService {
    protected $logRepository;
    protected $timeRepository;

    public function __construct() {
        $this->logRepository = new LogRepository();
        $this->timeRepository = new TimeRepository();
    }
    
    /**
     * Logs a message to the database.
     *
     * @param string $text The log message text.
     * @param string $type The type of log message.
     * @param int|string $typeId The ID associated with the log type. String 'null' if we are dealing with users.
     * @return mixed The log entry retrieved by its ID.
     * @throws \Exception If the log entry could not be added to the database.
     */
    public function log($text, $type, $typeId, $createdBy, $userId = null) {
        global $wpdb;

        if($typeId === 'null') {
            $typeId = null; 
        }

        $result = $wpdb->insert(TABLE_WP_QUICKTASKS_LOGS, array(
            'text' => $text,
            'type' => $type,
            'type_id' => $typeId,
            'user_id' => $userId,
            'created_by' => $createdBy,
            'created_at' => $this->timeRepository->getCurrentUTCTime(),
        ));

        if( $result === false ) {
            throw new \Exception('Failed to add a log');
        }

        return $this->logRepository->getLogById( $wpdb->insert_id );
    }
}