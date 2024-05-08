#!/bin/sh

cd `dirname $0`
if [ -d dist ]; then
    php7 backend-src/gen_htaccess.php
    rm -rf public-site
    cp -R dist public-site
fi
