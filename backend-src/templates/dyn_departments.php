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
        .department-item {
            position: relative;
            width: auto;
            height: 100%;
            -ms-flex-negative: 0;
            flex-shrink: 0;
            cursor: pointer;
        }

        .department-item:hover {
            text-decoration: none;
        }

        .departments {
            display: flex;
            width: 100%;
            height: 100%;
            text-align: center;
            padding: 20px 10px;
            flex-direction: column;
            justify-content: space-between;
        }

        .departments .loader-wrapper {
            height: 150px;
        }

        .departments img.department-image {
            display: block;
            max-height: 130px;
            margin: 0 auto;
            margin-bottom: 30px;
        }

        .departments h6 {
            color: var(--text);
            font-weight: 600;
            white-space: normal;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            margin-bottom: 0;
        }

        .card {
            border: none;
            box-shadow: 0 14px 10px 0 rgba(34, 44, 73, .04);
            border-radius: 13px;
            border: 1px solid #E8E8E8;
        }

        .card .card-body {
            padding: 0;
        }

        .card .card-body .edit-product {
            position: relative;
            top: -10px;
            left: 0;
            margin-left: 5px !important;
        }

        .card .card-body .edit-product a {
            margin: 0 3px;
        }

        .card .card-body .edit-product a img {
            width: 25px;
            height: 25px;
        }

        @media screen and (max-width: 576px) {
            .departments img.department-image {
                margin-bottom: 0;
            }
            .departments h6 {
                margin-top: 12px;
                margin-bottom: 0;
            }
        }
    </style>
    <script>__EZ_START_HEAD = ''</script>
    <title></title>
    <script>__EZ_END_HEAD = ''</script>
</head>
<body>

<div class="position-relative overflow-hidden">

    <?php include __DIR__ . '/dyn_header.php'; ?>

    <main class="department-wrapper">
        <div class="container search-container">
            <div class="row small-gutters">
                <div class="col-md-12">
                    <h1 class="results-page-title">Departments</h1>
                </div>
                <?php foreach ( $departments as $department ) { ?>
                    <div class="col-sm-6 col-md-4 col-xl-3 mb-2 department-item">
                        <div class="departments-wrapper h-100">
                            <a href="/department/<?= slugify($department['dept_name']) ?>-<?= $department['dept_id']?>"
                               class="card card-primary department-item">
                                <div class="card-body">
                                    <div class="departments">
                                        <img src="<?= $department['image_url'] ?>"
                                             alt="<?= htmlspecialchars(strtolower($department['dept_name'])) ?>"
                                             class="department-image img-fluid my-0 mx-auto" width="130" height="130" style="object-fit: contain;">
                                        <strong><?= htmlspecialchars($department['dept_name']) ?></strong>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                <?php } ?>
            </div>
        </div>
    </main>

    <?php include __DIR__ . '/dyn_footer.php'; ?>

</div>

</body>
</html>
