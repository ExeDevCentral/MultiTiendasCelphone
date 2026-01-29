<?php
// Entry point for the application

// Load configuration
$config = require __DIR__ . '/../config/config.php';

// Set timezone
date_default_timezone_set($config['timezone']);

// Start session
startSession();

// Autoload classes (simple autoloader)
spl_autoload_register(function ($class) {
    $paths = [
        __DIR__ . '/../models/',
        __DIR__ . '/../controllers/',
        __DIR__ . '/../includes/'
    ];
    foreach ($paths as $path) {
        $file = $path . $class . '.php';
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }
});

// Simple routing
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Remove query string and leading slash
$path = trim($path, '/');

// Basic routing
switch ($path) {
    case '':
    case 'dashboard':
        requireLogin();
        include __DIR__ . '/../views/dashboard.php';
        break;

    case 'login':
        if ($method === 'GET') {
            include __DIR__ . '/../views/login.php';
        } elseif ($method === 'POST') {
            $authController = new AuthController();
            $authController->login();
        }
        break;

    case 'logout':
        if ($method === 'POST') {
            $authController = new AuthController();
            $authController->logout();
        }
        break;

    case 'api/check-auth':
        $authController = new AuthController();
        $authController->checkAuth();
        break;

    default:
        http_response_code(404);
        echo 'Page not found';
        break;
}

// Log request
logAction('page_view', $path);
