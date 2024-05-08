<?php

class DB
{
    private static $connections = [];
    private static $config = null;
    private static $redis = null;

    public static function init()
    {
        if ( self::$config === null ) {
            self::$config = require_once __DIR__ . '/config/database.php';
        }
    }

    /**
     * @return Redis
     * @throws RedisException
     */
    public static function redis()
    {
        self::init();
        if ( self::$redis === null ) {
            $conf = self::$config['redis'];
            self::$redis = new Redis();
            if ( $conf['socket'] ) {
                self::$redis->connect($conf['socket']);
            } else {
                self::$redis->connect($conf['host'], $conf['port']);
            }
            self::$redis->select($conf['db']);
        }
        return self::$redis;
    }

    /**
     * @param string $name
     * @return PDO
     */
    public static function get($name = 'local')
    {
        self::init();
        if ( !isset(self::$connections[$name]) ) {
            $config = self::$config[$name];
            self::$connections[$name] = new PDO("mysql:dbname=$config[name];host=$config[host]",
                $config['user'], $config['password'], $config['options']);
        }

        return self::$connections[$name];
    }

    /**
     * @return PDO
     */
    public static function local() {
        return self::get('local');
    }

    /**
     * @return PDO
     */
    public static function ecommerce() {
        return self::get('ecommerce');
    }

    /**
     * @param string $conn
     * @param string $query
     * @param array $params
     * @return bool|PDOStatement
     */
    public static function execute($conn, $query, array $params = []) {
        $stmt = self::get($conn)->prepare($query);
        $stmt->execute($params);
        return $stmt;
    }
}