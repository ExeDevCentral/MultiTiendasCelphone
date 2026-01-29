<?php
// Database configuration
return [
    'host' => 'localhost',
    'dbname' => 'multi_vendor_pos',
    'username' => 'root', // Change as needed
    'password' => '', // Change as needed
    'charset' => 'utf8mb4',
    'options' => [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ],
];
