<?php

// we need some kind of warning if we are on ecomapi.ezadtv.com, ecom-stage.ezadlive, ecom-live2, ecom-live3
// same for api.ezadtv.com, api-dev.ezadtv.com, api-dev2.ezadtv.com, api-dev3
$liveHosts = [
    'ecomapi.ezadtv.com', 'ecom-stage.ezadlive.com', 'ecom-live2.ezadlive.com', 'ecom-live3.ezadlive.com',
    'api.ezadtv.com', 'api-dev.ezadtv.com', 'api-dev2.ezadtv.com', 'api-dev3.ezadtv.com',
];
$modernHost = parse_url($devOptions['modernHost'] ?? 'https://ecomapi.ezadtv.com', PHP_URL_HOST);
$legacyHost = parse_url($devOptions['legacyHost'] ?? 'https://api.ezadtv.com', PHP_URL_HOST);
$isOnLive = in_array($modernHost, $liveHosts) || in_array($legacyHost, $liveHosts);

if ( isset($_POST['switchBusinessID']) && is_numeric($_POST['switchBusinessID']) ) {
    $jsonContents = "const g = '$_POST[switchBusinessID].json'\n;export default g;\n";
    $ok = file_put_contents(__DIR__ . '/../src/GlobalSettings.js', $jsonContents);
    if ( $ok ) {
        echo json_encode(['status' => 'ok']);
    } else {
        echo json_encode(['status' => 'err', 'err' => 'Could not write settings js file']);
    }
    exit;
}

if ( isset($_POST['switchBranch'])
    && (strpos(__DIR__, 'www-ecdevfe') !== false || strpos(__DIR__, '/home/steven/') !== false) ) {
    // call api to kachooni gitpull
    switchBranch($_POST['switchBranch']);
    echo json_encode(['status' => 'ok']);
    exit;
}

$dirname = basename(dirname(__DIR__));
$marginTop = '70px';
$bselector = <<<HTML
<style>
body {
margin-top: $marginTop !important;
}
</style>
<script>
(() => {
const savedCode = window.localStorage.getItem('gitSavedCode');
const savedEmail = window.localStorage.getItem('gitSavedEmail');
const savedPass = window.localStorage.getItem('gitSavedPass');
const businessSelectorChanged = function(e) {
    const fd = new FormData();
    fd.append('switchBusinessID', e.target.value);
    fetch('/index.php', {
        method: 'POST',
        body: fd,
    }).then(r => r.json()).then(r => {
        if ( r.status === 'ok' ) {
            window.location.reload();
        } else {
            alert(r.err);
        }
    });
};
const branchSelectorChanged = async function(e) {
    // authentication
    const email = document.querySelector('#branchSelectorEmail').value;
    const password = document.querySelector('#branchSelectorPass').value;
    if ( !savedCode || email !== savedEmail ) {
        let r1 = await fetch('https://kachooni.com/api:git/trigger-pull-start', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ username: email, password }),
        });
        let j1 = await r1.json();
        if ( j1.status !== 'ok' ) {
            alert(j1.message);
            return;
        }
        window.localStorage.setItem('gitSavedEmail', email);
        window.localStorage.setItem('gitSavedPass', password);
    }

    const code = savedCode ? window.prompt('Enter code', savedCode) : window.prompt('Enter code');

    const branch = document.querySelector('#branchSelectorDebug').value;
    const directory = "$dirname";
    let r = await fetch('https://kachooni.com/api:git/trigger-pull', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({branch, directory, code}),
    });
    let j = await r.json();
    if ( j.status === 'ok' ) {
        alert('Request sent, please wait a few minutes before refreshing');
        window.localStorage.setItem('gitSavedCode', code);
    } else {
        if ( j.message.includes('expired') ) {
            window.localStorage.removeItem('gitSavedCode');
        }
        alert(j.message);
    }
};
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#businessSelectorDebug').addEventListener('input', businessSelectorChanged);
    const b = document.querySelector('#branchSelectorBtn');
    if ( b ) {
        b.addEventListener('click', branchSelectorChanged);
    }
    if ( savedEmail ) {
        document.querySelector('#branchSelectorEmail').value = savedEmail;
    }
    if ( savedPass ) {
        document.querySelector('#branchSelectorPass').value = savedPass;
    }
});
})();
</script>
HTML;
$topOffset = '43px';
if ( $isOnLive ) {
    $bselector .= "\n<div style='position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(90deg, #d00, #700, #d00);
    color: #fff;
    height: 40px;
    width: 100%;
    line-height: 40px;
    font-weight: bold;
    text-align: center;
    font-size: 24px;
    letter-spacing: .05em;'>THIS SITE IS USING LIVE BACKEND APIS</div>\n";
} else {
    $bselector .= "\n<div style='position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(90deg, #0049db, #002775, #0049db);
    color: #fff;
    height: 40px;
    width: 100%;
    line-height: 40px;
    font-weight: bold;
    text-align: center;
    font-size: 24px;
    letter-spacing: .05em;'>THIS SITE ONLY USES DEV BACKEND APIS</div>\n";
}

if ( strpos(__DIR__, 'www-ecdevfe') !== false || strpos(__DIR__, '/home/steven/') !== false  ) {
    // for ecdevfe add a branch selector as well, which should call a kachooni API to trigger a gitpull
    // on this folder.
    $branches = getFrontendBranches();
    $currentBranch = getCurrentBranch();

    $bselector .= "\n<div style='position:absolute;top:$topOffset;left:3px'><select style='width:200px' id='branchSelectorDebug'>\n";
    foreach ( $branches as $branch ) {
        $sel = $branch == $currentBranch ? 'selected="selected"' : '';
        $bselector .= "<option $sel value='$branch'>$branch</option>\n";
    }
    $bselector .= "</select>\n";
    $bselector .= "User: <input style='width:100px' type='text' id='branchSelectorEmail'>\n";
    $bselector .= "Pass: <input style='width:100px' type='password' id='branchSelectorPass'>\n";
    $bselector .= "<button id='branchSelectorBtn' type='button'>Update</button></div>\n";
}

$stmt = DB::execute('ecommerce', 'SELECT business_id, business_name FROM businesses ORDER BY business_id');
$bselector .= "\n<div style='position:absolute;top:$topOffset;right:3px'><select id='businessSelectorDebug'>\n";
while ( $row = $stmt->fetch(PDO::FETCH_ASSOC) ) {
    if ( file_exists("/home/heyads/ecom-deploy/allsettings/$row[business_id].json") ) {
        $sel = $business['business_id'] == $row['business_id'] ? 'selected' : '';
        $bselector .= "<option $sel value='$row[business_id]'>$row[business_id] $row[business_name]</option>\n";
    }
}
$bselector .= "</select></div>\n";
Html::addTopBody($bselector);

