<?php

error_reporting(E_ALL & ~E_NOTICE);
ini_set('display_errors', '0');

define('SITE_ROOT', dirname(__DIR__));
// on live site if site root contains /home/heyads/www
define('IS_LIVE', strpos(SITE_ROOT, '/home/heyads/www-') !== false);

require_once __DIR__ . '/Html.php';
require_once __DIR__ . '/Path.php';
require_once __DIR__ . '/DB.php';

// Checks multiple different methods to find the current business.
// Look at hostname, folder, and finally the slug in the settings json file.
function findBusiness()
{
    //$isSteven = $_SERVER['REMOTE_ADDR'] == '68.61.217.185';

    // SITE_ROOT is /mnt/pd0/home/heyads/www-whatever, we just want www-whatever
    $folder = basename(SITE_ROOT);
    $business = false;

    // if this is a subfolder of truevalue ecommerce, include that
    if ( strpos(SITE_ROOT, 'www-truevalue-ecommerce') !== false ) {
        $folder = 'www-truevalue-ecommerce/' . $folder;
    }

    $settingsFolder = "/home/heyads/ecom-deploy/allsettings";

    // attempt to get partner_business first because we want the "main" account's details, as that would
    // typically have all the proper information filled in.
    // this is necessary as multi-stores will have multiple rows in businesses with the same directory.
    if ( IS_LIVE ) {
        $stmt = DB::execute('ecommerce',
            'SELECT IFNULL(partner_business, business_id) FROM businesses WHERE server_directory = ?', [$folder]);
        $businessId = $stmt->fetchColumn(0);
        if ( strpos($folder, 'www-ecdevfe') !== false ) {
            $businessId = 0;
        }

        if ( !$businessId && ($folder === 'www-ecom-dev' || $folder === 'www-ecom-merged'
                || strpos($folder, 'www-ecom-staging') !== false || strpos($folder, 'www-ecdevfe') !== false
                || strpos($folder, 'www-greatmerge') !== false) ) {
            $filename = findSettingsFilename();
            if ( $filename ) {
                $businessId = str_replace('.json', '', $filename);
            }
        }
        $isDev = $businessId >= 5073 && $businessId <= 5077;
        if ( !$isDev && !is_file("$settingsFolder/$businessId.json") ) {
            // for some reason settings doesn't exist in master folder, so we can't use this method
            $businessId = false;
        }
    } else {
        // on local, always use old settings method
        $businessId = false;
    }

    // use {slug}.dev.ez-ad.io
    if ( strpos(SITE_ROOT, 'www-ecom-dynamicdev') !== false ) {
        $host = $_SERVER['HTTP_HOST'];
        if ( preg_match('/^([A-Za-z0-9]+)\.dev\.ez-ad\.io$/', $host, $m) ) {
            $slug = $m[1];
            $stmt = DB::execute('ecommerce',
                'SELECT IFNULL(partner_business, business_id) FROM businesses WHERE business_slug = ?', [$slug]);
            $businessId = $stmt->fetchColumn();
            define('IS_DYNDEV', true);
        }
    }

    if ( $businessId ) {
        $stmt = DB::execute('ecommerce',
            'SELECT b.business_id, b.business_name, b.meta_description, b.meta_title, b.company,
                    IFNULL(s.website_url, b.website_url) website_url, s.google_verify_code,
                    b.business_zipcode, b.business_address, b.business_state, b.business_city, b.business_country,
                    c.google_search_console, c.google_analytics, c.facebook_pixel, c.live_chat,
                    b.facebook_link, b.twitter_link, b.youtube_link, b.instagram_link, b.googleplus_link, b.linkedin_link, b.pinterest_link,
                    b.business_telephone, b.contact_email, b.truevalue_ecommerce_plan, b.other_ecommerce_plan, b.store_number,
                    b.release_channel_id, b.release_version, b.website_theme, b.pickup_pdp_message, b.extra_data,
                    rc.category release_channel_category, s.plan sitemap_plan, s.is_truevalue_ecommerce, fb.text backlink_text,
                    mb.company_billing, rc.project release_project, rc.current_version release_latest_version
             FROM businesses b
             LEFT JOIN sitemaps s ON (s.business_id = b.business_id)
             LEFT JOIN conversion_pixels c ON (c.business_id = b.business_id)
             LEFT JOIN release_channels rc ON (rc.id = b.release_channel_id)
             LEFT JOIN footer_backlinks fb ON (fb.id = s.footer_backlink_id)
             LEFT JOIN master_businesses mb ON (mb.id = b.business_id)
             WHERE b.business_id = ?', [$businessId]);
        $business = $stmt->fetch(PDO::FETCH_ASSOC);

        if ( $businessId >= 5073 && $businessId <= 5077 ) {
            $business['settings'] = buildSettingsJson($businessId);
        } else {
            $business['settings'] = json_decode(file_get_contents("$settingsFolder/$businessId.json"), true);
        }

        // WHAT THE FUCK?
        if ( !$business['settings']['businessSlug'] ) {
            $business['settings']['businessSlug'] = $business['business_slug'];
        }
        $business['settings']['logo'] = convertImageUrl($business['settings']['logo'], 'thumb');
    } else {
        $filename = findSettingsFilename();

        if ( $filename ) {
            $path = SITE_ROOT . '/public/' . $filename;
            if (is_file($path)) {
                $settings = json_decode(file_get_contents($path), true);
                $slug = $settings['businessSlug'];
                $settings['logo'] = convertImageUrl($settings['logo'], 'thumb');

                $stmt = DB::execute('ecommerce',
                    'SELECT b.business_id, b.business_name, b.meta_description, b.meta_title, b.company,
                            IFNULL(s.website_url, b.website_url) website_url, s.google_verify_code,
                            b.business_zipcode, b.business_address, b.business_state, b.business_city, b.business_country,
                            c.google_search_console, c.google_analytics, c.facebook_pixel, c.live_chat,
                            b.facebook_link, b.twitter_link, b.youtube_link, b.instagram_link, b.googleplus_link, b.linkedin_link, b.pinterest_link,
                            b.business_telephone, b.contact_email, b.truevalue_ecommerce_plan, b.other_ecommerce_plan, b.store_number,
                            b.release_channel_id, b.release_version, b.website_theme, b.pickup_pdp_message, b.extra_data,
                            rc.category release_channel_category, s.plan sitemap_plan, s.is_truevalue_ecommerce, fb.text backlink_text, 
                            mb.company_billing, rc.project release_project, rc.current_version release_latest_version
                     FROM businesses b
                     LEFT JOIN sitemaps s ON (s.business_id = b.business_id)
                     LEFT JOIN conversion_pixels c ON (c.business_id = b.business_id)
                     LEFT JOIN release_channels rc ON (rc.id = b.release_channel_id)
                     LEFT JOIN footer_backlinks fb ON (fb.id = s.footer_backlink_id)
                     LEFT JOIN master_businesses mb ON (mb.id = b.business_id)
                     WHERE b.business_slug = ?', [$slug]);
                $business = $stmt->fetch(PDO::FETCH_ASSOC);
                $business['settings'] = $settings;
            }
        }
    }

    if ( $business ) {
        $stmt = DB::execute('ecommerce',
            'SELECT value_string FROM business_setup WHERE business_id = ? AND `key` = ?',
            [$business['business_id'], 'favicon']);

        $business['favicon'] = $stmt->fetchColumn(0) ?: '';
        $stmt = DB::execute('ecommerce',
            'SELECT business_id FROM businesses WHERE partner_business = ?', [$business['business_id']]);
        $business['validStoreIds'] = $stmt->fetchAll(PDO::FETCH_COLUMN);

        $business['website_url'] = str_replace('#/', '', $business['website_url']);
        $business['website_url'] = rtrim($business['website_url'], '/');

        if ( !$business['website_theme'] ) {
            $business['website_theme'] = $business['release_channel_category'];
        }

        if ( $business['extra_data'] ) {
            $business['extra_data'] = json_decode($business['extra_data'], true);
        }

        if ( !in_array($business['business_id'], [4855, 4856]) ) {
            $disabled = DB::redis()->hget('ecom.business.disabled', "$business[business_id]");
            if ( $disabled === '1' ) {
                header('HTTP/1.1 404 Not Found');
                echo "This website is no longer available.";
                exit;
            }
        }
    }


    return $business;
}

function findSettingsFilename()
{
    // parse src/GlobalSettings.js for the json file, read slug, lookup by slug
    $settingsLines = file(SITE_ROOT . '/src/GlobalSettings.js');
    $filename = '';
    foreach ( $settingsLines as $line ) {
        // const g = "settings-smiths.json";
        if ( preg_match('/^const\s+[a-zA-Z0-9_]+\s*=\s*["\']([^"\']+)["\']/', $line, $match) ) {
            $filename = $match[1];
            break;
        }
    }
    return $filename;
}

function slugify($title, $otherChars = '')
{
    $title = strtolower($title);
    $title = str_replace('/', ' ', $title); // allow slash to separate words
    $title = str_replace('&', ' and ', $title); // replace & with and
    $title = preg_replace('#[^a-z0-9_ ' . $otherChars . '-]#', '', $title);
    $title = preg_replace('#\s+#', '-', $title);
    return $title;
}

function isGooglebot()
{
    $ua = $_SERVER['HTTP_USER_AGENT'];
    $force = $_GET['google'] ?? 0;
    return strpos($ua, 'Googlebot/') !== false
        || strpos($ua, 'Googlebot-Image') !== false
        || strpos($ua, 'Googlebot-Video') !== false
        || strpos($ua, 'AdsBot-Google') !== false
        || strpos($ua, 'Mediapartners-Google') !== false
        || strpos($ua, 'Chrome-Lighthouse') !== false
        || $force == 1;
}

function useGA4() {
    return false; // the previous GTM code still works for GA4
    //$force = $_GET['useGA4'] ?? 0;
    //return $force == 1;
}

function forceHttps($url)
{
    if ( strpos($url, 'http://') === 0 ) {
        $url = str_replace('http://', 'https://', $url);
    }
    return $url;
}

function findProduct($businessId, $columns, $where, array $bind)
{
    $stmt = DB::execute(getConnectionName($businessId),
        "SELECT $columns FROM ecommerce_$businessId WHERE $where", $bind);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);
    if ( $columns == '*' && $product ) {
        loadProductSettings($product);
    }
    return $product;
}

function loadProductSettings(array &$product)
{
    if ( !isset($product['dept_id']) || !$product['dept_id'] ) {
        return;
    }

    $allIds = [];
    $allIds[$product['dept_id']] = 1;
    if ( isset($product['class_id']) && $product['class_id'] ) {
        $allIds[$product['class_id']] = 1;
        if ( isset($product['fineline_id']) && $product['fineline_id'] ) {
            $allIds[$product['fineline_id']] = 1;
        }
    }

    $catSettings = [];
    $catNames = [];
    if ( $allIds ) {
        $stmt = DB::execute('ecommerce',
            'SELECT id, title, settings FROM categories_master 
             WHERE id IN (' . implode(',', array_keys($allIds)) . ')');
        foreach ( $stmt->fetchAll(PDO::FETCH_ASSOC) as $row ) {
            $catNames[$row['id']]['title'] = $row['title'];
            $catNames[$row['id']]['target'] = slugifyTitle($row['title']).'-'.$row['id'].'?name='.$row['title'];
            $catSettings[$row['id']] = json_decode($row['settings'] ?: '{}', true);
        }
    }

    // start with dept settings then override with class and fineline data
    $product['settings'] = $catSettings[$product['dept_id']] ?? [];
    $product['categories'] = $catNames ?? [];
    
    if ( isset($product['class_id']) && $product['class_id'] ) {
        $product['settings'] = array_merge($product['settings'],
            $catSettings[$product['class_id']] ?? []);

        if ( isset($product['fineline_id']) && $product['fineline_id'] ) {
            $product['settings'] = array_merge($product['settings'],
                $catSettings[$product['fineline_id']] ?? []);
        }
    }
}

function slugifyTitle($title) {
    $title = strtolower($title);
    $title = preg_replace('/\//', ' ', $title);
    $title = preg_replace('/&/', ' and ', $title);
    $title = preg_replace('/[^a-z0-9_ -]/', '', $title);
    $title = preg_replace('/\s+/', '-', $title);
    return $title;
}

function getConnectionName($businessId)
{
    static $dbCache;
    if ( isset($dbCache[$businessId]) ) {
        return $dbCache[$businessId];
    }

    $stmt = DB::execute('ecommerce', 'SELECT product_database FROM businesses WHERE business_id = ?', [$businessId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $dbNumber = $row['product_database'];

    $conn = 'ecommerce';
    if ( $dbNumber && $dbNumber >= 2 ) {
        $conn = "ecommerce$dbNumber";
    }

    $dbCache[$businessId] = $conn;
    return $conn;
}

function loadSimilarItems($businessId, $sku)
{
    $api = "https://api.ezadtv.com/products/$sku/addons?internal_business_id=$businessId&internal_store_id=$businessId";
    $json = file_get_contents($api);
    if ( !$json ) {
        return [];
    }
    $data = json_decode($json, true);
    if ( !$data ) {
        return [];
    }
    return array_values($data['data']);
}

function loadVideos($businessId, $sku)
{
    $api = "https://api.ezadtv.com/products/$sku/videos?internal_business_id=$businessId&internal_store_id=$businessId";
    $json = file_get_contents($api);
    if ( !$json ) {
        return [];
    }
    $data = json_decode($json, true);
    if ( !$data ) {
        return [];
    }
    return array_values($data['data']);
}

function searchProducts($businessId, $title, $sku)
{
    $query = http_build_query([
        'internal_business_id' => $businessId,
        'internal_store_id' => $businessId,
        'search' => $title,
        'page' => 1,
        'sort' => 'relevancy',
        'sku' => $sku,
        'limit' => 96,
    ]);
    $api = "https://ecomapi.ezadtv.com/products?$query";
    $json = file_get_contents($api);
    return json_decode($json, true);    
}

function searchKeyword($businessId, $search, $page = 1, $dept_id = null)
{   
    $params = [
        'internal_business_id' => $businessId,
        'internal_store_id' => $businessId,
        'search' => $search,
        'page' => $page,
        'sort' => 'relevancy',
        'limit' => 96,
    ];
    if($dept_id){
        $params["dept_id"] = $dept_id;
    }
    $query = http_build_query($params);
    $api = "https://ecomapi.ezadtv.com/products?$query";
    $json = file_get_contents($api);
    return json_decode($json, true);    
}

function brandProducts($businessId, $brandId)
{
    $query = http_build_query([
        'internal_business_id' => $businessId,
        'internal_store_id' => $businessId,
        'search' => '""',
        'brands' => [$brandId],
        'page' => 1,
        'sort' => 'price-desc',
        'limit' => 96,
        'in_stock_only' => 1,
    ]);
    $api = "https://ecomapi.ezadtv.com/products?$query";
    $json = file_get_contents($api);
    $data = json_decode($json, true);
    return $data['data']['data'] ?? [];
}

function deptProducts($businessId, $deptId)
{
    $query = http_build_query([
        'internal_business_id' => $businessId,
        'internal_store_id' => $businessId,
        'search' => '""',
        'dept_id' => $deptId,
        'page' => 1,
        'sort' => 'relevancy',
        'limit' => 96,
    ]);
    $api = "https://ecomapi.ezadtv.com/products?$query";
    $json = file_get_contents($api);
    return json_decode($json, true);    
}

function getDepartments($businessId)
{
    // dept_id, dept_name, image_url
    $query = http_build_query(['internal_business_id' => $businessId, 'internal_store_id' => $businessId]);
    $json = file_get_contents('https://ecomapi.ezadtv.com/departments-images?' . $query);
    $data = json_decode($json, true);
    return $data['data']['dept'] ?? [];
}

function getAboutUs($businessId)
{
    // description, froala_data, froala, locations
    // if froala, json decode froala_data *twice*, then loop through blocks and concatenate.
    // also replace contenteditable="true" with blank for that data.
    $query = http_build_query(['internal_business_id' => $businessId, 'internal_store_id' => $businessId]);
    $json = file_get_contents('https://api.ezadtv.com/about-us?' . $query);
    $data = json_decode($json, true);
    return $data['data'] ?? [];
}

function limitLengthByWords($text, $maxChars)
{
    if ( strlen($text) <= $maxChars ) {
        return $text;
    }

    $words = preg_split('/\s+/', $text);
    $newText = $words[0];
    foreach ( array_slice($words, 1) as $word ) {
        if ( strlen($newText . ' ' . $word) > $maxChars ) {
            break;
        }
        $newText .= " $word";
    }

    return $newText;
}

function limitLengthBySentence($text, $maxChars = 250)
{
    // split text by sentence.
    // first break apart by spaces and look for words that end in . but contain no other . in the word.
    // also allow words like Mr. Dr. Ms. Mrs. through.
    $whitelist = ['Mr.', 'Dr.', 'Ms.', 'Mrs.'];

    $words = preg_split('/\s+/', $text);
    $sentences = [];
    $curSentence = '';
    $totalLength = 0;
    foreach ( $words as $word ) {
        $curSentence .= $word . ' ';
        if ( substr($word, -1) == '.' && substr_count($word, '.') == 1 && !in_array($word, $whitelist) ) {
            // end of sentence
            $sentences[] = trim($curSentence);
            $totalLength += strlen($curSentence);
            if ( $totalLength > $maxChars && count($sentences) > 1 ) {
                // remove latest sentence if the text is too long, but always leave at least one sentence.
                array_pop($sentences);
                break;
            }
            $curSentence = '';
        }
    }

    return implode(' ', $sentences);
}

function loadCustomMeta($businessId, $path)
{
    $stmt = DB::ecommerce()->prepare(
        'SELECT title, meta_title, meta_description FROM custom_meta WHERE business_id = ? AND page_url = ?');
    $stmt->execute([$businessId, $path]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function loadCustomNav($businessId)
{
    $stmt = DB::ecommerce()->prepare('SELECT id, title, hide FROM custom_pages_nav WHERE business_id = ?');
    $stmt->execute([$businessId]);
    $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt = DB::ecommerce()->prepare('SELECT id, name, target, dropdown, hide, align, `order`, show_in_header, megamenu, hide_on_locations
                                      FROM custom_navigations WHERE business_id = ? AND (hide IS NULL OR hide != 1)');
    $stmt->execute([$businessId]);
    $navs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ( $navs as &$nav ) {
        if ( $nav['dropdown'] ) {
            $nav['dropdown'] = json_decode($nav['dropdown']);
        }
        if ( $nav['megamenu'] ) {
            $nav['megamenu'] = json_decode($nav['megamenu']);
        }
        if ( $nav['target'] == 'departments' ) {
            $nav['target'] = '/departments';
        }
    }
    return [$groups, $navs];
}

function buildSettingsJson($businessId){

    $stmt = DB::ecommerce()->prepare("SELECT * FROM business_setup WHERE business_id = ?");
    $stmt->execute([$businessId]);
    $fields = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $data = [];
    foreach($fields as &$f){
        $key = $f['key'];
        if($f["value_int"]){
            $f["value"] = $f["value_int"];
        }else if($f["value_string"]){
            $f["value"] = $f["value_string"];
        }else{
            $f["value"] = $f["value_text"];
        }
        $data[$key] = $f["value"];
    }

    $currentJson = [];

    //okay so we will forloop thorugh each one of the fileds
    $fieldsStmt = DB::ecommerce()->query("SELECT id, m.key FROM business_options_master m WHERE parent_id IS NULL");
    $fieldsArray = $fieldsStmt->fetchAll(PDO::FETCH_ASSOC);
    $fields = [];
    foreach ( $fieldsArray as $item ) {
        $fields[$item['id']] = $item['key'];
    }

    $subFieldsStmt = DB::ecommerce()->query("SELECT parent_id, m.key FROM business_options_master m WHERE parent_id IS NOT NULL");
    $subFields = $subFieldsStmt->fetchAll(PDO::FETCH_ASSOC);

    $final = [];
    $subs = [];
    foreach($subFields as $s){
        $key = $fields[$s["parent_id"]] . "-" . $s["key"];
        //ignore
        $ignore = ["departments-text", "brands-text","rentals-text", "adminNavigation"];

        if(in_array($s["key"], $ignore)){
            continue;
        }

        if($data[$key] != "" && isset($data[$key])){
            if($s["key"] == "departments"){
                if($data[$key] == "true"){
                    $subs[$s["parent_id"]][] = ["name" => $data["navigation-departments-text"] != "" ? $data["navigation-departments-text"] : "departments"];
                }
            }else if($s["key"] == "home"){
                if($data[$key] == "true"){
                    $subs[$s["parent_id"]][] = ["name" => "home"];
                }
            }else if($s["key"] == "brands"){
                if($data[$key] == "true"){
                    $subs[$s["parent_id"]][] = ["name" => $data["navigation-brands-text"] != "" ? $data["navigation-brands-text"] : "brands"];
                }
            }else if($s["key"] == "rentals"){
                if($data[$key] == "true"){
                    $subs[$s["parent_id"]][] = ["name" => $data["navigation-rentals-text"] != "" ? $data["navigation-rentals-text"] : "rentals", "target" => "rentals"];
                }
            }else if(is_bool($data[$key]) || $data[$key] === "false" || $data[$key] === "true"){
                if($data[$key] === "false" || $data[$key] === false || $data[$key] === 0){
                    $subs[$s["parent_id"]][$s["key"]] = false;
                }
                if ($data[$key] === "true" || $data[$key] === true ||$data[$key] === 1) {
                    $subs[$s["parent_id"]][$s["key"]] = true;
                }
            }else if($s['key'] == 'allowSpecialOrderVendors') {
                if ( strpos($data[$key], ',') ) {
                    $values = explode(',', $data[$key]);
                } else {
                    $values = explode(' ', $data[$key]);
                }
                $arr = array();
                foreach ($values as $v) {
                    array_push($arr, intval($v));
                }
                $subs[$s['parent_id']][$s['key']] = $data[$key] ? $arr : [];  //make sure this is an array
            }
            else{
                if($data[$key] == "false"){
                    $subs[$s["parent_id"]][$s["key"]] = false;
                } else
                    if($data[$key] == "true"){
                        $subs[$s["parent_id"]][$s["key"]] = true;
                    } else {
                        $subs[$s["parent_id"]][$s["key"]] = $data[$key] ? $data[$key] : "";
                    }
            }
        }else{
            $subs[$s["parent_id"]][$s["key"]] = "";
        }
    }

    foreach($fields as $id => $f){
        if($subs[$id]) {
            $final[$f] = $subs[$id];
        } else if ($data[$f] === "false") {
            $final[$f] = false;
        } else if ($data[$f] === "true") {
            $final[$f] = true;
        }
        else{
            $final[$f] = $data[$f] ? $data[$f] : "";
        }
    }

    if (isset($data['navigation-adminNavigation'])) {
        if ($data['navigation-adminNavigation'] === 'false') {
            $final['adminNavigation'] = false;
        } else {
            $final['adminNavigation'] = true;
        }
    }


    $final['navigation'] = [];
    $final['navigation'][0] = ['name' => 'home'];
    $final['navigation'][1] = ['name' => 'departments'];
    $final['navigation'][2] = ['name' => 'brands'];
    $final['navigation'][3] = ['name' => 'About Us', 'align' => 'right'];

    //makes sure custom keys arent over written
    $final = array_replace_recursive($currentJson, $final);

    //return [$final, $data, $subs];
    return $final;
}

function getFrontendBranches()
{
    $res = file_get_contents('https://kachooni.com/api:git/get-branches?project=135');
    $json = json_decode($res, true);
    return $json['branches'];
}

function getCurrentBranch()
{
    $gitHead = trim(file_get_contents(dirname(__DIR__) . "/.git/HEAD"));
    // ref: refs/heads/production
    if ( preg_match('#^ref: refs/heads/([A-Za-z0-9_/-]+)$#', $gitHead, $m) ) {
        return $m[1];
    }
    return '';
}

function switchBranch($branch)
{
    // www-ecdevfe-whatever
    $directory = basename(dirname(__DIR__));
    sendPostRequest('https://kachooni.com/api:git/trigger-pull', ['directory' => $directory, 'branch' => $branch]);
}

function sendPostRequest($url, array $jsonData)
{
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($jsonData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-type: application/json']);
    return curl_exec($ch);
}

function compressUrl($url) {
    if ( preg_match('#^https://(?:www\.)?truevalue\.com/media/catalog/product/(\d+)\.jpg$#', $url, $m) ) {
        return "tv:$m[1]";
    }
    if ( preg_match('#^https://storage\.googleapis\.com/products\.ezadtv\.com/(\d+)/(\d+)\.[a-zA-Z]+$#', $url, $m) ) {
        return "spb:$m[1]-$m[2]";
    }
    if ( preg_match('#^https://storage\.googleapis\.com/products\.ezadtv\.com/ecom-image-v2/([a-f0-9]+)\.[a-zA-Z]$#', $url, $m) ) {
        $base64 = base64_encode(hex2bin($m[1]));
        return "sp2:$base64"; // 20 bytes
    }

    if ( strlen($url) <= 27 ) {
        return $url;
    } else {
        return rtrim(base64_encode(hash('sha1', $url, true)), '=');
    }
}

function convertImageUrl($url, $size)
{
    if ( !$url ) {
        return $url;
    }

    $validSourcePatterns = [
        '/^https:\/\/storage\.googleapis\.com\/products\.ezadtv\.com\//',
        '/^https:\/\/storage\.googleapis\.com\/content\.ezadtv\.com\//',
        '/^https:\/\/(www\.)?truevalue\.com\/media\/catalog\/product\//',
    ];

    $validExtensions = ['png', 'jpeg', 'jpg', 'webp', 'gif'];
    $ext = strtolower(substr($url, strrpos($url, '.') + 1));
    if ( !in_array($ext, $validExtensions) ) {
        return $url;
    }

    foreach ( $validSourcePatterns as $pattern ) {
        if ( preg_match($pattern, $url) ) {
            // https://images.ezad.io/size/base64_url_of_image.webp
            $encoded = base64_encode($url);
            $encoded = strtr($encoded, '+/', '-_');
            $encoded = rtrim($encoded, '=');
            return "https://images.ezad.io/$size/$encoded.webp";
        }
    }

    return $url;
}
