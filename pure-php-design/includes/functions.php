<?php
// Helper functions for authentication and permissions

// Start session if not started
function startSession() {
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
}

// Check if user is logged in
function isLoggedIn() {
    startSession();
    return isset($_SESSION['user_id']);
}

// Get current user from session
function getCurrentUser() {
    startSession();
    return $_SESSION['user'] ?? null;
}

// Check if user has permission
function hasPermission($permission) {
    $user = getCurrentUser();
    if (!$user) return false;

    $userModel = new User();
    return $userModel->hasPermission($user['id'], $permission);
}

// Redirect if not logged in
function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: /login');
        exit;
    }
}

// Redirect if no permission
function requirePermission($permission) {
    requireLogin();
    if (!hasPermission($permission)) {
        header('Location: /unauthorized');
        exit;
    }
}

// Sanitize input
function sanitize($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

// Generate CSRF token
function generateCSRFToken() {
    startSession();
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// Verify CSRF token
function verifyCSRFToken($token) {
    startSession();
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// Log action
function logAction($action, $details = '') {
    $config = require __DIR__ . '/../config/config.php';
    if ($config['log_errors']) {
        $user = getCurrentUser();
        $user_id = $user ? $user['id'] : null;
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $logEntry = date('Y-m-d H:i:s') . " - User: $user_id - IP: $ip - Action: $action - Details: $details\n";
        file_put_contents($config['error_log_file'], $logEntry, FILE_APPEND);
    }
}

// Get store ID from session (for isolation)
function getCurrentStoreId() {
    $user = getCurrentUser();
    return $user ? $user['store_id'] : null;
}

// Get organization ID from session
function getCurrentOrganizationId() {
    $user = getCurrentUser();
    return $user ? $user['organization_id'] : null;
}
