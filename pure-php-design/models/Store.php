<?php
// Store model class

class Store {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::getInstance()->getConnection();
    }

    // Get store by ID
    public function getById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM stores WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    // Get stores for organization
    public function getByOrganization($organization_id) {
        $stmt = $this->pdo->prepare("SELECT * FROM stores WHERE organization_id = ? ORDER BY name");
        $stmt->execute([$organization_id]);
        return $stmt->fetchAll();
    }

    // Get store for user (based on session)
    public function getCurrentUserStore() {
        $store_id = getCurrentStoreId();
        if (!$store_id) return null;
        return $this->getById($store_id);
    }

    // Create new store
    public function create($data) {
        $stmt = $this->pdo->prepare("
            INSERT INTO stores (organization_id, name, address, phone, settings, status)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['organization_id'],
            $data['name'],
            $data['address'] ?? null,
            $data['phone'] ?? null,
            json_encode($data['settings'] ?? []),
            $data['status'] ?? 'active'
        ]);
        return $this->pdo->lastInsertId();
    }

    // Update store
    public function update($id, $data) {
        $stmt = $this->pdo->prepare("
            UPDATE stores SET
                name = ?,
                address = ?,
                phone = ?,
                settings = ?,
                status = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ");
        $stmt->execute([
            $data['name'],
            $data['address'] ?? null,
            $data['phone'] ?? null,
            json_encode($data['settings'] ?? []),
            $data['status'] ?? 'active',
            $id
        ]);
        return $stmt->rowCount() > 0;
    }

    // Delete store
    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM stores WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }

    // Get store inventory summary
    public function getInventorySummary($store_id) {
        $stmt = $this->pdo->prepare("
            SELECT
                COUNT(*) as total_products,
                SUM(quantity) as total_quantity,
                SUM(CASE WHEN quantity <= min_stock THEN 1 ELSE 0 END) as low_stock_items
            FROM inventory
            WHERE store_id = ?
        ");
        $stmt->execute([$store_id]);
        return $stmt->fetch();
    }

    // Get store sales summary
    public function getSalesSummary($store_id, $date_from = null, $date_to = null) {
        $query = "
            SELECT
                COUNT(*) as total_sales,
                SUM(total) as total_revenue,
                AVG(total) as avg_sale
            FROM sales
            WHERE store_id = ?
        ";
        $params = [$store_id];

        if ($date_from && $date_to) {
            $query .= " AND DATE(created_at) BETWEEN ? AND ?";
            $params[] = $date_from;
            $params[] = $date_to;
        }

        $stmt = $this->pdo->prepare($query);
        $stmt->execute($params);
        return $stmt->fetch();
    }
}
