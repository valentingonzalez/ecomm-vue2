<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link type="text/css" rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Google+Sans:400,500,700">
    <link rel="stylesheet" href="<?php echo '/assets/css/app.css' ?>">
    <link rel="stylesheet" href="<?php echo '/assets/css/update.css' ?>">
    <style>
        :deep(.image img),
        :deep(.card-body img) {
            max-width: 100%;
        }

        .card {
            margin-bottom: 30px;
        }
        .card .card-header {
            font-size: 20px;
            font-weight: bold;
            background: #fff;
        }

        .card .card-body {
            font-size: 14px;
            line-height: 22px;
        }

        .card .card-body p {
            color: #040404;
        }

        @media (max-width: 767px) {
            .card {
                margin-bottom: 16px;
            }
        }

        .icon {
            width: 20px;
        }

        .icon svg * {
            fill: var(--primary);
        }

        .address .text:not(:last-child) {
            margin-right: 2px;
        }
        .address .text:not(:last-child)::after {
            content: ', ';
        }

        .down-arrow * {
            stroke: var(--primary);
        }

        .store-hours .time {
            letter-spacing: -.4px;
            font-size: 13px;
        }
    </style>
    <script>__EZ_START_HEAD = ''</script>
    <title></title>
    <script>__EZ_END_HEAD = ''</script>
</head>
<body>

<?php

$aboutUsTitle = $settings['aboutUsTitleHidden'] ? '' : ($settings['aboutUsTitle'] ?: 'Store Info');
if ( $about['froala'] ) {
    $froala = json_decode(json_decode($about['froala_data'], true), true);
    $content = implode('', $froala['blocks']);
    $content = str_replace('contenteditable="true"', '', $content);
} else {
    $content = $about['description'];
}

?>

