<?php
namespace WPQT\Stage;
if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

use WPQT\Log\LogService;
use WPQT\Stage\StageRepository;
use WPQT\Task\TaskRepository;
use WPQT\Time\TimeRepository;

class StageService {
    protected $stageRepository;
    protected $taskRepository;
    protected $logService;
    protected $timeRepository;

    public function __construct() {
        $this->stageRepository = new StageRepository();
        $this->taskRepository = new TaskRepository();
        $this->logService = new LogService();
        $this->timeRepository = new TimeRepository();
    }

    /**
     * Creates a stage for a pipeline.
     *
     * @param int $pipelineId The ID of the pipeline.
     * @param array $args The arguments for creating the stage.
     * @return Stage The created stage.
     * @throws Exception If required fields are missing or if the stage creation fails.
     */
    public function createStage($pipelineId, $args) {
        global $wpdb;

        $defaults = array(
            'name' => null,
            'description' => null
        );

        $args = wp_parse_args($args, $defaults);

        if ( empty($args['name']) ) {
            throw new \Exception('Required fields are missing');
        }

        $result = $wpdb->insert(TABLE_WP_QUICKTASKER_PIPELINE_STAGES, array(
            'pipeline_id' => $pipelineId,
            'name' => $args['name'],
            'description' => $args['description'],
            'created_at' => $this->timeRepository->getCurrentUTCTime(),
            'updated_at' => $this->timeRepository->getCurrentUTCTime()
        ));

        if( $result === false ) {
            throw new \Exception('Failed to create a stage');
        }

        $stageId = $wpdb->insert_id;
        $stageOrder = $this->stageRepository->getNextStageOrder($pipelineId);

        $this->addStageLocation($pipelineId, $stageId, $stageOrder);

        return $this->stageRepository->getStageById($stageId);
    }

    /**
     * Adds a stage location to the pipeline.
     *
     * @param int $pipelineId The ID of the pipeline.
     * @param int $stageId The ID of the stage.
     * @param int $stageOrder The order of the stage.
     * @return void
     */
    private function addStageLocation($pipelineId, $stageId, $stageOrder) {
        global $wpdb;

        $wpdb->insert(TABLE_WP_QUICKTASKER_STAGES_LOCATION, array(
            'pipeline_id' => $pipelineId,
            'stage_id' => $stageId,
            'stage_order' => $stageOrder,
            'created_at' => $this->timeRepository->getCurrentUTCTime(),
            'updated_at' => $this->timeRepository->getCurrentUTCTime()
        ));
    }

    /**
     * Edit a stage.
     *
     * @param int $stageId The ID of the stage to edit.
     * @param array $args The arguments to update the stage.
     * @return void
     */
    public function editStage($stageId, $args) {
        global $wpdb;

        if (!array_key_exists('name', $args) || !array_key_exists('description', $args)) {
            throw new \Exception('Required fields are missing');
        }

        $result = $wpdb->update(TABLE_WP_QUICKTASKER_PIPELINE_STAGES, array(
            'name' => $args['name'],
            'description' => $args['description'],
            'updated_at' => $this->timeRepository->getCurrentUTCTime()
        ), array('id' => $stageId));

        if( $result === false ) {
            throw new \Exception('Failed to update the stage');
        }

        return $this->stageRepository->getStageById($stageId);
    }

    /**
     * Moves a stage within a pipeline.
     *
     * @param int $stageId The ID of the stage to be moved.
     * @param array $args The arguments for moving the stage.
     *   - direction (string): The direction in which to move the stage ('left' or 'right').
     *
     * @return Stage|null The updated stage object if successful, null otherwise.
     *
     * @throws Exception If the required fields are missing, the stage is not found,
     *   or the stage is already at the beginning/end.
     */
    public function moveStage($stageId, $args) {
        global $wpdb;

        if ( !array_key_exists('direction', $args) ) {
            throw new \Exception('Required fields are missing');
        }

        $stage = $this->stageRepository->getStageById($stageId);
        $stages = $this->stageRepository->getStagesByPipelineId($stage->pipeline_id);
        $direction = $args['direction'];

        if ( !$stage ) {
            throw new \Exception('Stage not found');
        }
        $currentOrder = $stage->stage_order;

        if( $direction === 'left' && $currentOrder <= 0 ) {
            throw new \Exception('Stage is already at the beginning');
        }

        if( $direction === 'right' && $currentOrder === count($stages) - 1 ) {
            throw new \Exception('Stage is already at the end');
        }

        $newOrder = $currentOrder + ( $direction === 'left' ? -1 : 1 );

        $this->updateStageOrder($stageId, $stage->pipeline_id, $newOrder, $currentOrder);

        return $this->stageRepository->getStageById($stageId);
    }

