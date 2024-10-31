<?php
namespace WPQT\Stage;

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

class StageRepository {
    /**
     * Retrieves all stages from the database.
     *
     * @return array The array of stages retrieved from the database.
     */
    public function getStagesByPipelineId($pipelineId) {
        global $wpdb;

        return $wpdb->get_results( $wpdb->prepare(
            "SELECT a.*, b.stage_order FROM " . TABLE_WP_QUICKTASKER_PIPELINE_STAGES . " AS a
            INNER JOIN " . TABLE_WP_QUICKTASKER_STAGES_LOCATION . " AS b
            ON a.id = b.stage_id
            WHERE a.pipeline_id = %d
            ORDER BY b.stage_order",
            $pipelineId
        ) );
    }

    /**
     * Retrieves a stage by its ID.
     *
     * @param int $stageId The ID of the stage to retrieve.
     * @return object|null The stage object if found, null otherwise.
     */
    public function getStageById($stageId) {
        global $wpdb;

        return $wpdb->get_row( $wpdb->prepare(
            "SELECT a.*, b.stage_order FROM " . TABLE_WP_QUICKTASKER_PIPELINE_STAGES . " AS a
            INNER JOIN " . TABLE_WP_QUICKTASKER_STAGES_LOCATION . " AS b
            ON a.id = b.stage_id
            WHERE a.id = %d",
            $stageId
        ) );
    }

    /**
     * Retrieves the next stage order for a given pipeline ID.
     *
     * @param int $pipelineId The ID of the pipeline.
     * @return int The next stage order.
     */
    public function getNextStageOrder($pipelineId) {
        global $wpdb;

        $result = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT MAX(stage_order) FROM " . TABLE_WP_QUICKTASKER_STAGES_LOCATION . " WHERE pipeline_id = %d",
                $pipelineId
            )
        );

        return $result === null ? 0 : $result + 1;
    }
}