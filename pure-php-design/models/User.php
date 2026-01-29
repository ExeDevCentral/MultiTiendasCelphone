<?php
// User model class
class User {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::getInstance()->getConnection();
    }

    // Authenticate user
    public function authenticate($email, $password) {
        $stmt = $this->pdo->prepare("SELECT id, organization_id, store_id, name, email, password, role_id FROM users WHERE email = ? AND status = 'active'");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            unset($user['password']); // Remove password from array
            return $user;
        }
        return false;
    }

    // Get user by ID
    public function getById($id) {
        $stmt = $this->pdo->prepare("SELECT id, organization_id, store_id, name, email, role_id FROM users WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    // Check if user has permission
    public function hasPermission($user_id, $permission_name) {
        $stmt = $this->pdo->prepare("
            SELECT COUNT(*) as count
            FROM users u
            JOIN roles r ON u.role_id = r.id
            JOIN role_permissions rp ON r.id = rp.role_id
            JOIN permissions p ON rp.permission_id = p.id
            WHERE u.id = ? AND p.name = ?
        ");
        $stmt->execute([$user_id, $permission_name]);
        $result = $stmt->fetch();
        return $result['count'] > 0;
    }

    // Get users for organization (for admins)
    public function getByOrganization($organization_id, $store_id = null) {
        $query = "SELECT id, name, email, role_id, store_id FROM users WHERE organization_id = ?";
        $params = [$organization_id];

        if ($store_id) {
            $query .= " AND store_id = ?";
            $params[] = $store_id;
        }

        $stmt = $this->pdo->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
}
