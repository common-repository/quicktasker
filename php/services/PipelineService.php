<?php
namespace WPQT\Pipeline;

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

use WPQT\Pipeline\PipelineRepository;
use WPQT\Time\TimeRepository;

class PipelineService {
    protected $pipelineRepository;
    protected $timeRepository;

    public function __construct() {
        $this->pipelineRepository = new PipelineRepository();
        $this->timeRepository = new TimeRepository();
    }

    /**
     * Creates a new pipeline with the given name.
     *
     * This method inserts a new pipeline record into the database. If there is no active pipeline,
     * the new pipeline is set as the primary pipeline. The creation and update timestamps are set
     * to the current UTC time.
     *
     * @param string $name The name of the new pipeline.
     * @return mixed The newly created pipeline object.
     * @throws \Exception If the pipeline creation fails.
     */
    public function createPipeline($name) {
        global $wpdb;

        $activePipeline = $this->pipelineRepository->getActivePipeline();

        $result = $wpdb->insert(TABLE_WP_QUICKTASKER_PIPELINES, array(
            'name' => $name,
            'is_primary' => $activePipeline ? false : true,
            'created_at' => $this->timeRepository->getCurrentUTCTime(),
            'updated_at' => $this->timeRepository->getCurrentUTCTime()
        ));

        if ($result == false) {
            throw new \Exception('Failed to create a board');
        } 
        
        return $this->pipelineRepository->getPipelineById($wpdb->insert_id);
    }

    /**
     * Edit a pipeline.
     *
     * @param int $pipelineId The ID of the pipeline to edit.
     * @param array $args The arguments for editing the pipeline.
     *   - name (string|null) The name of the pipeline.
     * @return Pipeline The edited pipeline.
     * @throws Exception If required fields are missing or if editing the pipeline fails.
     */
    public function editPipeline($pipelineId, $args) {
        global $wpdb;

        $defaults = array(
            'name' => null
        );

        $args = wp_parse_args($args, $defaults);

        if (empty($args['name'])) {
            throw new \Exception('Required fields are missing');
        }

        $result = $wpdb->update(TABLE_WP_QUICKTASKER_PIPELINES, array(
            'name' => $args['name'],
            'description' => $args['description'],
            'updated_at' => $this->timeRepository->getCurrentUTCTime()
        ), array(
            'id' => $pipelineId
        ));

        if ($result === false) {
            throw new \Exception('Failed to edit pipeline');
        }

        return $this->pipelineRepository->getPipelineById($pipelineId);       
    }

    /**
     * Marks a pipeline as the primary pipeline.
     *
     * This method updates the is_primary field of the pipeline table to mark the specified pipeline
     * as the primary pipeline. The updated_at field is set to the current UTC time.
     *
     * @param int $pipelineId The ID of the pipeline to mark as primary.
     * @return mixed The updated pipeline object.
     * @throws \Exception If the update operation fails.
     */
    public function markPipelineAsPrimary($pipelineId) {
        global $wpdb;

        $current_time_utc = $this->timeRepository->getCurrentUTCTime();
        $result = $wpdb->query(
            $wpdb->prepare(
                "UPDATE " . TABLE_WP_QUICKTASKER_PIPELINES . "
                 SET is_primary = CASE
                     WHEN id = %d THEN 1
                     ELSE 0
                 END,
                 updated_at = %s",
                $pipelineId,
                $current_time_utc
            )
        );

        if ($result === false) {
            throw new \Exception('Failed to mark pipeline as primary');
        }

        return $this->pipelineRepository->getPipelineById($pipelineId);   
    }


    /**
     * Deletes a pipeline and its associated data from the database.
     *
     * This method performs the following actions:
     * 1. Retrieves the pipeline by its ID.
     * 2. Deletes the pipeline from the database.
     * 3. Deletes all stages associated with the pipeline.
     * 4. Deletes the location data of the pipeline stages.
     * 5. Deletes all non-archived tasks associated with the pipeline.
     *
     * @param int $pipelineId The ID of the pipeline to be deleted.
     * @return mixed The deleted pipeline object.
     * @throws \Exception If the pipeline is not found or any of the delete operations fail.
     */
    public function deletePipeline($pipelineId) {
        global $wpdb;

        $pipeline = $this->pipelineRepository->getPipelineById($pipelineId);
        $pipelineIdToLoadAfterDelete = null;

        if ($pipeline === null) {
            throw new \Exception('Board not found');
        }

        // Delete the pipeline
        $result = $wpdb->delete(TABLE_WP_QUICKTASKER_PIPELINES, array(
            'id' => $pipelineId
        ));
        if ($result === false) {
            throw new \Exception('Failed to delete a board');
        }

        // Delete the pipeline stages
        $result = $wpdb->delete(TABLE_WP_QUICKTASKER_PIPELINE_STAGES, array(
            'pipeline_id' => $pipelineId
        ));
        if ($result === false) {
            throw new \Exception('Failed to delete board stages');
        }

        // Delete the pipeline stages location
        $result = $wpdb->delete(TABLE_WP_QUICKTASKER_STAGES_LOCATION, array(
            'pipeline_id' => $pipelineId
        ));
        if ($result === false) {
            throw new \Exception('Failed to delete board stages location');
        }

        // Delete not archived tasks
        $result = $wpdb->delete(TABLE_WP_QUICKTASKER_TASKS, array(
            'pipeline_id' => $pipelineId,
            'is_archived' => 0
        ));
        if ($result === false) {
            throw new \Exception('Failed to delete board tasks');
        }

        // If the pipeline was the primary pipeline, mark another pipeline as primary
        if($pipeline->is_primary) {
            $newActivePipeline = $wpdb->get_row("SELECT * FROM " . TABLE_WP_QUICKTASKER_PIPELINES . " WHERE is_primary = 0 ORDER BY id ASC LIMIT 1");

            if ($newActivePipeline) {
                $this->markPipelineAsPrimary($newActivePipeline->id);
                $pipelineIdToLoadAfterDelete = $newActivePipeline->id;
            }
        }else {
            $currentActivePipeline = $this->pipelineRepository->getActivePipeline();
            if( $currentActivePipeline === null ) {
                throw new \Exception('Failed to get active board');
            }
            $pipelineIdToLoadAfterDelete = $currentActivePipeline->id;
        }

        return (object)[
            'deletedPipeline' => $pipeline,
            'pipelineIdToLoad' => $pipelineIdToLoadAfterDelete,
        ];
    }
}