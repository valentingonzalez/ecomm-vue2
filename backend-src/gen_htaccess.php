<?php

require_once __DIR__ . '/init.php';

$root = SITE_ROOT . '/public-site';
$root = str_replace('/mnt/pd0', '', $root);
$stmt = DB::ecommerce()->prepare('SELECT domain, store_id, business_id FROM business_vhosts WHERE root = ?');
$stmt->execute([$root]);
$domains = $stmt->fetchAll(PDO::FETCH_ASSOC);

$stmt = DB::ecommerce()->prepare('SELECT website_url FROM sitemaps WHERE path = ?');
$stmt->execute([dirname($root)]);
$realBase = $stmt->fetchColumn(0);
$realBase = rtrim($realBase, '/#');

$stmt = DB::ecommerce()->prepare('SELECT extra_data FROM businesses WHERE business_id = ?');
$stmt->execute([$domains[0]['business_id']]);
$extraData = $stmt->fetchColumn(0);
if ( $extraData ) {
    $extraData = json_decode($extraData, true);
    $hasSvelte = isset($extraData['svelte']) && $extraData['svelte'];
} else {
    $hasSvelte = false;
}

// if sitemap website_url has http:// but an SSL cert exists, change it to https
if ( $realBase && strpos($realBase, 'http://') === 0 ) {
    $realDomain = parse_url($realBase, PHP_URL_HOST);
    $sslDomain = $realDomain;
    // use shoptruevalue.com as SSL domain since we have a wildcard cert
    if ( strpos($realDomain, '.shoptruevalue.com') !== false ) {
        $sslDomain = 'shoptruevalue.com';
    }
    if ( is_dir("/etc/letsencrypt/live/$sslDomain") ) {
        echo "switching REALBASE to SSL since cert folder exists\n";
        $realBase = str_replace('http://', 'https://', $realBase);
    }
}

echo "REALBASE=$realBase\n";

// other live domains allowed for vassar
$allowedLiveDomains = [];
if ( dirname($root) == '/home/heyads/www-vassartruevaluehardware' ) {
    $allowedLiveDomains[] = 'frankenmuthtruevalue.com';
    $allowedLiveDomains[] = 'www.frankenmuthtruevalue.com';
}
if ( dirname($root) == '/home/heyads/www-brinkmannhardware' ) {
    $allowedLiveDomains[] = 'brinkmannhardware.com';
    $allowedLiveDomains[] = 'shop.brinkmannhardware.com';
}

// add SSL redirects for any domain on this site that has SSL certs generated in /etc/letsencrypt/live
$redirects = '';
foreach ( $domains as $dom ) {
    $domain = $dom['domain'];
    // if store_id is present, we want to generate the redirect with a ?selectedStore=xxx
    $storeId = $dom['store_id'];
    $sslDomain = $domain;
    if ( strpos($domain, '.shoptruevalue.com') !== false ) {
        $sslDomain = 'shoptruevalue.com';
    }
    if ( strpos($domain, '.ezad.io') !== false ) {
        $sslDomain = 'ezad.io';
    }

    $query = '';
    if ( $storeId ) {
        $query = '?selectedStore=' . $storeId;
    }

    if ( is_dir("/etc/letsencrypt/live/$sslDomain") && strpos($domain, 'ecdevfe') === false ) {
        echo " - Adding SSL redirect for $domain\n";
        $escaped = str_replace('.', '\.', $domain);
        // if we have a store_id on this vhost, do the redirect no matter if it's https or not.
        if ( !$storeId ) {
            $redirects .= "RewriteCond %{HTTPS} off\n";
        }
        $redirects .= "RewriteCond %{HTTP_HOST} ^$escaped$\n";
        if ( $realBase && !in_array($domain, $allowedLiveDomains) ) {
            // use real domain here to avoid potential 2 redirects
            $redirects .= "RewriteRule ^(.*)$ $realBase%{REQUEST_URI}$query [L,R=301,QSA]\n\n";
         } else {
            $redirects .= "RewriteRule ^(.*)$ https://$domain%{REQUEST_URI}$query [L,R=301,QSA]\n\n";
        }
    }
}

// Force redirect to the real domain from sitemaps
if ( $realBase ) {
    $realDomain = parse_url($realBase, PHP_URL_HOST);
    $redirects .= "RewriteCond %{HTTP_HOST} \"!=$realDomain\"\n";
    foreach ( $allowedLiveDomains as $otherReal ) {
        $redirects .= "RewriteCond %{HTTP_HOST} \"!=$otherReal\"\n";
    }
    $redirects .= "RewriteRule ^(.*)$ $realBase%{REQUEST_URI} [L,R=301]\n\n";
}

$com = $hasSvelte ? '#' : '';

$template = <<<HTAC
RewriteEngine On
RewriteBase /

DirectoryIndex index.php index.html

# if url is index.php don't do anything more
RewriteRule ^index\.php$ - [L]

$redirects

$com RewriteCond %{REQUEST_FILENAME} !-f
$com RewriteCond %{REQUEST_FILENAME} !-d
$com RewriteRule . /index.php [L]

<FilesMatch "\.html$">
    FileETag None
    Header unset ETag
    Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "Wed, 11 Jan 1984 05:00:00 GMT"
</FilesMatch>

<IfModule mod_mime.c>
    <IfModule mod_deflate.c>
        AddOutputFilter DEFLATE js css vue ttf
    </IfModule>

    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresByType image/jpeg "access plus 1 week"
        ExpiresByType image/png "access plus 1 week"
        ExpiresByType image/gif "access plus 1 week"
        ExpiresByType image/x-icon "access plus 1 week"
        ExpiresByType text/css "access plus 1 year"
        ExpiresByType application/javascript "access plus 1 year"

        # font files themselves will never "update", generally just be removed or added.
        # so, 1 month is fine (and probably can be longer)
        ExpiresByType application/x-font-ttf "access plus 1 year"
        ExpiresByType font/ttf "access plus 1 year"
        ExpiresByType application/x-font-otf "access plus 1 year"
        ExpiresByType application/x-font-woff "access plus 1 year"
    </IfModule>
</IfModule>
HTAC;

// write to both places if they exist, so it works in both old/new deployment setups
if ( is_dir(SITE_ROOT . '/dist') ) {
    file_put_contents(SITE_ROOT . '/dist/.htaccess', $template);
}
if ( is_dir(SITE_ROOT . '/public-site') ) {
    $ps = SITE_ROOT . '/public-site';
    file_put_contents("$ps/.htaccess", $template);
    if ( $hasSvelte ) {
        if ( !is_dir("$ps/admin") ) {
            mkdir("$ps/admin");
        }
        if ( !file_exists("$ps/admin/index.php") ) {
            symlink("$ps/index.php", "$ps/admin/index.php");
        }
    }
}
