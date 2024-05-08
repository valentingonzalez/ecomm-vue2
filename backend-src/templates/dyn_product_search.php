<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link type="text/css" rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Google+Sans:400,500,700">
    <link rel="stylesheet" href="<?php echo '/assets/css/app.css' ?>">
    <link rel="stylesheet" href="<?php echo '/assets/css/update.css' ?>">
    <script>__EZ_START_HEAD = ''</script>
    <title></title>
    <script>__EZ_END_HEAD = ''</script>
</head>
<body>

<div class="position-relative overflow-hidden">

    <?php include __DIR__ . '/dyn_header.php'; ?>

    <?php 
        function generatePagination($paginationData) {
            $currentPage = intval($paginationData['current_page']);
            $lastPage = intval($paginationData['last_page']);
            $path = "/search" ."/". slugify($paginationData['search'])."?keyword=".urlencode($paginationData['search'])."&sort=relevancy&limit=96";
        
            echo '<ul class="m-0 pagination justify-content-center">';
            
            // First and Previous buttons
            echo '<li class="page-item"><a aria-label="First Page" href="'.$path.'&page=1" class="page-link '.(1 == $currentPage ? "disabled" : "").'" rel="first"><svg data-v-061de130="" width="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6"><path data-v-061de130="" stroke-linecap="round" stroke-linejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"></path></svg></a></li>';
            echo '<li class="page-item"><a aria-label="Previous Page" href="'.$path.'&page='.($currentPage > 1 ? ($currentPage - 1) : 1).'" class="page-link '.(1 == $currentPage ? "disabled" : "").'" rel="prev"><svg data-v-061de130="" width="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6"><path data-v-061de130="" stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"></path></svg></a></li>';
        
            // Pagination numbers
            for ($page = 1; $page <= $lastPage; $page++) {
                echo '<li class="page-item '.($page == $currentPage ? "active" : "").'"><a aria-label="Go to Page '.$page.'" href="' . $path . '&page=' . $page . '" class="page-link" tabindex="0">' . $page . '</a></li>';
            }
        
            // Next and Last buttons
            echo '<li class="page-item"><a aria-label="Next Page" href="' . $path . '&page=' . ($currentPage + 1) . '" class="page-link" rel="next"><svg data-v-061de130="" width="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6"><path data-v-061de130="" stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path></svg></a></li>';
            echo '<li class="page-item"><a aria-label="Last Page" href="' . $path . '&page=' . $lastPage . '" class="page-link" rel="last"><svg data-v-061de130="" width="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6"><path data-v-061de130="" stroke-linecap="round" stroke-linejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"></path></svg></a></li>';
            
            echo '</ul>';
        }

        function departmentsHirarchy($data, $search) {
            $path = "/search" ."/". slugify($search)."?keyword=".urlencode($search)."&sort=relevancy&limit=96";
            if($data){
                echo '<div class="tree-view">';
                    foreach ($data as $key => $dept) {
                        echo '<div class="tree-branch expanded">';
                            if(count($dept["sub_depts"]) > 0){
                                echo '<div class="tree-node has-children">'; 
                                    echo '<div class="tree-node-icon"></div>';
                                    echo '<a href="'.$path.'&dept_id='.$dept['dept_id'].'" class="tree-node-label" tabindex="0"> '.$dept['dept_name'].' ('.$dept['count'].') </a>';
                                echo '</div>';                        
                                echo '<div class="tree-view">';
                                    foreach ($dept['sub_depts'] as $key1 => $class) {
                                        echo '<div class="tree-branch expanded">';
                                            if(count($class["sub_depts"]) > 0){
                                                echo '<div class="tree-node has-children">'; 
                                                    echo '<div class="tree-node-icon"></div>';
                                                    echo '<a href="'.$path.'&dept_id='.$class['dept_id'].'" class="tree-node-label" tabindex="0"> '.$class['dept_name'].' ('.$class['count'].') </a>';
                                                echo '</div>';                        
                                                echo '<div class="tree-view">';
                                                    foreach ($class['sub_depts'] as $key1 => $fineline) {
                                                        echo '<div class="tree-branch expanded">';
                                                            echo '<div class="tree-node">'; 
                                                                echo '<a href="'.$path.'&dept_id='.$fineline['dept_id'].'" class="tree-node-label" tabindex="0"> '.$fineline['dept_name'].' ('.$fineline['count'].') </a>';
                                                            echo '</div>'; 
                                                        echo '</div>'; 
                                                    }
                                                echo '</div>';
                                            } else {
                                                echo '<a href="'.$path.'&dept_id='.$class['dept_id'].'" class="tree-node-label" tabindex="0"> '.$class['dept_name'].' ('.$class['count'].') </a>';
                                            }
                                        echo '</div>'; 
                                    }
                                echo '</div>';
                            } else {
                                echo '<a href="'.$path.'&dept_id='.$dept['dept_id'].'" class="tree-node-label" tabindex="0"> '.$dept['dept_name'].' ('.$dept['count'].') </a>';
                            }
                        echo '</div>';                        
                    }
                echo '</div>';
            }
        }
    ?>
    <main style="padding-top: 30px;">
        <!-- product details -->
        <div class="container search-container">
            <div class="row">
                <div class="col-lg-3">
                    <div class="filterWrapper">
                        <div class="card filters rounded-0">
                            <div class="card-body">
                                <h5 class="mb-3">Filter Results</h5><a href="#" aria-label="Hide Filters" class="d-lg-none filters-close-bt"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <title>e-remove</title>
                                        <g stroke-linecap="round" stroke-linejoin="round" stroke-width="2" fill="#a0a0ba" stroke="#a0a0ba">
                                            <line fill="none" stroke="#a0a0ba" stroke-miterlimit="10" x1="19" y1="5" x2="5" y2="19"></line>
                                            <line fill="none" stroke="#a0a0ba" stroke-miterlimit="10" x1="19" y1="19" x2="5" y2="5"></line>
                                        </g>
                                    </svg></a>
                                <div class="filter-items"><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----></div>
                                <div class="mb-2">
                                    <div class="custom-control custom-checkbox"><input id="checkbox-1" type="checkbox" name="promo-check" aria-label="Promo Products" class="custom-control-input" value="true"><label for="checkbox-1" class="custom-control-label"> Promo Products </label></div>
                                </div>
                                <div class="mb-3">
                                    <div class="custom-control custom-checkbox"><input id="checkbox-2" type="checkbox" name="in-stock-check" aria-label="In-Stock Products" class="custom-control-input" value="true"><label for="checkbox-2" class="custom-control-label"> In-Stock Products </label></div>
                                </div>                                
                                <div class="mb-3" style="max-width: 400px;">
                                    <div class="d-flex flex-column mt-2 mb-1">
                                        <h6 class="m-0"> Departments </h6>
                                        <div class="d-flex align-items-end flex-lg-column flex-xl-row mt-1 mb-1"><a href="#" class="mr-1 mr-lg-0 mr-xl-1">Collapse All</a>
                                            <div class="d-lg-none d-xl-block">·</div><a href="#" class="ml-1 ml-lg-0 ml-xl-1">Expand All</a>
                                        </div>
                                    </div>
                                    <?= departmentsHirarchy($products['departments'], $products['data']["search"] ?? "") ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-9">
                    <?php if($products['data']) { ?>
                        <div class="mb-3 search-result-page">
                                <div class="filters-controls d-flex flex-column flex-sm-row align-items-sm-center w-100">
                                    <div class="title">
                                        <span><?= $products['data']['total'] ?> Results</span>
                                        <?php if(!empty($products['data']['search']) && $products['data']['search'] != '""') { ?>
                                            <span>
                                                for "<b><?= $products['data']['search'] ?></b>"
                                            </span>
                                        <?php } ?>
                                    </div>
                                </div>
                            <div class="d-sm-flex align-items-center w-100 mt-2"><!---->
                                <div class="d-none d-sm-block pt-2 pt-sm-0">
                                    <?= generatePagination($products['data']) ?>
                                </div>
                            </div>
                        </div>
                    <?php } ?>
                    <div class="search-product row small-gutters">
                        <?php foreach ( ($products['data']['data'] ?? []) as $product ) { ?>
                        <div class="col-6 col-md-4 col-xl-3 mb-2 mb-md-4">
                            <div class="product-item-wrapper h-100">
                                <a href="/p/<?= $product['slug'] ?>" class="card card-primary product-item">
                                    <div class="card-body p-0 h-100">
                                        <div class="product">
                                            <div class="image-holder">
                                                <img src="<?= $product['image_url'] ?>" width="200" height="200" alt="<?= htmlspecialchars($product['title']) ?>" class="product-image img-fluid" style="object-fit: contain;">
                                            </div>
                                            <div class="detail">
                                                <h6><?= htmlspecialchars($product['title']) ?></h6>
                                                <div class="d-flex flex-column flex-sm-row justify-content-between info">
                                                    <?php if ( (!isset($settings['products']['hideReg']) || !$settings['products']['hideReg'])
                                                        && (!isset($settings['products']['hidePrice']) || !$settings['products']['hidePrice'])
                                                        && (!isset($product['settings']['hidePrice']) || !$product['settings']['hidePrice']) ) { ?>
                                                    <div class="standard-price">
                                                        <div class="font-weight-normal small d-none d-sm-block">reg.</div>$<?= $product['price'] ?>
                                                    </div>
                                                    <?php } ?>
                                                    <div class="align-items-end justify-content-sm-end d-flex text-sm-right ml-md-3 special-details">
                                                        <span class="font-weight-bold small text-muted">
                                                            <span>In Stock: <?= $product['num_inventory'] ?></span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <?php } ?>
                    </div>
                    <?php if($products['data']) { ?>
                        <div class="mb-3 search-result-page">
                            <div class="d-sm-flex align-items-center w-100 mt-2">
                                <div class="d-none d-sm-block pt-2 pt-sm-0">
                                    <?= generatePagination($products['data']) ?>
                                </div>
                            </div>
                        </div>
                    <?php } ?>
                </div>
            </div>
        </div>
    </main>
