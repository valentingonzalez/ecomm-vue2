<?php

class Path
{
    static private $path = null;

    public static function get()
    {
        if ( self::$path === null ) {
            // First we'll need a request URI
            $path = $_SERVER['REQUEST_URI'];

            // Remove the query string if it's present
            if ( ($query = strpos($path, '?')) !== false)  {
                $path = substr($path, 0, $query);
            }

            if ( isset($_SERVER['HTTP_HOST']) AND strpos($path, $_SERVER['HTTP_HOST']) !== false ) {
                $path = preg_replace('#^[^:]*://[^/]*/#', '/', $path);
            }

            self::$path = $path;
        }

        return self::$path;
    }

    public static function set($path)
    {
        self::$path = $path;
    }

    public static function matches($regex, &$m)
    {
        return preg_match($regex, self::get(), $m);
    }
}