<div class="position-relative overflow-hidden">

    <?php include __DIR__ . '/dyn_header.php'; ?>

    <main>
        <div class="container">
            <?php if ( $aboutUsTitle ) { ?>
            <h1 class="results-page-title"><?php echo $aboutUsTitle ?></h1>
            <?php } ?>
            <div class="row">
                <?php if ( $content ) { ?>
                <div class="col-md-7 col-lg-8">
                    <div class="card">
                        <div class="card-body">
                            <div><?php echo $content ?></div>
                        </div>
                    </div>
                </div>
                <?php } ?>
                <div class="col-md-5 col-lg-4">
                    <?php foreach ( $about['locations'] as $loc ) { ?>
                    <div class="card">
                        <div class="card-header">
                            <div class="d-flex align-items-center justify-content-between text-nowrap">
                                <h1 class="h5 mb-0 mr-2 font-weight-bold"><?php echo htmlspecialchars($loc['name']) ?></h1>
                            </div>
                        </div>
                        <div class="card-body">
                            <a href="https://www.google.com/maps/search/?api=1&query=<?php echo htmlspecialchars("$loc[address] $loc[state] $loc[city] $loc[zip]") ?>"
                               class="mb-2 address cursor-pointer text-dark d-flex align-items-center">
                                <div class="icon mr-2 d-flex align-items-center">
                                    <svg width="14" height="18" viewBox="0 0 17 23" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.5 0C3.813 0 0 3.737 0 8.33c0 5.7 7.607 14.068 7.93 14.421a.776.776 0 001.14 0C9.392 22.398 17 14.03 17 8.33 17 3.737 13.187 0 8.5 0zm0 12.52c-2.358 0-4.277-1.88-4.277-4.19 0-2.311 1.919-4.191 4.277-4.191s4.276 1.88 4.276 4.19c0 2.312-1.918 4.192-4.276 4.192z"
                                              fill="#ED672F" fill-rule="nonzero"/>
                                    </svg>
                                </div>
                                <div class="d-inline">
                                    <?php if ( $loc['address'] ) { ?>
                                        <span class="text"><?php echo htmlspecialchars($loc['address']) ?></span>
                                    <?php } ?>
                                    <?php if ( $loc['city'] ) { ?>
                                        <span class="text"><?php echo htmlspecialchars($loc['city']) ?></span>
                                    <?php } ?>
                                    <?php if ( $loc['state'] ) { ?>
                                        <span class="text"><?php echo htmlspecialchars($loc['state']) ?></span>
                                    <?php } ?>
                                    <?php if ( $loc['zip'] ) { ?>
                                        <span class="text"><?php echo htmlspecialchars($loc['zip']) ?></span>
                                    <?php } ?>
                                </div>
                            </a>
                            <a href="tel:<?php echo htmlspecialchars($loc['phone']) ?>"
                               class="mb-2 phone text-dark d-flex align-items-center">
                                <div class="icon mr-2 d-flex align-items-center">
                                    <svg width="17" height="16" viewBox="0 0 19 18" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                                d="M18.574 14.237l-2.934-2.786c-.585-.553-1.553-.536-2.157.038l-1.479 1.404-.291-.154c-.934-.492-2.212-1.165-3.556-2.442C6.808 9.017 6.099 7.8 5.58 6.914c-.055-.094-.107-.184-.159-.27l.992-.94.488-.465c.606-.575.622-1.494.04-2.048L4.005.404C3.423-.149 2.455-.132 1.85.443l-.827.79.023.02a4.486 4.486 0 00-.985 2.3c-.387 3.05 1.08 5.837 5.064 9.62 5.506 5.227 9.943 4.832 10.135 4.813a5.174 5.174 0 001.222-.291 4.838 4.838 0 001.198-.645l.018.016.838-.78c.604-.575.622-1.494.04-2.049z"
                                                fill="#ED672F" fill-rule="nonzero"/>
                                    </svg>
                                </div>
                                <?php echo htmlspecialchars($loc['phone']) ?>
                            </a>
                            <?php if ( $settings['aboutUsEmails'] ) { ?>
                            <a href="mailto:<?php echo htmlspecialchars($loc['email']) ?>"
                               class="mb-2 text-dark d-flex align-items-center">
                                <div class="icon mr-2 d-flex align-items-center">
                                    <svg width="18px" height="15px" viewBox="0 0 18 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <path d="M16.2,0 L1.8,0 C0.81,0 0.009,0.81 0.009,1.8 L0,12.6 C0,13.59 0.81,14.4 1.8,14.4 L16.2,14.4 C17.19,14.4 18,13.59 18,12.6 L18,1.8 C18,0.81 17.19,0 16.2,0 Z M16.2,3.6 L9,8.1 L1.8,3.6 L1.8,1.8 L9,6.3 L16.2,1.8 L16.2,3.6 Z" id="mail" fill="#DB4A24" fill-rule="nonzero"></path>
                                        </g>
                                    </svg>
                                </div>
                                <?php echo htmlspecialchars($loc['email']) ?>
                            </a>
                            <?php } ?>
                            <div class="store-hours mt-3">
                                <div class="font-weight-bold text-uppercase small">Store Hours</div>
                                <div class="d-flex justify-content-between">
                                    <?php foreach ( $loc['hours'] as $day => $hours ) { ?>
                                    <div>
                                        <div class="pb-2">
                                            <div class="small font-weight-bold"><?php echo strtoupper($day) ?></div>
                                            <?php if ( !$hours || $hours['closed'] ) { ?>
                                            <div class="time">Closed</div>
                                            <?php } else { ?>
                                            <div class="time">
                                                <div class="mb-n1"><?php echo ltrim($hours['open'], '0') ?></div>
                                                <div><?php echo ltrim($hours['close'], '0') ?></div>
                                            </div>
                                            <?php } ?>
                                        </div>
                                    </div>
                                    <?php } ?>
                                </div>
                            </div>
                        </div>
                    </div>
                    <?php } ?>
                </div>
            </div>
        </div>
    </main>

    <?php include __DIR__ . '/dyn_footer.php'; ?>

</div>

</body>
</html>