<style>
    .tree-view {
        font-size: 14px
    }

    .tree-view .tree-branch .tree-view {
        max-height: 0;
        overflow: hidden;
        -webkit-transition: max-height .2s;
        transition: max-height .2s
    }

    .tree-view .tree-branch .tree-view:hover {
        overflow: visible
    }

    .tree-view .tree-branch .tree-node {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        overflow: hidden
    }

    .tree-view .tree-branch .tree-node .tree-node-label {
        padding: 1px 3px;
        border-radius: 2px;
        cursor: pointer
    }

    .tree-view .tree-branch .tree-node:hover {
        overflow: visible
    }

    .tree-view .tree-branch .tree-node:hover .tree-node-label {
        background: var(--primary);
        color: #fff
    }

    .tree-view .tree-branch .tree-node .tree-node-icon {
        cursor: pointer;
        width: 8px;
        height: 8px;
        -webkit-transition: -webkit-transform .2s;
        transition: -webkit-transform .2s;
        transition: transform .2s;
        transition: transform .2s,-webkit-transform .2s;
        -webkit-transform-origin: 2px 3px;
        transform-origin: 2px 3px;
        margin-left: 3px;
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
        border-left: 4px solid var(--primary)
    }

    .tree-view .tree-branch>.tree-view {
        margin-left: 22px
    }

    .tree-view .tree-branch.expanded>.tree-view {
        max-height: 1000px!important
    }

    .tree-view .tree-branch.expanded>.tree-node .tree-node-icon {
        -webkit-transform: rotate(90deg);
        transform: rotate(90deg)
    }

    .tree-view {
        font-size: 14px
    }

    .tree-view .tree-branch .tree-view {
        max-height: 0;
        overflow: hidden;
        -webkit-transition: max-height .2s;
        transition: max-height .2s
    }

    .tree-view .tree-branch .tree-view:hover {
        overflow: visible
    }

    .tree-view .tree-branch .tree-node {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        overflow: hidden;
        margin: 4px 0;
        line-height: 1.4
    }

    .tree-view .tree-branch .tree-node .tree-node-label {
        padding: 1px 3px;
        border-radius: 2px;
        cursor: pointer
    }

    .tree-view .tree-branch .tree-node:hover {
        overflow: visible
    }

    .tree-view .tree-branch .tree-node:hover .tree-node-label {
        background: var(--primary);
        color: #fff
    }

    .tree-view .tree-branch .tree-node .tree-node-icon {
        cursor: pointer;
        width: 8px;
        height: 8px;
        -webkit-transition: -webkit-transform .2s;
        transition: -webkit-transform .2s;
        transition: transform .2s;
        transition: transform .2s,-webkit-transform .2s;
        -webkit-transform-origin: 2px 3px;
        transform-origin: 2px 3px;
        margin-left: 3px;
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
        border-left: 4px solid var(--primary)
    }

    .tree-view .tree-branch>.tree-view {
        margin-left: 22px
    }

    .tree-view .tree-branch.expanded> {
        border: 1px solid #d3d3d3;
        border-radius: 5px
    }

    .tree-view .tree-branch.expanded>.tree-view {
        max-height: 1000px!important
    }

    .tree-view .tree-branch.expanded>.tree-node .tree-node-icon {
        -webkit-transform: rotate(90deg);
        transform: rotate(90deg)
    }
</style>   
  <?php include __DIR__ . '/dyn_footer.php'; ?>

</div>

</body>
</html>
