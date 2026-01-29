<?php
// Authentication controller

class AuthController {
    private $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    // Handle login
    public function login() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $email = sanitize($_POST['email'] ?? '');
            $password = $_POST['password'] ?? '';
            $csrf_token = $_POST['csrf_token'] ?? '';

            // Verify CSRF token
            if (!verifyCSRFToken($csrf_token)) {
                $error = 'Invalid request';
            } else {
                $user = $this->userModel->authenticate($email, $password);
                if ($user) {
                    loginUser($user);
                    logAction('login', "User {$user['email']} logged in");
                    header('Location: /dashboard');
                    exit;
                } else {
                    $error = 'Invalid email or password';
                }
            }
        }

        // Show login form
        include __DIR__ . '/../views/login.php';
    }

    // Handle logout
    public function logout() {
        $user = getCurrentUser();
        if ($user) {
            logAction('logout', "User {$user['email']} logged out");
        }
        logoutUser();
        header('Location: /login');
        exit;
    }

    // Check if user is authenticated (AJAX endpoint)
    public function checkAuth() {
        header('Content-Type: application/json');
        if (isLoggedIn() && !isSessionExpired()) {
            echo json_encode(['authenticated' => true, 'user' => getCurrentUser()]);
        } else {
            echo json_encode(['authenticated' => false]);
        }
    }
}
