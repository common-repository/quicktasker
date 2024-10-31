<?php
namespace WPQT;

use Exception;

class WPQTException extends Exception {
    private $sendToFrontEnd;

    public function __construct($message, $sendToFrontEnd = false, $code = 0, Exception $previous = null) {
        $this->sendToFrontEnd = $sendToFrontEnd;
        parent::__construct($message, $code, $previous);
    }

    public function shouldSendToFrontEnd() {
        return $this->sendToFrontEnd;
    }
}