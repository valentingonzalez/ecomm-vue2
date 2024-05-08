<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1440">
  <link type="text/css" rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Google+Sans:400,500,700">
  <style>
      html {
          font-family: sans-serif;
          box-sizing: border-box;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
      }

      *, *:before, *:after {
          box-sizing: inherit;
      }

      body {
          margin: 0;
          font: 1rem/1.5 'Roboto', Arial, sans-serif;
          background-color: #f7f7f7;
          color: #212529;
          min-width: 1440px;
      }

      article, aside, details, figcaption, figure, footer, header, hgroup, main, menu, nav, section, summary {
          display: block;
      }

      a {
          background-color: transparent;
          color: <?php echo $settings['colors']['primary'] ?>;
          text-decoration: none;
      }

      a:hover {
          text-decoration: underline;
      }

      a:active,
      a:hover {
          outline: 0;
      }

      img {
          border: 0;
          max-width: 100%;
          height: auto;
          vertical-align: top;
      }

      svg:not(:root) {
          overflow: hidden;
      }

      form,
      fieldset {
          margin: 0;
          padding: 0;
          border-style: none;
      }

      input[type='text'],
      input[type='tel'],
      input[type='email'],
      input[type='search'],
      input[type='password'],
      input[type='url'],
      input[type='date'],
      textarea {
          -webkit-appearance: none;
      }

      button,
      input[type='button'],
      input[type='reset'],
      input[type='file'],
      input[type='submit'] {
          -webkit-appearance: none;
          -webkit-border-radius: 0;
          cursor: pointer;
      }

      .container {
          width: 1440px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 30px;
          padding-right: 30px;
      }

      .search-field:focus {
          border-color: <?= $settings['colors']['primary'] ?? '#fff' ?> !important;
          box-shadow: 0 0 0 0 <?= $settings['colors']['primary'] ?? '#fff' ?>  !important;
      }

      .disabled,
      :disabled {
          opacity: .6;
      }

      p {
          margin-top: 0;
          margin-bottom: 1rem;
      }

      .col-lg-12 {
          flex: 0 0 100%;
          max-width: 100%;
      }
      .w-100 {
          width: 100% !important;
      }
      .h-100 {
          height: 100% !important;
      }
      .p-0 {
          padding: 0 !important;
      }
      .small-gutters {
          margin-right: -4px !important;
          margin-left: -4px !important;
      }
      .row {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-wrap: wrap;
          flex-wrap: wrap;
          margin-right: -15px;
          margin-left: -15px;
      }
      .small-gutters > .col, .small-gutters > [class*="col-"] {
          padding-right: 4px !important;
          padding-left: 4px !important;
      }
      .mb-2, .my-2 {
          margin-bottom: .5rem !important;
      }

      .col-6 {
          position: relative;
          width: 100%;
          -ms-flex: 0 0 50%;
          flex: 0 0 50%;
          max-width: 50%;
      }

      @media (min-width: 768px) {
          .col-md-4 {
              -webkit-box-flex: 0;
              -ms-flex: 0 0 33.33333%;
              flex: 0 0 33.33333%;
              max-width: 33.33333%;
          }
      }

      @media (min-width: 1200px) {
          .col-xl-3 {
              -webkit-box-flex: 0;
              -ms-flex: 0 0 25%;
              flex: 0 0 25%;
              max-width: 25%;
          }
      }

      .product-item-wrapper .product-item {
          position: relative;
          width: auto;
          height: 100%;
          flex-shrink: 0;
          cursor: pointer;
      }
      a.product-item:hover {
          text-decoration: none;
      }
      .card {
          background: #fff;
          -webkit-box-shadow: 0 14px 10px 0 rgba(34,44,73,.05);
          box-shadow: 0 14px 10px 0 rgba(34,44,73,.05);
          border-radius: 13px;
          border: none;
          display: flex;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          flex-direction: column;
          min-width: 0;
          word-wrap: break-word;
      }
      .product-item-wrapper .product-item > .card-body {
          position: relative;
      }
      .card-primary .card-body {
          position: relative;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          padding: 20px 30px;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          -ms-flex-direction: column;
          flex-direction: column;
      }
      .product {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          width: 100%;
          height: 100%;
          padding: 20px 10px;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          -ms-flex-direction: column;
          flex-direction: column;
          -webkit-box-pack: justify;
          -ms-flex-pack: justify;
          justify-content: space-between;
      }
      .img-fluid, .img-thumbnail {
          max-width: 100%;
          height: auto;
      }
      .product img.product-image {
          display: block;
          max-height: 130px;
          margin: 0 auto 30px;
      }
      .product h6 {
          color: #2f3540;
          font-size: 1rem;
          font-weight: 600;
          white-space: normal;
          text-transform: capitalize;
          height: 40px;
          margin-bottom: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
      }
      .d-flex {
          display: -webkit-box !important;
          display: -ms-flexbox !important;
          display: flex !important;
      }
      .justify-content-between {
          -webkit-box-pack: justify !important;
          -ms-flex-pack: justify !important;
          justify-content: space-between !important;
      }
      .flex-sm-row {
          -webkit-box-orient: horizontal !important;
          -ms-flex-direction: row !important;
          flex-direction: row !important;
      }
      .flex-sm-column, .flex-sm-row {
          -webkit-box-direction: normal !important;
      }
      .product .info {
          position: absolute;
          left: 10px;
          right: 10px;
          line-height: 12px;
          bottom: 10px;
      }
      .product .info .standard-price {
          color: var(--primary);
          font-size: 17px;
          font-weight: 600;
          font-style: normal;
          line-height: 20px;
          margin-bottom: -4px;
      }
      .small, small {
          font-size: 80%;
          font-weight: 400;
      }
      .d-sm-block {
          display: block !important;
      }
      .font-weight-normal {
          font-weight: 400 !important;
      }
      .align-items-end {
          -webkit-box-align: end !important;
          -ms-flex-align: end !important;
          align-items: flex-end !important;
      }
      .justify-content-sm-end {
          -webkit-box-pack: end !important;
          -ms-flex-pack: end !important;
          justify-content: flex-end !important;
      }
      .ml-md-3, .mx-md-3 {
          margin-left: 1rem !important;
      }
      .text-sm-right {
          text-align: right !important;
      }
      .special-details {
          max-width: 100px;
      }
      .font-weight-bold {
          font-weight: 700 !important;
      }
      .text-muted {
          color: #6c757d !important;
      }
      .breadcrumb {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-wrap: wrap;
          flex-wrap: wrap;
          padding: .75rem 1rem;
          margin-bottom: 1rem;
          list-style: none;
          background-color: #e9ecef;
          border-radius: .25rem;
      }
      ol.breadcrumb .breadcrumb-item::after {
          content: "";
          display: inline-block;
          width: 0;
          height: 0;
          margin: 0 14px;
          border-left: 6px solid rgba(47,53,64,.5);
          border-bottom: 6px solid transparent;
          border-top: 6px solid transparent;
      }
      ol.breadcrumb .breadcrumb-item::before, ol.breadcrumb .breadcrumb-item:last-of-type::after {
          content: "" !important;
          display: none;
      }
      ol.breadcrumb {
          background-color: #fff;
          padding: 0;
      }
      ol.breadcrumb .breadcrumb-item {
          color: rgba(67,67,67,.3);
          padding: 0;
          font-size: 16px;
          line-height: 19px;
      }
      ol.breadcrumb .breadcrumb-item.active {
          color: #434343;
          white-space: nowrap;
          overflow: hidden;
          -webkit-box-flex: 1;
          -ms-flex: 1;
          flex: 1;
          text-overflow: ellipsis;
      }
      h1.brand-title {
          font-size: 1.5rem;
      }
      h4 {
          font-size: 1.5rem;
          margin-top: 0;
          margin-bottom: .5rem;
          line-height: 1.2;
      }
      .mr-4, .mx-4 {
          margin-right: 1.5rem !important;
      }
      .brand-logo-image {
          max-width: 165px;
          max-height: 50px;
      }
  </style>

  <script>__EZ_START_HEAD = ''</script>
  <title></title>
  <script>__EZ_END_HEAD = ''</script>