    /**
     * Updates the stage order in the database.
     *
     * @param int $stageId The ID of the stage.
     * @param int $pipelineId The ID of the pipeline.
     * @param int $newOrder The new order of the stage.
     * @param int $currentOrder The current order of the stage.
     * @return int The number of rows affected by the update.
     * @throws Exception If the update fails.
     */
    private function updateStageOrder($stageId, $pipelineId, $newOrder, $currentOrder) {
        global $wpdb;

        $currentUtcTime = $this->timeRepository->getCurrentUTCTime();

        if ( $currentOrder < $newOrder) {
            $result = $wpdb->query(
                $wpdb->prepare(
                    "UPDATE " . TABLE_WP_QUICKTASKER_STAGES_LOCATION . " SET stage_order = stage_order - 1, updated_at = %s WHERE pipeline_id = %d AND stage_order > %d AND stage_order <= %d",
                    $currentUtcTime, 
                    $pipelineId,
                    $currentOrder,
                    $newOrder
                )
            );

            if($result === false) {
                throw new \Exception('Failed to update stage order');
            }
            
        } else {
            $result = $wpdb->query(
                $wpdb->prepare(
                    "UPDATE " . TABLE_WP_QUICKTASKER_STAGES_LOCATION . " SET stage_order = stage_order + 1, updated_at = %s WHERE pipeline_id = %d AND stage_order >= %d AND stage_order < %d",
                    $currentUtcTime,
                    $pipelineId,
                    $newOrder,
                    $currentOrder
                )
            );

            if($result === false) {
                throw new \Exception('Failed to update stage order');
            }
        }

        $result = $wpdb->update(TABLE_WP_QUICKTASKER_STAGES_LOCATION, array(
            'stage_order' => $newOrder
        ), array('stage_id' => $stageId, 'pipeline_id' => $pipelineId));

        if( $result === false ) {
            throw new \Exception('Failed to update stage order');
        }

        return $result;
    }

    /**
     * Deletes a stage.
     *
     * @param int $stageId The ID of the stage to delete.
     * @return void
     */
    public function deleteStage($stageId) {
        global $wpdb;
        
        // Check if the stage has tasks
        if( count( $this->taskRepository->getTasksByStageId($stageId) ) > 0 ) {
            throw new \Exception('Stage has tasks. Please delete/relocate the tasks first.');
        }

        // Delete the stage from the pipeline stages table
        $result = $wpdb->delete(TABLE_WP_QUICKTASKER_PIPELINE_STAGES, array('id' => $stageId));
        if( $result === false ) {
            throw new \Exception('Failed to delete the stage.');
        }

        // Delete the stage from the stages location table
        $result2 = $wpdb->delete(TABLE_WP_QUICKTASKER_STAGES_LOCATION, array('stage_id' => $stageId));
        if( $result2 === false ) {
            throw new \Exception('Failed to delete the stage.');
        }

        return $result;
    }

    /**
     * Archives all tasks associated with a given stage.
     *
     * This function updates the tasks and their locations to mark them as archived.
     * It sets the `is_archived` flag to 1 and updates the `updated_at` timestamp
     * to the current UTC time.
     *
     * @param int $stageId The ID of the stage whose tasks are to be archived.
     * @return array The list of tasks that were archived.
     * @throws \Exception If the task or task location archiving fails.
     */
    public function archiveStageTasks($stageId) {
        global $wpdb;

        $currentUtcTime = $this->timeRepository->getCurrentUTCTime();
        $tasksToArvhive = $this->taskRepository->getTasksByStageId($stageId);

        $sql = "
            UPDATE " . TABLE_WP_QUICKTASKER_TASKS . " AS a
            INNER JOIN " . TABLE_WP_QUICKTASKER_TASKS_LOCATION . " AS b
            ON a.id = b.task_id
            SET a.is_archived = 1, a.updated_at = %s
            WHERE b.stage_id = %d
        ";

        $result = $wpdb->query($wpdb->prepare($sql, $currentUtcTime, $stageId));

        if ($result === false) {
            throw new \Exception('Failed to archive tasks');
        }

        $result2 = $wpdb->update(
            TABLE_WP_QUICKTASKER_TASKS_LOCATION,
            array(
                'is_archived' => 1,
                'updated_at' => $currentUtcTime
            ),
            array('stage_id' => $stageId),
            array('%d', '%s'), // Format for data: integer and string
            array('%d')        // Format for where clause: integer
        );

        if ($result2 === false) {
            throw new \Exception('Failed to archive task locations');
        }

        return $tasksToArvhive;
    }
}