<?php
namespace WPQT\Pipeline;

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}
use WPQT\Stage\StageRepository;
use WPQT\Task\TaskRepository;
use WPQT\User\UserRepository;

class PipelineRepository {
    /**
     * Retrieves all pipelines from the database.
     *
     * @return array The list of pipelines.
     */
    public function getPipelines() {
        global $wpdb;

        return $wpdb->get_results(
            "SELECT * FROM ". TABLE_WP_QUICKTASKER_PIPELINES,
         );
    }

    /**
     * Retrieves a pipeline by its ID from the database.
     *
     * @param int $id The ID of the pipeline.
     * @return object|null The pipeline object if found, null otherwise.
     */
    public function getPipelineById($id) {
        global $wpdb;

        return $wpdb->get_row( $wpdb->prepare(
            "SELECT * FROM " . TABLE_WP_QUICKTASKER_PIPELINES . "
            WHERE id = %d",
            $id
        ) );
    }

    /**
     * Retrieves the active pipeline from the database.
     *
     * @return object|null The active pipeline object if found, null otherwise.
     */
    public function getActivePipeline() {
        global $wpdb;

        return $wpdb->get_row(
            "SELECT * FROM ". TABLE_WP_QUICKTASKER_PIPELINES . " WHERE is_primary = 1"
        );
    }

    /**
     * Retrieves the full pipeline with stages and tasks by pipeline ID.
     *
     * @param int $pipelineId The ID of the pipeline.
     * @return Pipeline The full pipeline object with stages and tasks.
     */
    public function getFullPipeline($pipelineId) {
        $stageRepository = new StageRepository();
        $taskRepository = new TaskRepository();
        $userRepository = new UserRepository();

        // Fetch the pipeline
        $pipeline = $this->getPipelineById($pipelineId);

        // Fetch all stages for the pipeline
        $pipelineStages = $stageRepository->getStagesByPipelineId($pipelineId);

        // Fetch all tasks for the stages
        $stageIds = array_map(function($stage) {
            return $stage->id;
        }, $pipelineStages);
        $tasks = $taskRepository->getTasksByStageIds($stageIds);

        // Fetch all assigned users for the tasks
        $taskIds = array_map(function($task) {
            return $task->id;
        }, $tasks);
        $assignedUsers = $userRepository->getAssignedUsersByTaskIds($taskIds);

        // Organize tasks under their respective stages
        $tasksByStage = [];
        foreach ($tasks as $task) {
            $tasksByStage[$task->stage_id][] = $task;
        }

         // Organize assigned users under their respective tasks
        $usersByTask = [];
        foreach ($assignedUsers as $user) {
            $usersByTask[$user->task_id][] = $user;
        }

         // Assign tasks and users to stages
        foreach ($pipelineStages as $stage) {
            $stage->tasks = isset($tasksByStage[$stage->id]) ? $tasksByStage[$stage->id] : [];
            foreach ($stage->tasks as $task) {
                $task->assigned_users = isset($usersByTask[$task->id]) ? $usersByTask[$task->id] : [];
            }
        }

        $pipeline->stages = $pipelineStages;

        return $pipeline;
    }
}