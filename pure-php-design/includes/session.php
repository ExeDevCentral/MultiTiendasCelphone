<?php
// Session management functions

// Login user
function loginUser($user) {
    startSession();
    $_SESSION['user'] = $user;
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['organization_id'] = $user['organization_id'];
    $_SESSION['store_id'] = $user['store_id'];
    $_SESSION['last_activity'] = time();
    session_regenerate_id(true); // Prevent session fixation
}

// Logout user
function logoutUser() {
    startSession();
    session_unset();
    session_destroy();
    session_regenerate_id(true);
}

// Check if session is expired
function isSessionExpired() {
    startSession();
    $config = require __DIR__ . '/../config/config.php';
    $timeout = 3600; // 1 hour, can be configured
    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity']) > $timeout) {
        logoutUser();
        return true;
    }
    $_SESSION['last_activity'] = time();
    return false;
}

// Get session user
function getSessionUser() {
    startSession();
    return $_SESSION['user'] ?? null;
}

// Check if user is logged in and session not expired
function isAuthenticated() {
    return isLoggedIn() && !isSessionExpired();
}
