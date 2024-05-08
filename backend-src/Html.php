<?php

class Html
{
    private static $customHead = '';
    private static $customHeadEnd = '';
    private static $topBody = '';
    private static $bottomBody = '';
    private static $customBody = '';

    private static $title = '';
    private static $metaName = [];
    private static $metaItemprop = [];
    private static $metaProperty = [];
    private static $ldJson = [];
    private static $siteVerificationTokens = [];

    public static function addHtml($html, $end = false)
    {
        if ( $end ) {
            self::$customHeadEnd .= (string) $html;
        } else {
            self::$customHead .= (string)$html;
        }
    }

    public static function addTopBody($html)
    {
        self::$topBody .= $html;
    }

    public static function addBottomBody($html)
    {
        self::$bottomBody .= $html;
    }

    public static function inlineScript($file)
    {
        $contents = file_get_contents($file);
        $contents = preg_replace('#^//.+$#m', '', $contents); // strip comments
        self::$customHead .= "<script>$contents</script>";
    }

    public static function addVariable($name, $value)
    {
        self::addHtml('<script>' . $name . '=' . json_encode($value) . ';</script>');
    }

    public static function tag($name, array $attrs = [], $content = null)
    {
        $d = "<$name";
        foreach ($attrs as $k => $v) {
            $d .= " $k=\"" . htmlspecialchars($v) . "\"";
        }
        $d .= '>';

        if ($content !== null) {
            $d .= "$content</$name>";
        }

        return $d;
    }

    public static function link($kv)
    {
        self::$customHead .= self::tag('link', $kv);
    }

    public static function metaDescriptions($description)
    {
        Html::metaName('description', $description);
        Html::metaItemprop('description', $description);
        Html::metaName('twitter:description', $description);
        Html::metaName('og:description', $description);
        Html::metaProperty('og:description', $description);
    }

    public static function metaImages($image)
    {
        Html::metaItemprop('image', $image);
        Html::metaName('twitter:image:src', $image);
        Html::metaName('twitter:image', $image);
        Html::metaName('og:image', $image);
        Html::metaProperty('og:image', $image);
    }

    public static function metaTitles($title)
    {
        Html::metaItemprop('name', $title);
        Html::metaName('twitter:title', $title);
        Html::metaName('og:title', $title);
        Html::metaProperty('og:title', $title);
    }

    public static function metaUrls($url)
    {
        Html::metaProperty('og:url', $url);
    }

    public static function metaName($name, $content)
    {
        self::$metaName[$name] = $content;
    }

    public static function metaItemprop($name, $content)
    {
        self::$metaItemprop[$name] = $content;
    }

    public static function metaProperty($name, $content)
    {
        self::$metaProperty[$name] = $content;
    }

    public static function verificationToken($token)
    {
        self::$siteVerificationTokens[] = $token;
    }

    public static function title($title)
    {
        self::$title = $title;
    }

    public static function body($body)
    {
        self::$customBody = $body;
    }

    public static function ldJson($data)
    {
        $allArgs = func_get_args();
        if ( count($allArgs) > 1 ) {
            foreach ( $allArgs as &$arg ) {
                // remove null properties
                if ( is_array($arg) ) {
                    $arg = array_filter($arg, function($v) { return $v !== null; });
                }
            }
            // if multiple parameters given, the JSON will be [{}, {}, {}], etc.
            $data = array_filter($allArgs);
            self::$ldJson = array_values($data);
        } else {
            // remove null properties
            $data = array_filter($data, function($v) { return $v !== null; });
            self::$ldJson = $data;
        }
    }

    public static function makeBreadcrumbList($links)
    {
        $elements = [];
        $i = 1;
        foreach ( $links as $link ) {
            $elements[] = [
                '@type' => 'ListItem',
                'position' => $i++,
                'name' => $link['name'],
                'item' => 'https://' . $_SERVER['HTTP_HOST'] . $link['path'],
            ];
        }

        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => $elements,
        ];
    }

    public static function customize($filePath, $replacements = [])
    {
        if ( substr($filePath, -4) == '.php' ) {
            ob_start();
            extract($replacements, EXTR_SKIP);
            include $filePath;
            $html = ob_get_clean();
        } else {
            $html = file_get_contents($filePath);
            if ( $replacements ) {
                $search = array_keys($replacements);
                $replace = array_values($replacements);
                $html = str_replace($search, $replace, $html);
            }
        }

        $html = str_replace("<noscript></noscript>", "<noscript>" . self::$customBody . "</noscript>", $html);

        $startCode = "<script>__EZ_START_HEAD=''</script>";
        $endCode = "<script>__EZ_END_HEAD=''</script>";

        $startPos = strpos($html, $startCode);
        if ( $startPos === false ) {
            // some auto formatting tools add spaces around the = and break it
            $startCode = "<script>__EZ_START_HEAD = ''</script>";
            $endCode = "<script>__EZ_END_HEAD = ''</script>";
            $startPos = strpos($html, $startCode);
        }

        $endPos = strpos($html, $endCode, $startPos) + strlen($endCode);

        $toInsert = '';
        $toInsert .= self::tag('title', [], htmlspecialchars(self::$title));
        foreach ( self::$siteVerificationTokens as $token ) {
            $toInsert .= self::tag('meta', ['name' => 'google-site-verification', 'content' => $token]);
        }
        foreach ( self::$metaName as $key => $content ) {
            $toInsert .= self::tag('meta', ['name' => $key, 'content' => $content]);
        }
        foreach ( self::$metaItemprop as $key => $content ) {
            $toInsert .= self::tag('meta', ['itemprop' => $key, 'content' => $content]);
        }
        foreach ( self::$metaProperty as $key => $content ) {
            $toInsert .= self::tag('meta', ['property' => $key, 'content' => $content]);
        }

        if ( self::$ldJson ) {
            $toInsert .= "<script type=\"application/ld+json\">\n"
                . json_encode(self::$ldJson, JSON_PRETTY_PRINT) . "\n</script>";
        }

        $toInsert .= self::$customHead;

        // the __EZ stuff will not be in the final html.
        // concatenate the code before it, the custom data, and the code after.
        $html = substr($html, 0, $startPos) . "\n" . $toInsert . "\n" . substr($html, $endPos);

        // add stuff right before closing </head> tag and after opening <body> tag
        if ( self::$customHeadEnd || self::$topBody ) {
            $html = str_replace('</head><body>', self::$customHeadEnd . '</head><body>' . self::$topBody, $html);
        }
        if ( self::$bottomBody ) {
            $html = str_replace('</body></html>', self::$bottomBody . '</body></html>', $html);
        }

        return $html;
    }
}
