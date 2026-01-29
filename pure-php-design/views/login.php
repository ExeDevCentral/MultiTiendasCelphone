<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Multi-Vendor POS</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .login-container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
        h1 { text-align: center; color: #333; }
        form { display: flex; flex-direction: column; }
        label { margin-bottom: 0.5rem; color: #555; }
        input { padding: 0.75rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 4px; }
        button { padding: 0.75rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
        .error { color: red; margin-bottom: 1rem; text-align: center; }
    </style>
</head>
<body>
    <div class="login-container">
        <h1>Login</h1>
        <?php if (isset($_GET['error'])): ?>
            <div class="error">
                <?php
                switch ($_GET['error']) {
                    case 'invalid_credentials': echo 'Invalid email or password'; break;
                    case 'csrf': echo 'Security error, please try again'; break;
                    default: echo 'Login failed';
                }
                ?>
            </div>
        <?php endif; ?>
        <form method="POST" action="/login">
            <input type="hidden" name="csrf_token" value="<?php echo generateCSRFToken(); ?>">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>

            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>

            <button type="submit">Login</button>
        </form>
    </div>
</body>
</html>