</head>
<body>

<div style="position: relative; width: 100%; overflow: hidden;">

  <?php include __DIR__ . '/dyn_header.php'; ?>

  <main style="padding-top: 30px; padding-bottom: 50px;">
    <!-- product details -->
    <div class="container search-container">

      <nav aria-label="breadcrumb">
        <ol class="breadcrumb category mb-4">
          <li class="breadcrumb-item">
            <a href="/brands" class="router-link-active">Brands</a>
          </li>
          <li class="breadcrumb-item active"><?= $brand['brand_name'] ?></li>
        </ol>
      </nav>

      <h1 class="brand-title"><?= $brand['brand_name'] ?></h1>

      <div class="d-flex mt-3">
        <div class="mr-4">
          <h4 class="font-weight-bold"><?= $brand['products_count'] ?></h4>
          <div class="text-muted">Products</div>
        </div>
        <div>
          <h4 class="font-weight-bold"><?= $brand['videos_count'] ?></h4>
          <div class="text-muted">Videos</div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <div class="w-100">
            <div class="search-product row small-gutters">
              <?php foreach ( $products as $product ) { ?>
                <div class="col-6 col-md-4 col-xl-3 mb-2">
                  <div class="product-item-wrapper h-100">
                    <a href="/p/<?= $product['slug'] ?>"
                       class="card card-primary product-item">
                      <div class="card-body p-0 h-100">
                        <div class="product">
                          <img src="<?= $product['image_url'] ?>"
                               alt="<?= htmlspecialchars($product['title']) ?>"
                               class="product-image img-fluid">
                          <h6><?= htmlspecialchars($product['title']) ?></h6>
                          <div class="d-flex flex-column flex-sm-row justify-content-between info">
                            <?php if ( (!isset($settings['products']['hideReg']) || !$settings['products']['hideReg'])
                                && (!isset($settings['products']['hidePrice']) || !$settings['products']['hidePrice']) ) { ?>
                            <div class="standard-price">
                              <div class="font-weight-normal small d-none d-sm-block">
                                reg.
                              </div>
                              $<?= $product['price'] ?>
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
                    </a>
                  </div>
                </div>
              <?php } ?>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <?php include __DIR__ . '/dyn_footer.php'; ?>

</div>

</body>
</html>
