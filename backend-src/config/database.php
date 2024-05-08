<?php

// this is the parent folder of the ecommerce project. on the server it's /home/heyads.
// doing this so we have one config file working for all sites.
$private = require_once __DIR__ . '/../../../ecommerce_private_config.php';

$sslKeyRoot = $private['ssl_key_root'] ?? __DIR__;
$isDev = strpos(__DIR__, 'www-ecdevfe') !== false || strpos(__DIR__, '/var/www/html/sites') !== false;

return [
    'redis' => [
        'host' => $private['redis_host'] ?? 'localhost',
        'port' => $private['redis_port'] ?? 6379,
        'socket' => $private['redis_socket'] ?? null,
        'db' => $private['redis_db'] ?? 0,
    ],
    'local' => [
        'host' => $private['local_db_host'] ?? 'localhost',
        'name' => $private['local_db_name'] ?? 'heyads',
        'user' => $private['local_db_user'] ?? 'root',
        'password' => $private['local_db_password'] ?? '123456',
    ],
    'ecommerce' => [
        'host' => $private[($isDev ? 'dev_' : '') . 'ecommerce_db_host'] ?? '35.193.145.79',
        'name' => $private[($isDev ? 'dev_' : '') . 'ecommerce_db_name'] ?? 'ecommerce',
        'user' => $private[($isDev ? 'dev_' : '') . 'ecommerce_db_user'] ?? 'ecommerce',
        'password' => $private[($isDev ? 'dev_' : '') . 'ecommerce_db_password'] ?? '',
        'options' => $isDev ? [
            PDO::MYSQL_ATTR_SSL_KEY  => $sslKeyRoot . '/dev-client-key.pem',
            PDO::MYSQL_ATTR_SSL_CERT => $sslKeyRoot . '/dev-client-cert.pem',
            PDO::MYSQL_ATTR_SSL_CA   => $sslKeyRoot . '/dev-server-ca.pem',
            PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false, // if this is not here, PHP crashes.
        ] : [
            PDO::MYSQL_ATTR_SSL_KEY  => $sslKeyRoot . '/sql-client-key.pem',
            PDO::MYSQL_ATTR_SSL_CERT => $sslKeyRoot . '/sql-client-cert.pem',
            PDO::MYSQL_ATTR_SSL_CA   => $sslKeyRoot . '/sql-server-ca.pem',
            PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false, // if this is not here, PHP crashes.
        ],
    ],
    'ecommerce2' => [
        'host' => $private['ecommerce2_db_host'] ?? '35.239.226.224',
        'name' => $private['ecommerce2_db_name'] ?? 'ecommerce',
        'user' => $private['ecommerce2_db_user'] ?? 'ecommerce',
        'password' => $private['ecommerce2_db_password'] ?? '',
        'options' => [
            PDO::MYSQL_ATTR_SSL_KEY  => $sslKeyRoot . '/sql2-client-key.pem',
            PDO::MYSQL_ATTR_SSL_CERT => $sslKeyRoot . '/sql2-client-cert.pem',
            PDO::MYSQL_ATTR_SSL_CA   => $sslKeyRoot . '/sql2-server-ca.pem',
            PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false, // if this is not here, PHP crashes.
        ],
    ],
];
