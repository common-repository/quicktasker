<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

use WPQT\Response\ApiResponse;
use WPQT\UserPage\UserPageService;
use WPQT\UserPage\UserPageRepository;
use WPQT\Password\PasswordService;
use WPQT\Session\SessionService;
use WPQT\Nonce\NonceService;
use WPQT\Pipeline\PipelineRepository;
use WPQT\Pipeline\PipelineService;
use WPQT\Task\TaskRepository;
use WPQT\User\UserService;
use WPQT\WPQTException;
use WPQT\RequestValidation;
use WPQT\Permission\PermissionService;
use WPQT\Stage\StageRepository;
use WPQT\Task\TaskService;
use WPQT\Log\LogService;
use WPQT\Comment\CommentRepository;
use WPQT\Comment\CommentService;
use WPQT\User\UserRepository;
use WPQT\CustomField\CustomFieldRepository;
use WPQT\CustomField\CustomFieldService;

add_action('rest_api_init', 'wpqt_register_user_page_api_routes');
function wpqt_register_user_page_api_routes() {
    register_rest_route('wpqt/v1', 'user-pages/(?P<hash>[a-zA-Z0-9]+)/status', array(
        'methods' => 'GET',
        'callback' => function( $data ) {
                try {
                    RequestValidation::validateUserPageApiRequest($data, array('session' => false));
                    $userPageRepository = new UserPageRepository();
                    $userPageService = new UserPageService();
                    $userPage = $userPageRepository->getPageUserByHash($data['hash']);

                    if($userPage === null) {
                        throw new WPQTException('User page not found', true);
                    }
                    $hasSetupCompleted = $userPageService->checkIfUserPageSetupCompleted($userPage->user_id);

                    $userPageStatus = (object)[
                        'isActiveUser' => $userPage->is_active,
                        'setupCompleted' => $hasSetupCompleted,
                        'userId' => $userPage->user_id,
                        'userName' => $userPage->name,
                    ];

                    return new WP_REST_Response((new ApiResponse(true, array(), $userPageStatus))->toArray(), 200);
                } catch(WPQTException $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array()))->toArray(), 400);
                }
            },
        'permission_callback' => '__return_true',
        'args' => array(
            'hash' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
        ),
    ));

    register_rest_route('wpqt/v1', 'user-pages/(?P<hash>[a-zA-Z0-9]+)/setup', array(
        'methods' => 'POST',
        'callback' => function( $data ) {
                try {
                    RequestValidation::validateUserPageApiRequest($data, array('session' => false));
                    $userPageRepository = new UserPageRepository();
                    $userPageService = new UserPageService();
                    $passwordService = new PasswordService();
                    $logService = new LogService();

                    $userPage = $userPageRepository->getPageUserByHash($data['hash']);
                    $hasSetupCompleted = $userPageService->checkIfUserPageSetupCompleted($userPage->user_id);

                    if( $hasSetupCompleted ) {
                        throw new WPQTException('User page setup has already been completed', true);
                    }
                    $passwordService->storePassword($userPage->user_id, $data['password']);
                    $logService->log('User page setup completed', WP_QT_LOG_TYPE_USER, $userPage->user_id, WP_QT_LOG_CREATED_BY_QUICKTASKER_USER, $userPage->user_id);

                    return new WP_REST_Response((new ApiResponse(true, array()))->toArray(), 200);
                } catch(WPQTException $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array()))->toArray(), 400);
                }
            },
        'permission_callback' => '__return_true',
        'args' => array(
            'hash' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
            'password' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
        ),
    ));

    register_rest_route('wpqt/v1', 'user-pages/(?P<hash>[a-zA-Z0-9]+)/login', array(
        'methods' => 'POST',
        'callback' => function( $data ) {
                try {
                    RequestValidation::validateUserPageApiRequest($data, array('session' => false));
                    $passwordService = new PasswordService();
                    $sessionService = new SessionService();
                    $userPageRepository = new UserPageRepository();
                    $logService = new LogService();

                    if($data['password'] === null) {
                        throw new WPQTException('Password is required');
                    }
                
                    $passwordMatch = $passwordService->verifyPassword($data['hash'], $data['password']);

                    if( !$passwordMatch ) {
                        throw new WPQTException('Invalid password', true);
                    }
                    
                    $userPage = $userPageRepository->getPageUserByHash($data['hash']);
                    $userSession = $sessionService->createSession($userPage->user_id, $data['hash']);
                    $logService->log('User logged in', WP_QT_LOG_TYPE_USER, $userPage->user_id, WP_QT_LOG_CREATED_BY_QUICKTASKER_USER, $userPage->user_id);

                    return new WP_REST_Response((new ApiResponse(true, array(), (object)[
                        'sessionToken' => $userSession->session_token,
                        'expiresAtUTC' => $userSession->expires_at_utc
                    ]))->toArray(), 200);
                } catch(WPQTException $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array()))->toArray(), 400);
                }
            },
        'permission_callback' => '__return_true',
        'args' => array(
            'hash' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
            'password' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
        ),
    ));

    register_rest_route('wpqt/v1', 'user-pages/(?P<hash>[a-zA-Z0-9]+)/logout', array(
        'methods' => 'POST',
        'callback' => function( $data ) {
                try {
                    $session = RequestValidation::validateUserPageApiRequest($data)['session'];
                    $sessionService = new SessionService();
                    $logService = new LogService();
                    
                    $sessionToken = sanitize_text_field($_COOKIE['wpqt-session-token-' . $data['hash']]);
                    $sessionService->markSessionInactive($sessionToken);

                    $logService->log('User logged out', WP_QT_LOG_TYPE_USER, $session->user_id, WP_QT_LOG_CREATED_BY_QUICKTASKER_USER, $session->user_id);

                    return new WP_REST_Response((new ApiResponse(true, array()))->toArray(), 200);  
                } catch(WPQTException $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array()))->toArray(), 400);
                }
            },
        'permission_callback' => '__return_true',
        'args' => array(
            'hash' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
        ),
    ));

    register_rest_route('wpqt/v1', 'user-pages/(?P<hash>[a-zA-Z0-9]+)/overview', array(
        'methods' => 'GET',
        'callback' => function( $data ) {
                try {
                    $session = RequestValidation::validateUserPageApiRequest($data)['session'];
                    $taskRepository = new TaskRepository();
                    $assignedTasks = $taskRepository->getTasksAssignedToUser($session->user_id);
                    $assignableTasks = $taskRepository->getTasksAssignableToUser($session->user_id);

                    $overviewData = (object)[
                        'assignedTasksCount' => count($assignedTasks),
                        'assignableTaskCount' => count($assignableTasks)
                    ];

                    return new WP_REST_Response((new ApiResponse(true, array(), $overviewData))->toArray(), 200);
                } catch(WPQTException $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array()))->toArray(), 400);
                }
            },
        'permission_callback' => '__return_true',
        'args' => array(
            'hash' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
        ),

    ));

    register_rest_route('wpqt/v1', 'user-pages/(?P<hash>[a-zA-Z0-9]+)/assigned-tasks', array(
        'methods' => 'GET',
        'callback' => function( $data ) {
                try {
                    $session = RequestValidation::validateUserPageApiRequest($data)['session'];
                    $taskRepository = new TaskRepository();
                    $assignedTasks = $taskRepository->getTasksAssignedToUser($session->user_id);

                    return new WP_REST_Response((new ApiResponse(true, array(), $assignedTasks))->toArray(), 200);
                } catch(WPQTException $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array()))->toArray(), 400);
                }
            },
        'permission_callback' => '__return_true',
        'args' => array(
            'hash' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
        ),
    ));

    register_rest_route('wpqt/v1', 'user-pages/(?P<hash>[a-zA-Z0-9]+)/assignable-tasks', array(
        'methods' => 'GET',
        'callback' => function( $data ) {
                try {
                    $session = RequestValidation::validateUserPageApiRequest($data)['session'];
                    $taskRepository = new TaskRepository();
                    $assignableTasks = $taskRepository->getTasksAssignableToUser($session->user_id);

                    return new WP_REST_Response((new ApiResponse(true, array(), $assignableTasks))->toArray(), 200);
                } catch(WPQTException $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array()))->toArray(), 400);
                }
            },
        'permission_callback' => '__return_true',
        'args' => array(
            'hash' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
        ),
    ));

    register_rest_route('wpqt/v1', 'user-pages/(?P<hash>[a-zA-Z0-9]+)/tasks/(?P<task_hash>[a-zA-Z0-9]+)', array(
        'methods' => 'GET',
        'callback' => function( $data ) {
                try {
                    $session = RequestValidation::validateUserPageApiRequest($data)['session'];
                    $userService = new UserService();
                    $taskRepository = new TaskRepository();
                    $permissionService = new PermissionService();
                    $stageRepository = new StageRepository();
                    $customFieldRepository = new CustomFieldRepository();
                    $task = $taskRepository->getTaskByHash($data['task_hash'], true);
                   
                    if(!$permissionService->checkIfUserIsAllowedToViewTask($session->user_id, $task->id)) {
                        throw new WPQTException('Not allowed', true);
                    }

                    $data = (object)[
                        'task' => $task,
                        'stages' => $stageRepository->getStagesByPipelineId($task->pipeline_id),
                        'customFields' => $customFieldRepository->getRelatedCustomFields($task->id, 'task')
                    ];

                    return new WP_REST_Response((new ApiResponse(true, array(), $data))->toArray(), 200);
                } catch(WPQTException $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array()))->toArray(), 400);
                }
            },
        'permission_callback' => '__return_true',
        'args' => array(
            'hash' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
            'task_hash' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
        ),
    ));

    register_rest_route('wpqt/v1', 'user-pages/(?P<hash>[a-zA-Z0-9]+)/tasks/(?P<task_hash>[a-zA-Z0-9]+)/comments', array(
        'methods' => 'GET',
        'callback' => function( $data ) {
                try {
                    $session = RequestValidation::validateUserPageApiRequest($data)['session'];
                    $taskRepository = new TaskRepository();
                    $permissionService = new PermissionService();
                    $commentRepository = new CommentRepository();

                    $task = $taskRepository->getTaskByHash($data['task_hash']);

                    if($task === null) {
                        throw new WPQTException('Task not found', true);
                    }
                    if(!$permissionService->checkIfUserIsAllowedToEditTask($session->user_id, $task->id)) {
                        throw new WPQTException('Not allowed', true);
                    }

                    $comments = $commentRepository->getComments($task->id, 'task', false);

                    return new WP_REST_Response((new ApiResponse(true, array(), $comments))->toArray(), 200);
                } catch(WPQTException $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array()))->toArray(), 400);
                }
            },
        'permission_callback' => '__return_true',
        'args' => array(
            'hash' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
            'task_hash' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
        ),
    ));

    register_rest_route('wpqt/v1', 'user-pages/(?P<hash>[a-zA-Z0-9]+)/tasks/(?P<task_hash>[a-zA-Z0-9]+)/comments', array(
        'methods' => 'POST',
        'callback' => function( $data ) {
                try {
                    $session = RequestValidation::validateUserPageApiRequest($data)['session'];
                    $taskRepository = new TaskRepository();
                    $permissionService = new PermissionService();
                    $commentService = new CommentService();
                    $commentRepository = new CommentRepository();
                    $logService = new LogService();

                    $task = $taskRepository->getTaskByHash($data['task_hash']);

                    if($task === null) {
                        throw new WPQTException('Task not found', true);
                    }
                    if(!$permissionService->checkIfUserIsAllowedToEditTask($session->user_id, $task->id)) {
                        throw new WPQTException('Not allowed', true);
                    }
                    $commentService->createComment($task->id, 'task', false, $data['comment'], $session->user_id, false);
                    $logService->log('User posted a comment on '. $task->name . ' task', WP_QT_LOG_TYPE_USER, $session->user_id, WP_QT_LOG_CREATED_BY_QUICKTASKER_USER, $session->user_id);
                    $comments = $commentRepository->getComments($task->id, 'task', false);

                    return new WP_REST_Response((new ApiResponse(true, array(), $comments))->toArray(), 200);
                } catch(WPQTException $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array()))->toArray(), 400);
                }
            },
        'permission_callback' => '__return_true',
        'args' => array(
            'hash' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
            'task_hash' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
            'comment' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
        ),
    ));

    register_rest_route('wpqt/v1', 'user-pages/(?P<hash>[a-zA-Z0-9]+)/user/comments', array(
        'methods' => 'GET',
        'callback' => function( $data ) {
                try {
                    $session = RequestValidation::validateUserPageApiRequest($data)['session'];
                    $commentRepository = new CommentRepository();
                    
                    $userComments = $commentRepository->getComments($session->user_id, 'user', false);

                    return new WP_REST_Response((new ApiResponse(true, array(), $userComments))->toArray(), 200);
                } catch(WPQTException $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array()))->toArray(), 400);
                }
            },
        'permission_callback' => '__return_true',
        'args' => array(
            'hash' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
        ),
    ));

    register_rest_route('wpqt/v1', 'user-pages/(?P<hash>[a-zA-Z0-9]+)/comments', array(
        'methods' => 'GET',
        'callback' => function( $data ) {
                try {
                    $session = RequestValidation::validateUserPageApiRequest($data)['session'];
                    $commentRepository = new CommentRepository();
                    
                    $comments = $commentRepository->getCommentsRelatedToUser($session->user_id);

                    return new WP_REST_Response((new ApiResponse(true, array(), $comments))->toArray(), 200);
                } catch(WPQTException $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array()))->toArray(), 400);
                }
            },
        'permission_callback' => '__return_true',
        'args' => array(
            'hash' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
        ),
    ));

    register_rest_route('wpqt/v1', 'user-pages/(?P<hash>[a-zA-Z0-9]+)/user/comments', array(
        'methods' => 'POST',
        'callback' => function( $data ) {
                try {
                    $session = RequestValidation::validateUserPageApiRequest($data)['session'];
                    $commentRepository = new CommentRepository();
                    $commentService = new CommentService();
                    $logService = new LogService();
                    
                    $commentService->createComment($session->user_id, 'user', false, $data['comment'], $session->user_id, false);
                    $userComments = $commentRepository->getComments($session->user_id, 'user', false);
                    $logService->log('User posted a comment on its profile', WP_QT_LOG_TYPE_USER, $session->user_id, WP_QT_LOG_CREATED_BY_QUICKTASKER_USER, $session->user_id);

                    return new WP_REST_Response((new ApiResponse(true, array(), $userComments))->toArray(), 200);
                } catch(WPQTException $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array()))->toArray(), 400);
                }
            },
        'permission_callback' => '__return_true',
        'args' => array(
            'hash' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
            'comment' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
        ),
    ));

    register_rest_route('wpqt/v1', 'user-pages/(?P<hash>[a-zA-Z0-9]+)/tasks/(?P<task_hash>[a-zA-Z0-9]+)/users', array(
        'methods' => 'POST, DELETE',
        'callback' => function( $data ) {
                try {
                    $session = RequestValidation::validateUserPageApiRequest($data)['session'];
                    $userService = new UserService();
                    $taskRepository = new TaskRepository();
                    $permissionService = new PermissionService();
                    $userPageRepository = new UserPageRepository();
                    $logService = new LogService();

                    $task = $taskRepository->getTaskByHash($data['task_hash']);
                    $taskId = $task->id;
                    $userPage = $userPageRepository->getPageUserByHash($data['hash']); 
                  
                    if ($data->get_method() === 'POST') {
                        if(!$permissionService->checkIfUserCanBeAssignedToTask($session->user_id, $taskId)) {
                            throw new WPQTException('Not allowed to assign', true);
                        }
                        $userService->assignTaskToUser($session->user_id, $taskId);
                        $logService->log('Assigned itself to ' . $task->name .  ' task', WP_QT_LOG_TYPE_USER, $session->user_id, WP_QT_LOG_CREATED_BY_QUICKTASKER_USER, $session->user_id);
                        $logService->log($userPage->name . ' assigned itself to the task', WP_QT_LOG_TYPE_TASK, $taskId, WP_QT_LOG_CREATED_BY_QUICKTASKER_USER, $session->user_id);
                    } elseif ($data->get_method() === 'DELETE') {
                        $userService->removeTaskFromUser($session->user_id, $taskId);
                        $logService->log('Unassigned itself from ' . $task->name .  ' task', WP_QT_LOG_TYPE_USER, $session->user_id, WP_QT_LOG_CREATED_BY_QUICKTASKER_USER, $session->user_id);
                        $logService->log($userPage->name . ' unassigned itself from the task', WP_QT_LOG_TYPE_TASK, $taskId, WP_QT_LOG_CREATED_BY_QUICKTASKER_USER, $session->user_id);
                    }

                    $task = $taskRepository->getTaskByHash($data['task_hash'], true);

                    return new WP_REST_Response((new ApiResponse(true, array(), $task))->toArray(), 200);
                } catch(WPQTException $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array()))->toArray(), 400);
                }
            },
        'permission_callback' => '__return_true',
        'args' => array(
            'hash' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
            'task_hash' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
        ),
    ));

    register_rest_route('wpqt/v1', 'user-pages/(?P<hash>[a-zA-Z0-9]+)/tasks/(?P<task_hash>[a-zA-Z0-9]+)/stage', array(
        'methods' => 'PATCH',
        'callback' => function( $data ) {
                try {
                    $session = RequestValidation::validateUserPageApiRequest($data)['session'];
                    $taskRepository = new TaskRepository();
                    $permissionService = new PermissionService();
                    $stageRepository = new StageRepository();
                    $taskService = new TaskService();
                    $logService = new LogService();
                    $userPageRepository = new UserPageRepository();

                    $task = $taskRepository->getTaskByHash($data['task_hash'], true);
                   
                    if(!$permissionService->checkIfUserIsAllowedToEditTask($session->user_id, $task->id)) {
                        throw new WPQTException('Not allowed', true);
                    }
                    $moveInfo = $taskService->moveTask($task->id, $data['stageId'], 0);
                    $stage = $stageRepository->getStageById($moveInfo->newStageId);
                    $userPage = $userPageRepository->getPageUserByHash($data['hash']); 

                    $logService->log('User ' . $userPage->name . ' changed task stage to ' . $stage->name, WP_QT_LOG_TYPE_TASK, $task->id, WP_QT_LOG_CREATED_BY_QUICKTASKER_USER, $session->user_id);
                    $logService->log('User changed task ' . $task->name . ' stage to ' . $stage->name, WP_QT_LOG_TYPE_USER, $session->user_id, WP_QT_LOG_CREATED_BY_QUICKTASKER_USER, $session->user_id);

                    return new WP_REST_Response((new ApiResponse(true, array()))->toArray(), 200);
                } catch(WPQTException $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array()))->toArray(), 400);
                }
            },
        'permission_callback' => '__return_true',
        'args' => array(
            'hash' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
            'task_hash' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
            'stageId' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
            ),
        ),
    ));

    register_rest_route('wpqt/v1', 'user-pages/(?P<hash>[a-zA-Z0-9]+)/tasks/(?P<task_hash>[a-zA-Z0-9]+)/done', array(
        'methods' => 'PATCH',
        'callback' => function( $data ) {
                try {
                    $session = RequestValidation::validateUserPageApiRequest($data)['session'];
                    $permissionService = new PermissionService();
                    $taskService = new TaskService();
                    $logService = new LogService();
                    $taskRepository = new TaskRepository();
                    $userPageRepository = new UserPageRepository();

                    $task = $taskRepository->getTaskByHash($data['task_hash']);
                    
                    if(!$permissionService->checkIfUserIsAllowedToEditTask($session->user_id, $task->id)) {
                        throw new WPQTException('Not allowed to edit the task', true);
                    }
                    $userPage = $userPageRepository->getPageUserByHash($data['hash']); 

                    $taskService->changeTaskDoneStatus($task->id, $data['done']);
                    $logMessage = $userPage->name . ' changed task to ' . ($data['done'] === true ? 'completed' : 'not completed');

                    $logService->log($logMessage, WP_QT_LOG_TYPE_TASK, $task->id, WP_QT_LOG_CREATED_BY_QUICKTASKER_USER, $session->user_id);

                    return new WP_REST_Response((new ApiResponse(true, array()))->toArray(), 200);
                } catch(WPQTException $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array()))->toArray(), 400);
                }
            },
        'permission_callback' => '__return_true',
        'args' => array(
            'hash' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
            'task_hash' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
            'done' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateBooleanParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeBooleanParam'),
            ),
        ),
    ));

    register_rest_route('wpqt/v1', 'user-pages/(?P<hash>[a-zA-Z0-9]+)/user', array(
        'methods' => 'GET',
        'callback' => function( $data ) {
                try {
                    $session = RequestValidation::validateUserPageApiRequest($data)['session'];
                    $userRepository = new UserRepository();
                    $customFieldRepository = new CustomFieldRepository();

                    $data = (object)[
                        'user' => $userRepository->getUserById($session->user_id),
                        'customFields' => $customFieldRepository->getRelatedCustomFields($session->user_id, 'user')
                    ];

                    return new WP_REST_Response((new ApiResponse(true, array(), $data))->toArray(), 200);
                } catch(WPQTException $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array()))->toArray(), 400);
                }
            },
        'permission_callback' => '__return_true',
        'args' => array(
            'hash' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
        ),
    ));

     /*
    ==================================================================================================================================================================================================================
    Custom Field endpoints
    ==================================================================================================================================================================================================================
    */

     register_rest_route('wpqt/v1', 'user-pages/(?P<hash>[a-zA-Z0-9]+)/custom-fields/(?P<custom_field_id>\d+)', array(
        'methods' => 'PATCH',
        'callback' => function( $data ) {
                try {
                    $session = RequestValidation::validateUserPageApiRequest($data)['session'];

                    if($data['entityType'] === 'task') {
                        $permissionService = new PermissionService();
                        if(!$permissionService->checkIfUserIsAllowedToEditTask($session->user_id, $data['entityId'])) {
                            throw new WPQTException('Not allowed to edit task custom fields', true);
                        }
                    } else {
                        if($session->user_id !== $data['entityId']) {
                            throw new WPQTException('Entity ID and session user mismatch', true);
                        }
                    } 
                    $customFieldService = new CustomFieldService();
                    $customFieldRepo = new CustomFieldRepository();
                    $logService = new LogService();

                    $customField = $customFieldRepo->getCustomFieldById($data['custom_field_id']);
                    $customFieldService->updateCustomFieldValue($data['customFieldId'], $data['entityId'], $data['entityType'], $data['value']);
                    $logService->log('Custom field ' . $customField->name . ' value updated', $customField->entity_type, $customField->entity_id, WP_QT_LOG_CREATED_BY_QUICKTASKER_USER, $session->user_id);
                  
                    return new WP_REST_Response((new ApiResponse(true, array()))->toArray(), 200);
                } catch(WPQTException $e) {
                    return new WP_REST_Response((new ApiResponse(false, array($e->getMessage())))->toArray(), 400);
                } catch (Exception $e) {
                    return new WP_REST_Response((new ApiResponse(false, array()))->toArray(), 400);
                }
            },
        'permission_callback' => '__return_true',
        'args' => array(
            'hash' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
            'entityId' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
            'entityType' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateUserPageCustomFieldEntityType'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
            'value' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateStringParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeStringParam'),
            ),
            'customFieldId' => array(
                'required' => true,
                'validate_callback' => array('WPQT\RequestValidation', 'validateNumericParam'),
                'sanitize_callback' => array('WPQT\RequestValidation', 'sanitizeAbsint'),
            ),
        ),
    )); 
}