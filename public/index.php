<?php

require_once __DIR__ . '/../backend-src/init.php';

$business = findBusiness();
$customizeFilePath = __DIR__ . '/index.html';
$customizeReplacements = [];

$preRenderHomepage = [];

if ( $business ) {
    Html::metaName('msapplication-TileColor', '#da532c');
    Html::metaName('theme-color', '#ffffff');

    $businessName = $business['settings']['businessName'] ?? $business['business_name'];
    $business['website_url'] = rtrim($business['website_url'], '/');

    // added to all ldjson by default
    $storeSchema = [
        '@context' => 'https://schema.org',
        '@type' => 'HardwareStore',
        'name' => trim($businessName),
        'telephone' => $business['business_telephone'],
        'image' => $business['company_logo'],
        'address' => [
            '@type' => 'PostalAddress',
            'streetAddress' => trim($business['business_address']),
            'addressLocality' => trim($business['business_city']),
            'addressRegion' => $business['business_state'],
            'postalCode' => $business['business_zipcode'],
            'addressCountry' => $business['business_country'],
        ],
    ];
    $websiteSchema = [
        '@context' => 'https://schema.org',
        '@type' => 'WebSite',
        'name' => trim($businessName),
        'url' => $business['website_url'],
        'potentialAction' => [
            [
                '@type' => 'SearchAction',
                'target' => $business['website_url'] . '/search/?keyword={search_term_string}',
                'query-input' => 'required name=search_term_string',
            ],
        ],
    ];

    $orgSchema = [
        '@context' => 'https://schema.org',
        '@type' => 'Organization',
        'legalName' => trim($businessName),
        'url' => $business['website_url'],
        'logo' => $business['settings']['logo'],
    ];

    $socialProps = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'googleplus', 'pinterest'];
    $sameAs = [];
    foreach ( $socialProps as $socialProp ) {
        if ( $business[$socialProp . '_link'] ) {
            $sameAs[] = $business[$socialProp . '_link'];
        }
    }
    if ( $sameAs ) {
        $orgSchema['sameAs'] = $sameAs;
    }

    if ( $business['business_telephone'] || $business['contact_email'] ) {
        $cp = [
            '@type' => 'ContactPoint',
            'contactType' => 'customer service',
        ];
        if ( $business['business_telephone'] ) {
            $cp['telephone'] = $business['business_telephone'];
        }
        if ( $business['contact_email'] ) {
            $cp['email'] = $business['contact_email'];
        }
        $orgSchema['contactPoint'] = [$cp];
    }

    Html::ldJson($storeSchema);

    if ( $business['favicon'] ) {
        Html::link(['rel' => 'icon', 'type' => 'image/x-icon', 'href' => $business['favicon']]);
        Html::link(['rel' => 'apple-touch-icon', 'sizes' => '180x180', 'href' => $business['favicon']]);
        Html::link(['rel' => 'icon', 'type' => 'image/png', 'sizes' => '32x32', 'href' => $business['favicon']]);
    } else {
        Html::link(['rel' => 'icon', 'type' => 'image/png', 'sizes' => '32x32', 'href' => '/favicon-32x32.png']);
        Html::link(['rel' => 'icon', 'type' => 'image/png', 'sizes' => '16x16', 'href' => '/favicon-16x16.png']);
    }

    Html::link(['rel' => 'manifest', 'href' => '/site.webmanifest']);

    Html::title($businessName);

    // google site verification
    if ( $business['google_verify_code'] ) {
        Html::verificationToken($business['google_verify_code']);
    }

    if ( ($businessName && strpos($business['meta_description'], $businessName) !== false)
        || strpos($business['meta_description'], ' has some') !== 0 ) {
        // use raw meta desc if it contains the business name, or it doesn't start with " has some"
        Html::metaDescriptions($business['meta_description']);
    } else {
        Html::metaDescriptions($businessName . ' ' . $business['meta_description']);
    }

    Html::metaImages($business['settings']['logo']);

    if ( isset($business['meta_title']) && $business['meta_title'] ) {
        Html::metaTitles($business['meta_title']);
    } else {
        Html::metaTitles('Shop ' . $businessName);
    }

    Html::metaName('og:site_name', $businessName);
    Html::metaName('twitter:site', $businessName);

    Html::metaName('og:type', 'website');
    Html::metaName('twitter:card', 'summary');

    Html::addHtml("<!-- Project: {$business['release_project']} - Channel Id: {$business['release_channel_id']} - Version: {$business['release_version']} - Release Latest Version: {$business['release_latest_version']} -->");
        
    Html::addHtml($business['google_search_console']);
    Html::addHtml($business['google_analytics']);
    Html::addHtml($business['facebook_pixel']);
    Html::addHtml($business['live_chat']);

    if ( strpos($business['company'], 'truevalue') !== false ) {
        // clean up store number, remove check digit and leading 0
        if (strpos($business['store_number'], '-') !== false) {
            $business['store_number'] = explode('-', $business['store_number'])[0];
        }
        if (strlen($business['store_number']) == 6) {
            $business['store_number'] = substr($business['store_number'], 0, 5);
        }
        $business['store_number'] = ltrim($business['store_number'], '0');
    }

    // always create dataLayer variable so FE code doesn't have to check all the time
    Html::addHtml("<script> window.dataLayer = window.dataLayer || []; window.dataLayer.push({'storeNumber': '{$business['store_number']}'}); </script>");

    // Every meta tag can be overridden here. The same metaXXX function called with the same first parameter,
    // will override the previous one.

    if ( Path::matches('#^/departments/?$#', $m) ) {
        if ( isGooglebot() ) {
            $template = SITE_ROOT . '/backend-src/templates/dyn_departments.php';
            if ( is_file($template) ) {
                $customizeFilePath = $template;
                $customizeReplacements = [
                    'departments' => getDepartments($business['business_id']),
                    'settings' => $business['settings'],
                    'business' => $business,
                ];
            }
        }
    }

    // convert slug into id
    if ( Path::matches('#^/department/([a-z0-9-]+)$#', $m) || Path::matches('#^/d/([a-z0-9-]+)$#', $m) ) {
        $slug = $m[1];
        $slugParts = explode('-', $slug);
        if ( count($slugParts) > 1 ) {
            Path::set('/department/' . end($slugParts));
        }
    }

    if (Path::matches('#^/department/(\d+)#', $m) || Path::matches('#^/d/(\d+)#', $m)) {
        $deptId = $m[1];
        $stmt = DB::ecommerce()->prepare(
            'SELECT m.name base_title, a.name alias
             FROM matched_search_departments m
             LEFT JOIN aliases_mapped am ON (am.dept_id = m.dept_id)
             LEFT JOIN aliases a ON (a.id = am.alias_id)
             WHERE m.business_id = ? AND m.dept_id = ?');
        $stmt->execute([$business['business_id'], $deptId]);
        $dept = $stmt->fetch(PDO::FETCH_ASSOC);
        if ( $dept ) {
            $deptImage = '';
            $deptTitle = $dept['alias'] ?: ucwords(strtolower($dept['base_title'])); // use alias directly
            $deptMetaDesc = "Shop for $deptTitle products at $businessName";
            // other info
            $stmt2 = DB::execute('ecommerce', 'SELECT settings FROM categories_master WHERE id = ?', [$deptId]);
            $dept2 = $stmt2->fetch(PDO::FETCH_ASSOC);
            if ( $dept2['settings'] ) {
                $deptSettings = json_decode($dept2['settings'], true);
                if ( isset($deptSettings['departmentImage']) ) {
                    $p = findProduct($business['business_id'], 'image_url', 'sku = ?', [$deptSettings['departmentImage']]);
                    $deptImage = $p['image_url'];
                }

                if ( isset($deptSettings['meta_description']) && $deptSettings['meta_description'] != "" ) {
                    $deptMetaDesc = $deptSettings['meta_description'];
                }
            }

            Html::title($deptTitle . ' | ' . $businessName);
            Html::metaTitles($deptTitle);
            Html::metaDescriptions($deptMetaDesc);
            Html::metaImages($deptImage);
            Html::ldJson($storeSchema, Html::makeBreadcrumbList([
                ['name' => 'Departments', 'path' => ''],
                [
                    'name' => $deptTitle,
                    'path' => '/department/' . slugify($deptTitle) . '-' . $deptId,
                ],
            ]));
            Html::link([
                'rel' => 'canonical',
                'href' => forceHttps($business['website_url']) . '/department/' . slugify($deptTitle) . '-' . $deptId,
            ]);

            Html::addVariable('__EZ_DEPT_NAME', $deptTitle);

            if ( isGooglebot() ) {
                $template = SITE_ROOT . '/backend-src/templates/dyn_product_search.php';
                if ( is_file($template) ) {
                    $customizeFilePath = $template;
                    $products = deptProducts($business['business_id'], $deptId);
                    if ( !$products || !$products['data'] || !$products['data']['total'] ) {
                        Html::metaName('robots', 'noindex');
                    }
                    $customizeReplacements = ['products' => $products, 'settings' => $business['settings'],
                        'business' => $business];
                }
            }
        }
    }    
    // /search/keyword-here
    if ( isGooglebot() && Path::matches('#^/search/([a-z0-9-]+)$#', $m) ) {
        $template = SITE_ROOT . '/backend-src/templates/dyn_product_search.php';
        if ( is_file($template) ) {
            $customizeFilePath = $template;
            $keyword = str_replace('-', ' ', $m[1]);            
            $page = isset($_GET['page']) ? $_GET['page'] : 1;
            $dept_id = isset($_GET['dept_id']) ? $_GET['dept_id'] : null;
            $products = searchKeyword($business['business_id'], $keyword, $page, $dept_id);
            $customizeReplacements = ['products' => $products, 'settings' => $business['settings'],
                'business' => $business];
        }
    }

    // /products/sku or /search/sku/title
    if (Path::matches('#^/products/([^/]+)#', $m) || Path::matches('#^/p/([^/]+)#', $m)
        || Path::matches('#^/search/([^/]+)/([^/]+)#', $m)) {
        // https://developers.google.com/search/docs/data-types/product
        $isSearch = strpos(Path::get(), '/search') === 0;

        $sku = $m[1];
        if ( $isSearch ) {
            $product = findProduct($business['business_id'], '*', 'sku = ?', [$sku]);
        } else {
            $bucket = substr(base64_encode(hash('sha1', $sku, true)), 0, 8);
            $product = findProduct($business['business_id'], '*', 'sku = ? OR (slug_bucket = ? AND slug = ?)',
                [$sku, $bucket, $sku]);

            if ( !$product && preg_match('/-(\d{10,12})$/', $sku, $upcMatch) ) {
                $product = findProduct($business['business_id'], '*', 'upc = ?', [$upcMatch[1]]);
            }
        }

        // product row doesn't even exist, have to 404 in this case
        if ( !$product ) {
            if ( $isSearch && isGooglebot() ) {
                header('HTTP/1.1 404 Not Found');
                exit;
            }
            if ( !$isSearch ) {
                header('HTTP/1.1 301 Moved Permanently');
                $searchSlug = $sku;
                $searchKw = urlencode(str_replace('-', ' ', $sku));
                header('Location: ' . forceHttps("$business[website_url]/search/$searchSlug?keyword=$searchKw"));
                exit;
            }
        }

        // for now only do this on vassar and non-TV
        $displayDiscontinued = true; //$business['business_id'] == 21 || $business['website_theme'] != 'truevalue';

        // if hidden reason is discontinued don't actually hide it.
        // UNLESS it's from a catalog.
        if ( $displayDiscontinued && $product && $product['hidden'] && $product['hidden_reason'] == 'discontinued'
            && strpos($product['location'], '_ez') !== 0 ) {
            $product['hidden'] = 0;
        }

        // for hidden products to google bot just give a 404
        // for new logic, always redirect to search no matter if it's google or not, if the item is not found
        // and the hidden reason is not discontinued.
        // for old logic, show 404 and exit if it's google bot. otherwise keep going for non-bots.
        if ( $product && $product['hidden'] ) {
            if ( $displayDiscontinued ) {
                //header('HTTP/1.1 410 Gone');
                // redirect to search instead
                header('HTTP/1.1 301 Moved Permanently');
                $searchSlug = slugify($product['title']);
                $searchKw = urlencode($product['title']);
                header('Location: ' . forceHttps("$business[website_url]/search/$searchSlug?keyword=$searchKw"));
                exit;
            } else if ( isGooglebot() ) {
                header('HTTP/1.1 404 Not Found');
                exit;
            }
        }

        if ( $product && !$product['hidden'] ) {
            $extra = [];
            if ( $product['extra'] ) {
                $extra = json_decode($product['extra'], true) ?: [];
            }

            if (($product['brand_name'] && stripos($product['title'], $product['brand_name']) === 0) ||
                (isset($business['settings']['products']['hideBrandFromTitle']) && $business['settings']['products']['hideBrandFromTitle'])) {
                $brandPrefix = '';
            } else {
                $brandPrefix = $product['brand_name'] ? "$product[brand_name] " : '';
            }

            $canonUrl = $business['website_url'] . '/p/' . $product['slug'];
            if ( $isSearch && isGooglebot() ) {
                $canonUrl = $business['website_url'] . '/search/' . $sku . '/' . $m[2];
                Html::title($brandPrefix . $product['title'] . ' Near Me | ' . $businessName);
            } else {
                Html::title($brandPrefix . $product['title'] . ' | ' . $businessName);
            }

            if ( $isSearch ) {
                // have this all the time no matter if google or not so the title doesn't change after load
                Html::addVariable('__EZ_PRODUCT_TITLE', $product['title']);
            }

            Html::link([
                'rel' => 'canonical',
                'href' => forceHttps($canonUrl),
            ]);
            Html::metaImages($product['image_url']);
            Html::metaTitles($brandPrefix . $product['title']);
            Html::metaUrls($canonUrl);

            if ( isset($extra['meta_description']) && $extra['meta_description'] ) {
                Html::metaDescriptions($extra['meta_description']);
            //} else if ( $product['description'] ) {
            //    Html::metaDescriptions(limitLengthBySentence($product['description'], 250));
            } else {
                // only use title and brand for now since description is iffy
                $fakeDesc = $brandPrefix . $product['title'];
                //if ( $product['brand_name'] ) {
                //    $fakeDesc .= ", made by $product[brand_name]";
                //}
                //$fakeDesc .= ', available near you.';
                Html::metaDescriptions($fakeDesc);
            }

            if ( isset($extra['meta_title']) && $extra['meta_title'] ) {
                Html::metaTitles($extra['meta_title']);
            }
            // get actual department name after applying aliases
            $stmt = DB::ecommerce()->prepare(
                'SELECT m.name base_title, a.name alias
                 FROM matched_search_departments m
                 LEFT JOIN aliases_mapped am ON (am.dept_id = m.dept_id)
                 LEFT JOIN aliases a ON (a.id = am.alias_id)
                 WHERE m.business_id = ? AND m.dept_id = ?');
            $stmt->execute([$business['business_id'], $product['dept_id']]);
            $dept = $stmt->fetch(PDO::FETCH_ASSOC);
            $deptTitle = $dept['alias'] ?: ucwords(strtolower($dept['base_title'])); // use alias directly

            $discontinued = $product['hidden_reason'] == 'discontinued';

            if ( isset($product['settings']['hidePrice']) && $product['settings']['hidePrice'] ) {
                $extra['hide_price'] = true;
            }

            $productSchema = [
                '@context' => 'https://schema.org',
                '@type' => 'Product',
                'productID' => $product['sku'],
                'url' => $canonUrl,
                'name' => limitLengthByWords($product['title'], 150),
                'sku' => $product['sku'],
                'description' => $product['description'],
                'mpn' => (string)$product['model_number'],
                'image' => !$product['image_url'] ? null : [
                    $product['image_url'],
                ],
                'brand' => !$product['brand_name'] ? null : [
                    '@type' => 'Brand',
                    'name' => (string)$product['brand_name'],
                ],
                'offers' => [
                    '@type' => 'Offer',
                    'url' => $canonUrl,
                    'priceCurrency' => 'USD',
                    'price' => (isset($business['settings']['products']['hideReg']) && $business['settings']['products']['hideReg']) ||
                        (isset($extra['hide_price']) && $extra['hide_price']) ? "" : $product['price'],
                    // facebook
                    //'availability' => $product['num_inventory'] > 0 ? 'in stock' : 'out of stock',
                    // google (hopefully works with facebook too or else we'll have to change based on IP)
                    'availability' => (!$discontinued && $product['num_inventory'] > 0) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                    'itemCondition' => 'https://schema.org/NewCondition',
                ],
            ];
            if ( $product['upc'] && ctype_digit($product['upc'])
                && strlen($product['upc']) >= 11 && strlen($product['upc'] <= 12) ) {
                $productSchema['gtin'] = $product['upc'];
            }

            // for later when we have reviews/ratings
            /*
            $productSchema['aggregateRating'] = [
                '@type' => 'AggregateRating',
                'ratingValue' => '3.5',
                'reviewCount' => '11',
            ];
            */

            // if there is no price, remove the product schema.
            if ( !$productSchema['offers']['price'] ) {
                $productSchema = null;
            }

            // when we have q&a https://schema.org/docs/search_results.html?q=faq

            Html::ldJson(
                $storeSchema,
                // product data
                $isSearch ? null : $productSchema,
                // breadcrumb for department
                $product['dept_id'] ? Html::makeBreadcrumbList([
                    ['name' => 'Departments', 'path' => ''],
                    [
                        'name' => $deptTitle,
                        'path' => '/department/' . $product['dept_id'] . '/' . slugify($deptTitle),
                    ],
                    ['name' => $product['title'], 'path' => Path::get()],
                ]) : null,
                // breadcrumb for brand
                $product['brand_name'] ? Html::makeBreadcrumbList([
                    ['name' => 'Brands', 'path' => '/brands'],
                    [
                        'name' => $product['brand_name'],
                        'path' => '/b/' . $product['brand_id'] . '/' . slugify($product['brand_name']),
                    ],
                    ['name' => $product['title'], 'path' => Path::get()],
                ]) : null
            );

            if ( isGooglebot() ) {
                if ( $isSearch ) {
                    $template = SITE_ROOT . '/backend-src/templates/dyn_product_search.php';
                    if ( is_file($template) ) {
                        $customizeFilePath = $template;
                        $ptitle = str_replace('-', ' ', $m[2]);
                        $products = searchProducts($business['business_id'], $ptitle, $product['sku']);
                        $customizeReplacements = ['products' => $products, 'settings' => $business['settings'],
                            'business' => $business];
                    }
                } else {
                    $template = SITE_ROOT . '/backend-src/templates/dyn_product.php';
                    if ( is_file($template) ) {
                        if ( isset($extra['hide_price']) && $extra['hide_price'] ) {
                            if ( !isset($business['settings']['products']) ) {
                                $business['settings']['products'] = [];
                            }
                            $business['settings']['products']['hidePrice'] = true;
                        }
                        $customizeFilePath = $template;
                        $videos = []; //loadVideos($business['business_id'], $product['sku']);
                        $similar = loadSimilarItems($business['business_id'], $product['sku']);
                        $customizeReplacements = [
                            'product' => $product,
                            'videos' => $videos,
                            'similar' => $similar,
                            'settings' => $business['settings'],
                            'business' => $business,
                            'discontinued' => $discontinued,
                        ];
                    }
                }
            }
        }
    }

    if (Path::matches('#^/search/([^/]+)$#', $m)) {
        // Search page
        Html::title(str_replace('-', ' ', $m[1]) . ' Near Me | ' . $businessName);

        // canonical version has no query string
        Html::link([
            'rel' => 'canonical',
            'href' => forceHttps($business['website_url']) . '/search/' . $m[1],
        ]);
    }

    // convert slug into id
    if ( Path::matches('#^/brands/([a-z0-9-]+)$#', $m) || Path::matches('#^/b/([a-z0-9-]+)$#', $m) ) {
        $slug = $m[1];
        $slugParts = explode('-', $slug);
        if ( count($slugParts) > 1 ) {
            Path::set('/b/' . end($slugParts));
        }
    }

    if (Path::matches('#^/brands/(\d+)#', $m) || Path::matches('#^/b/(\d+)#', $m)) {
        $brandId = $m[1];
        $stmt = DB::ecommerce()->prepare('SELECT * FROM brands_summary WHERE business_id = ? AND brand_id = ?');
        $stmt->execute([$business['business_id'], $brandId]);
        $brand = $stmt->fetch(PDO::FETCH_ASSOC);
        if ( $brand ) {
            $brandTitle = $brand['brand_name'];
            $summary = $brand['meta_description'] ?: ''; // Added this new column, if the value is set it would have priority

            if ( empty($summary) ) {
                // try to pull vendors.summary as long as it doesn't contain "youtube" or "channel" in the text.
                $stmt = DB::execute('ecommerce',
                    'SELECT v.summary FROM brands b JOIN vendors v ON (v.vendor_id = b.vendor_id) WHERE b.id = ?',
                    [$brandId]);

                $summary = $stmt->fetchColumn() ?: '';
                if ( !$summary || stripos($summary, 'youtube') !== false || stripos($summary, 'channel') !== false ) {
                    $summary = "Find $brandTitle products for sale near you.";
                } else {
                    $summary = limitLengthBySentence($summary, 250);
                }
            }

            Html::title($brandTitle . ' Items for Sale | ' . $businessName);
            Html::metaTitles($brandTitle . ' Items for Sale');
            Html::metaDescriptions($summary);
            Html::ldJson($storeSchema, Html::makeBreadcrumbList([
                ['name' => 'Brands', 'path' => ''],
                [
                    'name' => $brandTitle,
                    'path' => '/b/' . slugify($brandTitle) . '-' . $brandId,
                ]
            ]));
            Html::link([
                'rel' => 'canonical',
                'href' => forceHttps($business['website_url']) . '/b/' . slugify($brandTitle) . '-' . $brandId,
            ]);

            if ( isGooglebot() ) {
                $template = SITE_ROOT . '/backend-src/templates/dyn_brand_single.php';
                if ( is_file($template) ) {
                    $customizeFilePath = $template;
                    $customizeReplacements = [
                        'brand' => $brand,
                        'products' => brandProducts($business['business_id'], $brandId),
                        'settings' => $business['settings'],
                        'business' => $business,
                    ];
                }
            }
        }
    }

    // For googlebot, show pre-rendered homepage and brands index pages if they exist.

    if ( Path::get() === '/' || Path::get() === '/home' ) {
        if($business['business_id'] == 4159){
            Html::metaImages('https://storage.googleapis.com/content.ezadtv.com/2020/11/17/5fb43ba890c4a_GBSogimage.jpg');
        }

        if ((isGooglebot() || in_array($business['business_id'], $preRenderHomepage))
            && is_file(SITE_ROOT . '/public/generated/index.html')) {
            echo '<!doctype html>' . file_get_contents(SITE_ROOT . '/public/generated/index.html');
            exit;
        }

        Html::link([
            'rel' => 'canonical',
            'href' => forceHttps($business['website_url']) . '/',
        ]);
        Html::ldJson($storeSchema, $websiteSchema, $orgSchema);
    }

    // Allow overriding title, meta title, meta description, based on custom_meta table data.
    $customMeta = loadCustomMeta($business['business_id'], Path::get());
    if ( $customMeta ) {
        if ( $customMeta['title'] ) {
            Html::title($customMeta['title']);
        }
        if ( $customMeta['meta_title'] ) {
            Html::metaTitles($customMeta['meta_title']);
        }
        if ( $customMeta['meta_description'] ) {
            Html::metaDescriptions($customMeta['meta_description']);
        }
    }

    if ( Path::get() == '/store-info' ) {
        Html::link([
            'rel' => 'canonical',
            'href' => forceHttps($business['website_url']) . '/store-info',
        ]);

        if ( isGooglebot() ) {
            $template = SITE_ROOT . '/backend-src/templates/dyn_store_info.php';
            if ( is_file($template) ) {
                $customizeFilePath = $template;
                $customizeReplacements = [
                    'settings' => $business['settings'],
                    'business' => $business,
                    'about' => getAboutUs($business['business_id']),
                ];
            }
        }
    }

    function handleBrands($business, $page)
    {
        // data is not updated anymore
        /*if (isGooglebot()) {
            if (is_file(SITE_ROOT . '/public/generated/brands' . $page . '.html')) {
                echo '<!doctype html>' . file_get_contents(SITE_ROOT . '/public/generated/brands' . $page . '.html');
                exit;
            }
        }*/
        Html::link([
            'rel' => 'canonical',
            'href' => forceHttps($business['website_url']) . '/brands' . ($page > 1 ? "/page/$page" : ''),
        ]);
    }

    if ( Path::get() === '/brands' ) {
        $page = (int)($_GET['page'] ?? 1);
        handleBrands($business, $page);
    }

    // alternate brands url that doesn't use query params
    if ( Path::matches('#^/brands/page/(\d+)#', $m) ) {
        $page = (int) $m[1];
        handleBrands($business, $page);
    }

    if (Path::matches('#^/search#', $m) && isset($_GET['keyword'])) {
        $searchKeyword = $_GET['keyword'];
    }

    // embed settings json into html
    Html::addVariable('__EZ_STORE_SETTINGS', $business['settings']);
    Html::addVariable('__EZ_VALID_STORES', $business['validStoreIds']);
    Html::addVariable('__EZ_PREGEN', isset($_GET['_pregen']) && $_GET['_pregen'] == '1');

    $stmt = DB::ecommerce()->prepare('SELECT api_key FROM google_maps_keys WHERE domain = ?');
    $stmt->execute([strtolower($_SERVER['HTTP_HOST'])]);
    $gmapsKey = $stmt->fetch(PDO::FETCH_ASSOC);
    if ( stripos($_SERVER['HTTP_USER_AGENT'], 'bot') !== false || stripos($_SERVER['HTTP_USER_AGENT'], 'facebook') !== false ) {
        $gmapsKey = ['api_key' => 'dummy'];
    }
    if ( $gmapsKey ) {
        Html::addVariable('__EZ_GMAPS_KEY', $gmapsKey['api_key']);
    }

    // Add plugins
    Html::inlineScript(SITE_ROOT . '/src/plugins/custom/base.js');
    if ( is_file(SITE_ROOT . '/src/plugins/custom/' . $business['business_id'] . '.js') ) {
        Html::inlineScript(SITE_ROOT . '/src/plugins/custom/' . $business['business_id'] . '.js');
    }

    list($groups, $navs) = loadCustomNav($business['business_id']);
    Html::addVariable('__EZ_CUSTOM_NAV_GROUPS', $groups);
    Html::addVariable('__EZ_CUSTOM_NAV', $navs);
    if ( $business['website_theme'] == 'truevalue' ) {
        Html::addVariable('__EZ_TV_ECOM_PLAN', $business['truevalue_ecommerce_plan']);
    } else {
        Html::addVariable('__EZ_TV_ECOM_PLAN', $business['other_ecommerce_plan'] ?? '');
    }

    if ( isset($business['settings']['customCss']) ) {
        $customCss = $business['settings']['customCss'];
        $customCss = str_replace('..', '', $customCss);
        $cssPath = __DIR__ . '/../src/custom-styles/' . $customCss;
        if ( $customCss && is_file($cssPath) ) {
            Html::addHtml(
                "\n<style type=\"text/css\">\n/* $customCss */\n" . file_get_contents($cssPath) . "\n</style>\n", true);
        }
    }

    if ( defined('IS_DYNDEV') && IS_DYNDEV ) {
        $stmt = DB::execute('ecommerce',
            'SELECT business_slug slug, business_name name FROM businesses ORDER BY business_name');
        $businesses = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ( $businesses as &$devb ) {
            $devb['url'] = 'http://' . $devb['slug'] . '.dev.ez-ad.io/';
        }
        Html::addVariable('__EZ_DEV_STORE_LIST', $businesses);
        Html::addVariable('__EZ_DEV', true);
    }

    if ( $business['business_id'] == 4709 ) {
        Html::addVariable('__EZ_TVR_NAME', 'Valley Wide Rewards');
    } else {
        Html::addVariable('__EZ_TVR_NAME', 'True Value Rewards');
    }

    Html::body("<strong>$businessName $business[meta_description]</strong>");

    // some of these plans are "other" for some fucking reason so i'm also allowing is_truevalue_ecommerce
    // to trigger this.
    // need to check master_businesses and company_billing must be 1 or 25
    if ( $business['is_truevalue_ecommerce'] || in_array((int)$business['company_billing'], [1, 25]) ) {
        // brandify foot traffic code.
       /* Html::addBottomBody('<script async src="//static.where2getit.com/w2gi/javascript/client.min.js" '
            . 'data-a="C3E65434-B1A6-11EB-BAF2-0234919C4603" data-s="truevalue" id="brandifyjs"></script>');*/

        // google analytics/gtm
        if ( $business['business_id'] != 1 && $business['store_number'] ) {
            if ( useGA4() ) {
                Html::addTopBody(<<<'HTML'
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-WPVD7Y7001"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-WPVD7Y7001');
</script>
HTML
                );
            } else {
                Html::addTopBody(<<<'HTML'
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PPF9G4N"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
HTML
                );

                Html::addHtml(<<<'HTML'
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PPF9G4N');</script>
<!-- End Google Tag Manager -->
HTML
                );
            }
        }
    }

    // if release channel id is 4, it (was) the truevalue-project branch.
    // every channel can use the "app" branch but we still swap UI around depending on channel.
    Html::addVariable('__EZ_IS_TRUEVALUE', $business['website_theme'] == 'truevalue');
    Html::addVariable('__EZ_THEME', $business['website_theme'] ?: '');

    $hasSvelte = isset($business['extra_data']['svelte']) && $business['extra_data']['svelte'];
    if ( $hasSvelte && rtrim($_SERVER['REQUEST_URI'], '/') === '/admin' ) {
        header('Location: /admin/?a=1#/admin/'); // ?a=1 to prevent redir looping
        exit;
    }

    Html::addVariable('__EZ_SVELTE', $hasSvelte);

    // if "www-ecdevfe-test4" exists in here for custom hosts, use it
    $devOptions = DB::redis()->hget('ecom.fe.devOptions', basename(SITE_ROOT));
    if ( $devOptions ) {
        $devOptions = json_decode($devOptions, true);
        Html::addVariable('__EZ_BACKEND_HOST', [
            'legacy' => $devOptions['legacyHost'] ?? 'https://api.ezadtv.com',
            'modern' => $devOptions['modernHost'] ?? 'https://ecomapi.ezadtv.com',
        ]);
        if ( isset($devOptions['enableDebugBar']) && $devOptions['enableDebugBar'] ) {
            require __DIR__ . '/../backend-src/top_debug_bar.php';
        }
    } else {
        Html::addVariable('__EZ_BACKEND_HOST', null);
    }
}

echo Html::customize($customizeFilePath, $customizeReplacements);
