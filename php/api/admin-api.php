<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

use WPQT\Response\ApiResponse;
use WPQT\Log\LogRepository;
use WPQT\Comment\CommentRepository;
use WPQT\Comment\CommentService;
use WPQT\User\UserRepositry;
use WPQT\User\UserService;
use WPQT\Nonce\NonceService;
use WPQT\Pipeline\PipelineRepository;
use WPQT\Customfield\CustomFieldRepository;
use WPQT\Pipeline\PipelineService;
use WPQT\Task\TaskRepository;
use WPQT\Task\TaskService;
use WPQT\Stage\StageService;
use WPQT\Permission\PermissionService;
use WPQT\RequestValidation;
use WPQT\Session\SessionRepository;
use WPQT\Session\SessionService;
use WPQT\Log\LogService;
use WPQT\User\UserRepository;
use WPQT\Stage\StageRepository;
use WPQT\UserPage\UserPageService;
use WPQT\Customfield\CustomFieldService;

function WPQTverifyApiNonce($data) {
    $nonce = $data->get_header('X-WPQT-API-Nonce');
    NonceService::verifyNonce($nonce, WPQT_ADMIN_API_NONCE);

    return true;
}

add_action('rest_api_init', 'wpqt_register_api_routes');
function wpqt_register_api_routes() {
    /*
    ==================================================================================================================================================================================================================
    Pipeline endpoints
    ==================================================================================================================================================================================================================
    */

    register_rest_route(
        'wpqt/v1',
        'pipelines/(?P<id>\d+)',
        array(
            'methods' => 'GET',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
                    $pipelineRepo = new PipelineRepository();
                    $pipeline = $pipelineRepo->getFullPipeline( $data['id'] );
                    $pipelines = $pipelineRepo->getPipelines();

                    return new WP_REST_Response((new ApiResponse(true, array(), (object)[
                        'pipeline' => $pipeline,
                        'pipelines' => $pipelines

                    ]))->toArray(), 200);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'pipelines',
        array(
            'methods' => 'GET',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
                    $pipelineRepo = new PipelineRepository();
                    $pipelines = $pipelineRepo->getPipelines();

                    return new WP_REST_Response((new ApiResponse(true, array(), $pipelines))->toArray(), 200);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            }
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'pipelines',
        array(
            'methods' => 'POST',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
                    $pipelineService = new PipelineService();
                    $logService = new LogService();
                    $newPipeline = $pipelineService->createPipeline($data['name']);
                    $logService->log('Board ' . $newPipeline->name . ' created', WP_QT_LOG_TYPE_PIPELINE, $newPipeline->id, WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());
                   
                    return new WP_REST_Response((new ApiResponse(true, array(), $newPipeline))->toArray(), 200);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'name' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'pipelines/(?P<id>\d+)',
        array(
            'methods' => 'PATCH',
            'callback' => function( $data ) {
                global $wpdb;

                try {
                    $wpdb->query('START TRANSACTION');
                    WPQTverifyApiNonce($data);

                    $pipelineService = new PipelineService();
                    $logService = new LogService();
                    $pipeline = $pipelineService->editPipeline($data['id'], array(
                        "name" => $data['name'],
                        "description" => $data['description']
                    ));
                    $logService->log('Board ' . $pipeline->name . ' edited', WP_QT_LOG_TYPE_PIPELINE, $pipeline->id, WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());

                    $wpdb->query('COMMIT');
                    return new WP_REST_Response((new ApiResponse(true, array(), $pipeline))->toArray(), 200);
                } catch (Exception $e) {
                    $wpdb->query('ROLLBACK');

                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
                'name' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
                'description' => array(
                    'required' => false,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'pipelines/(?P<id>\d+)/set-primary',
        array(
            'methods' => 'PATCH',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
                    $pipelineService = new PipelineService();
                    $logService = new LogService();
                    $pipeline = $pipelineService->markPipelineAsPrimary($data['id']);
                    $logService->log('Board ' . $pipeline->name . ' marked as primary', WP_QT_LOG_TYPE_PIPELINE, $data['id'], WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());

                    return new WP_REST_Response((new ApiResponse(true, array()))->toArray(), 200);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'pipelines/(?P<id>\d+)',
        array(
            'methods' => 'DELETE',
            'callback' => function( $data ) {
                global $wpdb;

                try {
                    $wpdb->query('START TRANSACTION');
                    WPQTverifyApiNonce($data);

                    $pipelineService = new PipelineService();
                    $logService = new LogService();
                    
                    $data = $pipelineService->deletePipeline($data['id']);
                    $logService->log('Board ' . $data->deletedPipeline->name . ' deleted', WP_QT_LOG_TYPE_PIPELINE, $data->deletedPipeline->id, WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());
                    $wpdb->query('COMMIT');

                    return new WP_REST_Response((new ApiResponse(true, array(), (object)[
                        'deletedPipelineId' => $data->deletedPipeline->id,
                        'pipelineIdToLoad' => $data->pipelineIdToLoad
                    ]))->toArray(), 200);
                } catch (Exception $e) {
                    $wpdb->query('ROLLBACK');

                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPublicAPIDeleteEndpoints();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
            ),
        ),
    );

    /*
    ==================================================================================================================================================================================================================
    Task endpoints
    ==================================================================================================================================================================================================================
    */

    register_rest_route(
        'wpqt/v1',
        'tasks/archived',
        array(
            'methods' => 'GET',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
                    $tasksRepo = new TaskRepository();
                    $archivedTasks = $tasksRepo->getArchivedTasks(true);

                    return new WP_REST_Response((new ApiResponse(true, array(), $archivedTasks))->toArray(), 200);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            }
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'tasks/(?P<id>\d+)/logs',
        array(
            'methods' => 'GET',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
                    $logRepo = new LogRepository();
                    $logs = $logRepo->getLogs($data['id'], WP_QT_LOG_TYPE_TASK);
              
                    return new WP_REST_Response((new ApiResponse(true, array(), $logs))->toArray(), 200);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'tasks/(?P<id>\d+)/move',
        array(
            'methods' => 'PATCH',
            'callback' => function( $data ) {
                global $wpdb;

                try {
                    $wpdb->query('START TRANSACTION');
                    WPQTverifyApiNonce($data);

                    $taskService = new TaskService();
                    $logService = new LogService();
                    $stageRepo = new StageRepository();
                    $moveInfo = $taskService->moveTask( $data['id'], $data['stageId'], $data['order'] );
                    $stage = $stageRepo->getStageById($data['stageId']);

                    if($moveInfo->stageChanged === true) {
                        $logService->log('Task ' . $moveInfo->task->name . ' moved to ' . $stage->name . ' stage', WP_QT_LOG_TYPE_TASK, $data['id'], WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());
                    }else {
                        $logService->log('Task ' . $moveInfo->task->name . ' order changed in ' . $stage->name . ' stage', WP_QT_LOG_TYPE_TASK, $data['id'], WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());
                    }
                    
                    $wpdb->query('COMMIT');
                    return new WP_REST_Response((new ApiResponse(true))->toArray(), 200);
                } catch (Exception $e) {
                    $wpdb->query('ROLLBACK');

                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
                'stageId' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
                'order' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'tasks',
        array(
            'methods' => 'POST',
            'callback' => function( $data ) {
                global $wpdb;

                try {
                    $wpdb->query('START TRANSACTION');
                    WPQTverifyApiNonce($data);
                    
                    $taskService = new TaskService();
                    $logService = new LogService();
                    
                    $newTask = $taskService->createTask( $data['stageId'], array(
                        "name" => $data['name'],
                        "pipelineId" => $data['pipelineId'],
                    ) );
                    $logService->log('Task ' . $newTask->name . ' created', WP_QT_LOG_TYPE_TASK, $newTask->id, WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());

                    $wpdb->query('COMMIT');

                    return new WP_REST_Response((new ApiResponse(true, array(), $newTask))->toArray(), 200);
                } catch (Exception $e) {
                    $wpdb->query('ROLLBACK');

                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'stageId' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
                'name' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
                'pipelineId' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'tasks/(?P<id>\d+)',
        array(
            'methods' => 'PATCH',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
                    $taskService = new TaskService();
                    $logService = new LogService();

                    $task = $taskService->editTask( $data['id'], array(
                        "name" => $data['name'],
                        "description" => $data['description'],
                        "free_for_all" => $data['freeForAll'],
                    ) );
                    $logService->log('Task ' . $task->name . ' edited', WP_QT_LOG_TYPE_TASK, $task->id, WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());

                    return new WP_REST_Response((new ApiResponse(true, array(), $task))->toArray(), 200);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
                'name' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
                'description' => array(
                    'required' => false,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
                'freeForAll' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateBooleanParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeBooleanParam'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'tasks/(?P<id>\d+)',
        array(
            'methods' => 'DELETE',
            'callback' => function( $data ) {
                global $wpdb;

                try {
                    $wpdb->query('START TRANSACTION');
                    WPQTverifyApiNonce($data);
                    
                    $taskService = new TaskService();
                    $taskService->deleteTask( $data['id'] );
                    $wpdb->query('COMMIT');

                    return new WP_REST_Response((new ApiResponse(true, array()))->toArray(), 200);
                } catch (Exception $e) {
                    $wpdb->query('ROLLBACK');

                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPublicAPIDeleteEndpoints();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'tasks/(?P<id>\d+)/archive',
        array(
            'methods' => 'PATCH',
            'callback' => function( $data ) {
                global $wpdb;

                try {
                    $wpdb->query('START TRANSACTION');

                    WPQTverifyApiNonce($data);
                    $taskService = new TaskService();
                    $logService = new LogService();

                    $task = $taskService->archiveTask( $data['id'] );
                    $logService->log('Task ' . $task->name . ' archived', WP_QT_LOG_TYPE_TASK, $data['id'], WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());
                    $wpdb->query('COMMIT');

                    return new WP_REST_Response((new ApiResponse(true, array()))->toArray(), 200);
                } catch (Exception $e) {
                    $wpdb->query('ROLLBACK');

                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'tasks/(?P<id>\d+)/archive-restore',
        array(
            'methods' => 'PATCH',
            'callback' => function( $data ) {
                global $wpdb;

                try {
                    $wpdb->query('START TRANSACTION');
                    WPQTverifyApiNonce($data);

                    $taskService = new TaskService();
                    $logService = new LogService();

                    $task = $taskService->restoreArchivedTask( $data['id'] );
                    $logService->log('Task ' . $task->name . ' restored from archive', WP_QT_LOG_TYPE_TASK, $data['id'], WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());

                    $wpdb->query('COMMIT');

                    return new WP_REST_Response((new ApiResponse(true, array()))->toArray(), 200);
                } catch (Exception $e) {
                    $wpdb->query('ROLLBACK');

                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'tasks/(?P<id>\d+)/done',
        array(
            'methods' => 'PATCH',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
       
                    $taskService = new TaskService();
                    $logService = new LogService();

                    $task = $taskService->changeTaskDoneStatus( $data['id'], $data['done']);
                    $logMessage = $data['done'] ? 'Task ' . $task->name .  ' status changed to completed' : 'Task ' . $task->name .  ' status changed to not completed';

                    $logService->log($logMessage, WP_QT_LOG_TYPE_TASK, $data['id'], WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());

                    return new WP_REST_Response((new ApiResponse(true, array(), $task))->toArray(), 200);
                } catch (Exception $e) {
          
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
                'done' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateBooleanParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeBooleanParam'),
                ),
            ),
        ),
    );

     /*
    ==================================================================================================================================================================================================================
    Stage endpoints
    ==================================================================================================================================================================================================================
    */
    register_rest_route(
        'wpqt/v1',
        'stages',
        array(
            'methods' => 'POST',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
                    $stageService = new StageService();
                    $logService = new LogService();

                    $newStage = $stageService->createStage( $data['pipelineId'], array(
                        "name" => $data['name'],
                        "description" => $data['description']
                    ) );

                    $logService->log('Stage ' . $newStage->name .  ' created', WP_QT_LOG_TYPE_STAGE, $newStage->id, WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());

                    return new WP_REST_Response((new ApiResponse(true, array(), $newStage))->toArray(), 200);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                } 
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'pipelineId' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
                'name' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
                'description' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'stages/(?P<id>\d+)',
        array(
            'methods' => 'PATCH',
            'callback' => function( $data ) {
                global $wpdb;

                try {
                    $wpdb->query('START TRANSACTION');
                    WPQTverifyApiNonce($data);

                    $stageService = new StageService();
                    $logService = new LogService();

                    $stage = $stageService->editStage( $data['id'], array(
                        "name" => $data['name'],
                        "description" => $data['description']
                    ) );
                    $logService->log('Stage ' . $stage->name . ' edited', WP_QT_LOG_TYPE_STAGE, $stage->id, WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());
                    $wpdb->query('COMMIT');

                    return new WP_REST_Response((new ApiResponse(true, array(), $stage))->toArray(), 200);
                } catch (Exception $e) {
                    $wpdb->query('ROLLBACK');

                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                } 
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
                'name' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
                'description' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'stages/(?P<id>\d+)/move',
        array(
            'methods' => 'PATCH',
            'callback' => function( $data ) {
                global $wpdb;

                try {
                    $wpdb->query('START TRANSACTION');
                    WPQTverifyApiNonce($data);

                    $stageService = new StageService();
                    $logService = new LogService();

                    $stage = $stageService->moveStage( $data['id'], array(
                        "direction" => $data['direction'],
                    ) );
                    $logService->log('Stage ' . $stage->name . ' moved', WP_QT_LOG_TYPE_STAGE, $stage->id, WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());

                    $wpdb->query('COMMIT');

                    return new WP_REST_Response((new ApiResponse(true, array(), $stage))->toArray(), 200);
                } catch (Exception $e) {
                    $wpdb->query('ROLLBACK');

                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                } 
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
                'direction' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'stages/(?P<id>\d+)',
        array(
            'methods' => 'DELETE',
            'callback' => function( $data ) {
                global $wpdb;

                try {
                    $wpdb->query('START TRANSACTION');
                    WPQTverifyApiNonce($data);

                    $stageService = new StageService();
                    $stageService->deleteStage( $data['id'] );
                    $wpdb->query('COMMIT');

                    return new WP_REST_Response((new ApiResponse(true))->toArray(), 200);
                } catch (Exception $e) {
                    $wpdb->query('ROLLBACK');
                    
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPublicAPIDeleteEndpoints();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'stages/(?P<id>\d+)/archive-tasks',
        array(
            'methods' => 'PATCH',
            'callback' => function( $data ) {
                global $wpdb;

                try {
                    $wpdb->query('START TRANSACTION');
                    WPQTverifyApiNonce($data);

                    $stageService = new StageService();
                    $logService = new LogService();
                    $archivedTasks = $stageService->archiveStageTasks( $data['id'] );

                    foreach($archivedTasks as $task) {
                        $logService->log('Task ' . $task->name . ' archived', WP_QT_LOG_TYPE_TASK, $task->id, WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());
                    }

                    $wpdb->query('COMMIT');

                    return new WP_REST_Response((new ApiResponse(true))->toArray(), 200);
                } catch (Exception $e) {
                    $wpdb->query('ROLLBACK');
                    
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
            ),
        ),
    );
    /*
    ==================================================================================================================================================================================================================
    User endpoints
    ==================================================================================================================================================================================================================
    */

    register_rest_route(
        'wpqt/v1',
        'users',
        array(
            'methods' => 'GET',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
                    $userRepo = new UserRepository();
                    $users = $userRepo->getUsers();

                    return new WP_REST_Response((new ApiResponse(true, array(), $users))->toArray(), 200);
                }catch(Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            }
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'users/(?P<id>\d+)/extended',
        array(
            'methods' => 'GET',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
                    $userRepo = new UserRepository();
                    $userService = new UserService();
                    $userPageService = new UserPageService();
                    $user = $userRepo->getUserById($data['id']);
    
                    if (!$user) {
                        throw new WPQTException('Failed to get user data', true);
                    }
                    $user->has_password = $userService->checkIfUserHasPassword($data['id']);
                    $user->setup_completed = $userPageService->checkIfUserPageSetupCompleted($data['id']);

                    return new WP_REST_Response((new ApiResponse(true, array(), $user))->toArray(), 200);
                }catch(WPQTException $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array()))->toArray(), 400);
                }

            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'users',
        array(
            'methods' => 'POST',
            'callback' => function( $data ) {
                global $wpdb;

                try {
                    $wpdb->query('START TRANSACTION');
                    WPQTverifyApiNonce($data);

                    $userService = new UserService();
                    $logService = new LogService();

                    $user = $userService->createUser(array(
                        "name" => $data['name'],
                        "description" => $data['description'],
                    ));
                    $logService->log('User ' . $user->name . ' created', WP_QT_LOG_TYPE_USER, $user->id, WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());
                    $wpdb->query('COMMIT');

                    return new WP_REST_Response((new ApiResponse(true, array(), $user))->toArray(), 200);
                }catch(Exception $e) {
                    $wpdb->query('ROLLBACK');

                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'name' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
                'description' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'users/(?P<id>\d+)/tasks',
        array(
            'methods' => 'GET',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
            
                    $taskRepo = new TaskRepository();
                    $userTasks = $taskRepo->getTasksAssignedToUser($data['id'], true);
                   
                    return new WP_REST_Response((new ApiResponse(true, array(), $userTasks))->toArray(), 200);
                }catch(Exception $e) {
    
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'users/(?P<id>\d+)/tasks',
        array(
            'methods' => 'POST',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
            
                    $userService = new UserService();
                    $logService = new LogService();
                    $userRepo = new UserRepository();

                    $task = $userService->assignTaskToUser($data['id'], $data->get_param('task_id'));
                    $user = $userRepo->getUserById($data['id']);

                    $logService->log('Task ' . $task->name . ' assigned to ' . $user->name, WP_QT_LOG_TYPE_TASK, $data->get_param('task_id'), WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());
                    $logService->log('Task ' . $task->name . ' assigned to ' . $user->name, WP_QT_LOG_TYPE_USER, $user->id, WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());

                    return new WP_REST_Response((new ApiResponse(true, array()))->toArray(), 200);
                }catch(Exception $e) {
    
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
                'task_id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'users/(?P<id>\d+)/tasks',
        array(
            'methods' => 'DELETE',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
            
                    $userService = new UserService();
                    $logService = new LogService();
                    $userRepo = new UserRepository();

                    $task = $userService->removeTaskFromUser($data['id'], $data->get_param('task_id'));
                    $user = $userRepo->getUserById($data['id']);

                    $logService->log('Task ' . $task->name . ' unassigned from ' . $user->name, WP_QT_LOG_TYPE_TASK, $data->get_param('task_id'), WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());
                    $logService->log('User ' . $user->name . ' unassigned from ' . $task->name . " task", WP_QT_LOG_TYPE_USER, $user->id, WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());

                    return new WP_REST_Response((new ApiResponse(true, array()))->toArray(), 200);
                }catch(Exception $e) {
                    
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPublicAPIDeleteEndpoints();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
                'task_id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'users/(?P<id>\d+)',
        array(
            'methods' => 'PATCH',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
                    $userService = new UserService();
                    $logService = new LogService();

                    $user = $userService->editUser($data['id'], $data->get_param('user'));
                    $logService->log('User ' . $user->name . ' edited', WP_QT_LOG_TYPE_USER, $user->id, WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());

                    return new WP_REST_Response((new ApiResponse(true, array(), $user))->toArray(), 200);
                }catch(Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'users/(?P<id>\d+)/password-reset',
        array(
            'methods' => 'PATCH',
            'callback' => function( $data ) {
                global $wpdb;
                
                try {
                    $wpdb->query('START TRANSACTION');
                    WPQTverifyApiNonce($data);

                    $userService = new UserService();
                    $logService = new LogService();

                    $user = $userService->resetUserPassword($data['id']);

                    $logService->log('User ' . $user->name . ' password reset', WP_QT_LOG_TYPE_USER, $data['id'], WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());
                    
                    $wpdb->query('COMMIT');
                    return new WP_REST_Response((new ApiResponse(true, array()))->toArray(), 200);
                }catch(Exception $e) {
                    $wpdb->query('ROLLBACK');

                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'users/(?P<id>\d+)/status',
        array(
            'methods' => 'PATCH',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
                    $userService = new UserService();
                    $logService = new LogService();

                    $user = $userService->changeUserStatus($data['id'], $data['status']);
                    $statusString = $data['status'] ? 'active' : 'disabled';
                    $logService->log('User ' . $user->name . ' status changed to ' . $statusString , WP_QT_LOG_TYPE_USER, $data['id'], WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());

                    return new WP_REST_Response((new ApiResponse(true, array(), $user))->toArray(), 200);
                }catch(Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
                'status' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateBooleanParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeBooleanParam'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'users/(?P<id>\d+)',
        array(
            'methods' => 'DELETE',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
                    $userService = new UserService();
                    $logService = new LogService();

                    $user = $userService->deleteUser($data['id']);
                    $logService->log('User ' . $user->name . ' marked as deleted', WP_QT_LOG_TYPE_USER, $data['id'], WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());

                    return new WP_REST_Response((new ApiResponse(true, array()))->toArray(), 200);
                }catch(Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPublicAPIDeleteEndpoints();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'users/sessions/(?P<id>\d+)/status',
        array(
            'methods' => 'PATCH',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
                    $sessionService = new SessionService();
                    $sessionService->changeSessionStatus($data['id'], $data['status']);
                 
                    return new WP_REST_Response((new ApiResponse(true, array() ))->toArray(), 200);
                }catch(Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
                'status' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateBooleanParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeBooleanParam'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'users/sessions/(?P<id>\d+)',
        array(
            'methods' => 'DELETE',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
                    $sessionService = new SessionService();
                    $sessionService->deleteSession($data['id']);
                 
                    return new WP_REST_Response((new ApiResponse(true, array()))->toArray(), 200);
                }catch(Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPublicAPIDeleteEndpoints();
            },
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                )
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'users/sessions',
        array(
            'methods' => 'GET',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
                    $sessionsRepo = new SessionRepository();
                    $userSessions = $sessionsRepo->getUserSessions();
                    
                    return new WP_REST_Response((new ApiResponse(true, array(), $userSessions))->toArray(), 200);
                }catch(Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            }
        ),
    );

    /*
    ==================================================================================================================================================================================================================
    Logs endpoints
    ==================================================================================================================================================================================================================
    */

    register_rest_route(
        'wpqt/v1',
        'logs',
        array(
            'methods' => 'GET',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
                    $logRepo = new LogRepository();
                    $logs = $logRepo->getLogs($data['typeId'], $data['type']);
                    
                    return new WP_REST_Response((new ApiResponse(true, array(), $logs))->toArray(), 200);
                }catch(Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'type' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
                'typeId' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                )
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'global-logs',
        array(
            'methods' => 'GET',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
                    $logRepo = new LogRepository();

                    $type = $data['type'] ?? null;
                    $numberOfLogs = $data['numberOfLogs'] ?? null;
                    $createdBy = $data['createdBy'] ?? null;

                    $logs = $logRepo->getGlobalLogs($type, $createdBy, $numberOfLogs, $data['order']);
                    
                    return new WP_REST_Response((new ApiResponse(true, array(), $logs))->toArray(), 200);
                }catch(Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'type' => array(
                    'required' => false,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
                'numberOfLogs' => array(
                    'required' => false,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
                'createdBy' => array(
                    'required' => false,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
                'order' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
            ),
        ),
    );

    /*
    ==================================================================================================================================================================================================================
    Comments endpoints
    ==================================================================================================================================================================================================================
    */

    register_rest_route(
        'wpqt/v1',
        'comments',
        array(
            'methods' => 'GET',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
                    $commentRepo = new CommentRepository();
                    $comments = $commentRepo->getComments( $data->get_param('typeId'), $data->get_param('type'), $data->get_param('isPrivate') );
              
                    return new WP_REST_Response((new ApiResponse(true, array(), $comments))->toArray(), 200);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'typeId' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
                'type' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
                'isPrivate' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateBooleanParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeBooleanParam'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'comments',
        array(
            'methods' => 'POST',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
                    $commentService = new CommentService();
                    $adminId = get_current_user_id();
                    $newComemnt = $commentService->createComment($data['typeId'], $data['type'], $data['isPrivate'], $data['comment'], $adminId, true);
              
                    return new WP_REST_Response((new ApiResponse(true, array(), $newComemnt))->toArray(), 200);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'comment' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
                'typeId' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
                'type' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
                'isPrivate' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateBooleanParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeBooleanParam'),
                ),
            ),
        ),
    );


    /*
    ==================================================================================================================================================================================================================
    Custom Field endpoints
    ==================================================================================================================================================================================================================
    */

    register_rest_route(
        'wpqt/v1',
        'custom-fields',
        array(
            'methods' => 'GET',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
                    $customFieldRepo = new CustomFieldRepository();

                    $customFields = $customFieldRepo->getRelatedCustomFields($data['entityId'], $data['entityType']);

                    return new WP_REST_Response((new ApiResponse(true, array(), $customFields))->toArray(), 200);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'entityType' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
                'entityId' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
                'pipelineId' => array(
                    'required' => false,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'custom-fields',
        array(
            'methods' => 'POST',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
                    $customFieldService = new CustomFieldService();
                    $logService = new LogService();

                    $customField = $customFieldService->createCustomField($data['name'], $data['description'], $data['type'], $data['entityType'], $data['entityId']);
                    $logService->log('Custom field ' . $data['name'] . ' created', $data['entityType'], $data['entityId'], WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());

                    return new WP_REST_Response((new ApiResponse(true, array(), $customField))->toArray(), 200);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'entityType' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
                'entityId' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
                'name' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
                'description' => array(
                    'required' => false,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
                'type' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'custom-fields/(?P<custom_field_id>\d+)',
        array(
            'methods' => 'DELETE',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
                    $customFieldRepo = new CustomFieldRepository();
                    $customFieldService = new CustomFieldService();
                    $logService = new LogService();

                    $customField = $customFieldRepo->getCustomFieldById($data['custom_field_id']);
                    $customFieldService->markCustomFieldAsDeleted($data['custom_field_id']);
                    $logService->log('Custom field ' . $customField->name . ' marked as deleted', $customField->entity_type, $customField->entity_id, WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());

                    return new WP_REST_Response((new ApiResponse(true, array()))->toArray(), 200);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPublicAPIDeleteEndpoints();
            },
            'args' => array(
                'custom_field_id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
            ),
        ),
    );

    register_rest_route(
        'wpqt/v1',
        'custom-fields/(?P<custom_field_id>\d+)/value',
        array(
            'methods' => 'PATCH',
            'callback' => function( $data ) {
                try {
                    WPQTverifyApiNonce($data);
                    $customFieldService = new CustomFieldService();
                    $logService = new LogService();
                    $customFieldRepo = new CustomFieldRepository();

                    $customField = $customFieldRepo->getCustomFieldById($data['custom_field_id']);
                    $customFieldService->updateCustomFieldValue($data['custom_field_id'], $data['entityId'], $data['entityType'], $data['value']);
                    $logService->log('Custom field ' . $customField->name . ' value updated', $customField->entity_type, $customField->entity_id, WP_QT_LOG_CREATED_BY_ADMIN, get_current_user_id());

                    return new WP_REST_Response((new ApiResponse(true, array()))->toArray(), 200);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                }
            },
            'permission_callback' => function() {
                return PermissionService::hasRequiredPermissionsForPrivateAPI();
            },
            'args' => array(
                'custom_field_id' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
                ),
                'entityId' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
                'entityType' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
                'value' => array(
                    'required' => true,
                    'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                    'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
                ),
            ),
        ),
    );
}

