<?php
namespace WPQT\Time;

class TimeRepository {
    /**
     * Retrieves the current UTC time in 'Y-m-d H:i:s' format.
     *
     * @return string The current UTC time.
     */
    public function getCurrentUTCTime() {
        // Get the current UTC time in 'Y-m-d H:i:s' format
        return gmdate('Y-m-d H:i:s');
    }

    /**
     * Retrieves the WordPress timezone setting.
     *
     * This function fetches the timezone setting from the WordPress options.
     * It first checks for a timezone string. If not found, it checks for a GMT offset.
     * If neither is found, it defaults to 'UTC'.
     *
     * @return string The timezone string, GMT offset converted to timezone, or 'UTC'.
     */
    public function getWPTimezone() {
        $timezone_string = get_option('timezone_string');
        $gmt_offset = get_option('gmt_offset');

        if ( $timezone_string ) {
            return $timezone_string;
        } elseif ($gmt_offset) {
            return timezone_name_from_abbr('', $gmt_offset * 3600, 0);
        } else {
            return 'UTC';
        }
    }
}