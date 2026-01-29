-- Multi-Vendor POS System Database Schema
-- Pure PHP + MySQL

-- Create database
CREATE DATABASE IF NOT EXISTS multi_vendor_pos;
USE multi_vendor_pos;

-- Organizations table (global)
CREATE TABLE organizations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    settings JSON,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Stores table (per organization)
CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    settings JSON,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    INDEX idx_organization (organization_id)
);

-- Roles table (global permissions)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Permissions table (global)
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role-Permission relationship
CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Users table (per organization, optional store)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,
    store_id INT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE SET NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    INDEX idx_organization (organization_id),
    INDEX idx_store (store_id),
    INDEX idx_email (email)
);

-- Categories table (global or per organization)
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NULL, -- NULL for global, or per org
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    INDEX idx_organization (organization_id)
);

-- Products table (global or per organization)
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NULL, -- NULL for global
    category_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_organization (organization_id),
    INDEX idx_category (category_id),
    INDEX idx_sku (sku)
);

-- Inventory table (per store)
CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    store_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    min_stock INT DEFAULT 0,
    max_stock INT DEFAULT 0,
    last_restock_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_store_product (store_id, product_id),
    INDEX idx_store (store_id),
    INDEX idx_product (product_id)
);

-- Customers table (per store or global)
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    store_id INT NULL, -- NULL for global
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    INDEX idx_store (store_id),
    INDEX idx_email (email)
);

-- Payment Methods table (per store)
CREATE TABLE payment_methods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    store_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    type ENUM('cash', 'card', 'digital') DEFAULT 'cash',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    INDEX idx_store (store_id)
);

-- Cash Registers table (per store)
CREATE TABLE cash_registers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    store_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    status ENUM('open', 'closed') DEFAULT 'closed',
    opened_by INT,
    closed_by INT,
    opening_balance DECIMAL(10,2) DEFAULT 0,
    closing_balance DECIMAL(10,2) DEFAULT 0,
    opened_at TIMESTAMP NULL,
    closed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    FOREIGN KEY (opened_by) REFERENCES users(id),
    FOREIGN KEY (closed_by) REFERENCES users(id),
    INDEX idx_store (store_id)
);

-- Sales table (per store)
CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    store_id INT NOT NULL,
    user_id INT NOT NULL, -- Cashier
    customer_id INT NULL,
    cash_register_id INT NULL,
    total DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    payment_method_id INT,
    status ENUM('completed', 'refunded', 'voided') DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (cash_register_id) REFERENCES cash_registers(id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id),
    INDEX idx_store (store_id),
    INDEX idx_user (user_id),
    INDEX idx_created_at (created_at)
);

-- Sale Items table (per sale)
CREATE TABLE sale_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    INDEX idx_sale (sale_id),
    INDEX idx_product (product_id)
);

-- Request Logs table (for monitoring)
CREATE TABLE request_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    method VARCHAR(10),
    url TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    response_time FLOAT,
    status_code INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user (user_id),
    INDEX idx_created_at (created_at)
);

-- Client Error Logs table (for frontend errors)
CREATE TABLE client_error_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    error_message TEXT,
    stack_trace TEXT,
    url TEXT,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user (user_id),
    INDEX idx_created_at (created_at)
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('super_admin', 'Global system administrator'),
('org_admin', 'Organization administrator'),
('store_manager', 'Store manager'),
('cashier', 'Cashier for sales processing'),
('customer', 'Customer with limited access');

-- Insert default permissions
INSERT INTO permissions (name, description) VALUES
('manage_organizations', 'Create, edit, delete organizations'),
('manage_stores', 'Create, edit, delete stores'),
('manage_users', 'Manage users and roles'),
('manage_inventory', 'Manage products and inventory'),
('process_sales', 'Process sales transactions'),
('view_reports', 'View sales and inventory reports'),
('manage_settings', 'Edit system settings');

-- Assign permissions to roles
INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), -- Super admin all
(2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7), -- Org admin most
(3, 4), (3, 5), (3, 6), -- Store manager inventory, sales, reports
(4, 5); -- Cashier sales only
