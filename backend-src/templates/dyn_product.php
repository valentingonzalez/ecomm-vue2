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
    h1.product-title {
      font-size: 2rem;
    }
  </style>
  <!-- do not add spacing in the script tag -->
  <script>__EZ_START_HEAD = ''</script>
  <title></title>
  <script>__EZ_END_HEAD = ''</script>
</head>

<body>

  <div class="position-relative overflow-hidden">

    <?php include __DIR__ . '/dyn_header.php'; ?>
    <div class="product-details-box">
      <div class="container">
        <div id="productDetails" class="mb-4">
          <div class="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center mb-3">
            <ul class="breadcrumb__wrapper mb-0">
              <li>
                <a href="/" class="router-link-active" aria-label="Home"><svg width="18px" height="15px" viewBox="0 0 18 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="Artboard" transform="translate(-77.000000, -64.000000)" fill="#004955">
                        <path d="M86.0425152,67 L92.2323346,72.263 L92.2398489,72.29 L92.2398489,72.29 L92.243,72.329 L92.243,77.658 L92.2347469,77.770184 C92.212749,77.91572 92.1468173,78.045 92.0374484,78.157 L92.0374484,78.157 L91.9528774,78.233192 C91.835969,78.32356 91.7025543,78.369 91.5536263,78.369 L91.5536263,78.369 L87.4193234,78.369 L87.4193234,74.105 L84.6637678,74.105 L84.6637678,78.368 L80.5314041,78.368 L80.4222523,78.359592 C80.2808638,78.33716 80.1559815,78.2698 80.0466125,78.157 L80.0466125,78.157 L79.973312,78.069776 C79.8864373,77.9492 79.843,77.8116 79.843,77.658 L79.843,77.658 L79.843,72.329 L79.8439696,72.31475 L79.8439696,72.31475 L79.8478479,72.296 L79.8517262,72.2765 L79.8517262,72.2765 L79.8526958,72.263 L86.0425152,67 Z M86,64 L86.1602454,64.0081667 C86.4210556,64.0353889 86.6505,64.1306667 86.848,64.294 L86.848,64.294 L89.572,66.597 L89.572,64.395 L89.5783594,64.3196562 C89.5910625,64.24775 89.62275,64.18625 89.673,64.136 L89.673,64.136 L89.7266563,64.0915312 C89.78375,64.0535625 89.85125,64.035 89.93,64.035 L89.93,64.035 L92.074,64.035 L92.1485938,64.0412188 C92.21975,64.0536875 92.2805,64.085 92.33,64.136 L92.33,64.136 L92.3744688,64.1899687 C92.4124375,64.247625 92.431,64.31625 92.431,64.395 L92.431,64.395 L92.431,69.002 L94.876,71.057 L94.9253125,71.1063594 C94.9684375,71.159375 94.993,71.2235 94.999,71.3 L94.999,71.3 L94.998625,71.3734688 C94.991875,71.444625 94.966,71.50875 94.921,71.565 L94.921,71.565 L94.228,72.401 L94.1800469,72.4465313 C94.1284375,72.4873125 94.066,72.51375 93.994,72.525 L93.994,72.525 L93.96,72.525 L93.8912344,72.5201094 C93.82575,72.5103125 93.77025,72.48575 93.726,72.446 L93.726,72.446 L86,65.931 L78.274,72.446 L78.2070938,72.4847812 C78.1400625,72.5173125 78.07275,72.531 78.006,72.525 L78.006,72.525 L77.9368125,72.5087187 C77.8711875,72.4874375 77.81625,72.45125 77.772,72.401 L77.772,72.401 L77.08,71.565 L77.0409375,71.5061563 C77.0085,71.44475 76.99575,71.37575 77.001,71.3 L77.001,71.3 L77.0127656,71.2275781 C77.031,71.1591875 77.0685,71.10275 77.124,71.057 L77.124,71.057 L85.152,64.294 C85.39,64.098 85.673,64 86,64 L86,64 Z" id="breadcrumb-home"></path>
                      </g>
                    </g>
                  </svg>
                </a>
              </li>
              <?php if($product['categories'] && isset($product['categories'][$product['dept_id']])){ ?>
                <li><a href="<?= $product['categories'][$product['dept_id']]['target'] ?>" class=""><?= $product['categories'][$product['dept_id']]['title'] ?></a></li>
              <?php } ?>
              <?php if($product['categories'] && isset($product['categories'][$product['class_id']])){ ?>
                <li><a href="<?= $product['categories'][$product['class_id']]['target'] ?>" class=""><?= $product['categories'][$product['class_id']]['title'] ?></a></li>
              <?php } ?>
              <?php if($product['categories'] && isset($product['categories'][$product['fineline_id']])){ ?>
                <li><a href="<?= $product['categories'][$product['fineline_id']]['target'] ?>" class=""><?= $product['categories'][$product['fineline_id']]['title'] ?></a></li>
              <?php } ?>
              <li><span class="text-muted"><?= htmlspecialchars($product['title']) ?></span></li>
            </ul><!---->
          </div>
          <!-- product details intro start -->
          <div class="product-section px-md-3 py-md-4">
            <div class="row align-items-stretch">
              <div class="col-md-5 d-flex flex-column">
                <div class="product-view-box flex-grow-1">
                  <div class="d-none d-md-flex align-items-center" id="product-preview">
                    <div class="f-flex mh-100 container-zoomer-zoomer-box">
                      <div class="preview-box">
                      <?php                       
                        $size = DB::redis()->hget('ecom.productSizes', compressUrl($product['image_url'])); // app('redis_reserve') for laravel
                        if ( $size ) {
                            [$width, $height]  = explode(' ', $size);
                        }else{
                          [$width, $height]  = ["100%","100%"];
                        }                      
                      ?>
                        <img src="<?= $product['image_url'] ?>" width="<?= $width ?>" height="<?= $height ?>" alt="<?= htmlspecialchars($product['title']) ?>" class="responsive-image">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-7 d-flex flex-column">
                <h1 class="font-weight-bold my-2 mt-md-0 product-title"><?= $product['title'] ?></h1>
                <div id="product-preview-mobile" class="d-block d-md-none">
                  <img src="<?= $product['image_url'] ?>" alt="<?= htmlspecialchars($product['title']) ?>" class>
                </div>
                <div class="mt-n1 mb-2 text-muted">
                  <? if ($product['sku']) { ?>
                    <span class="mr-3">SKU <strong>#<?= $product['sku'] ?></strong></span>
                  <? } ?>
                  <? if ($product['model_number']) { ?>
                    <span class="mr-3">Model <strong>#<?= $product['model_number'] ?></strong></span>
                  <? } ?>
                  <? if ($product['upc']) { ?>
                    <span>UPC <strong>#<?= $product['upc'] ?></strong></span>
                  <? } ?>
                </div>

                <?php if ((!isset($settings['products']['hideReg']) || !$settings['products']['hideReg'])
                  && (!isset($settings['products']['hidePrice']) || !$settings['products']['hidePrice'])
                  && (!isset($product['settings']['hidePrice']) || !$product['settings']['hidePrice'])
                  && !$discontinued
                ) { ?>
                  <div class="price-and-promo">
                    <div class="prices d-flex">
                      <?php if (!empty($product['promo_price'])) { ?>
                        <div class="has-promo" style="color: rgb(129, 178, 20)">
                          <div class="label"> Sale! </div>
                          <div class="font-weight-bold mr-3 price">
                            <span> $<?= $product['promo_price'] ?> </span>
                            <span itemprop="price" class="mt-2 ml-2 font-weight-bold small"></span>
                          </div>
                        </div>
                      <?php } ?>
                      <div class="label flex-column" <?= (empty($product['promo_price']) ? 'style="color: rgb(129, 178, 20)"' : '') ?>>
                        <strong>REGULAR PRICE</strong>
                        <span class="font-weight-bold price <?= (!empty($product['promo_price']) ? 'line-through' : '') ?>">$<?= $product['price'] ?></span>
                      </div>
                    </div>
                  </div>
                <?php } ?>

                <?php if (!$discontinued) { ?>
                  <div class="pt-4 pb-3 border-top border-gray">
                    <div class="d-flex align-items-center">
                      <svg width="38" height="38" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" class="text-primary mr-3">
                        <g fill="currentColor" fill-rule="evenodd">
                          <path d="M49.025 49.18H.778A.773.773 0 010 48.412c0-.424.348-.769.778-.769h48.247c.43 0 .778.345.778.769a.773.773 0 01-.778.768z"></path>
                          <path d="M3.89 49.18a.773.773 0 01-.777-.768v-29.2c0-.425.348-.77.778-.77.43 0 .778.345.778.77v29.2a.773.773 0 01-.778.768zM45.912 49.18a.773.773 0 01-.778-.768v-29.2c0-.425.348-.77.778-.77.43 0 .778.345.778.77v29.2a.773.773 0 01-.778.768zM48.247 15.37a.778.778 0 01-.739-.526L43.017 1.537H6.787L2.294 14.844a.78.78 0 01-.985.485.766.766 0 01-.492-.972L5.488.525A.777.777 0 016.224 0h37.353c.335 0 .632.212.738.525l4.669 13.832a.766.766 0 01-.492.972.784.784 0 01-.246.04z"></path>
                          <path d="M15.563 10.758h-1.556a.773.773 0 01-.778-.768c0-.425.348-.769.778-.769h1.556a.774.774 0 00.779-.768.774.774 0 00-.779-.769c-1.287 0-2.334-1.034-2.334-2.305 0-1.271 1.047-2.305 2.334-2.305h1.557c.43 0 .778.344.778.768a.773.773 0 01-.778.769h-1.557a.774.774 0 00-.778.768c0 .424.35.769.778.769 1.288 0 2.335 1.034 2.335 2.305 0 1.271-1.047 2.305-2.335 2.305zM20.232 10.758a.773.773 0 01-.778-.768V3.842c0-.424.349-.768.778-.768.43 0 .779.344.779.768V9.99a.773.773 0 01-.779.768z"></path>
                          <path d="M23.345 7.684h-3.113a.773.773 0 01-.778-.768c0-.424.349-.768.778-.768h3.113c.43 0 .778.344.778.768a.773.773 0 01-.778.768z"></path>
                          <path d="M23.345 10.758a.773.773 0 01-.778-.768V3.842c0-.424.348-.768.778-.768.43 0 .778.344.778.768V9.99a.773.773 0 01-.778.768zM28.014 10.758c-1.287 0-2.334-1.034-2.334-2.305V5.379c0-1.271 1.047-2.305 2.334-2.305 1.287 0 2.335 1.034 2.335 2.305v3.074c0 1.271-1.048 2.305-2.335 2.305zm0-6.147a.774.774 0 00-.778.768v3.074c0 .423.35.768.778.768a.774.774 0 00.778-.768V5.379a.774.774 0 00-.778-.768zM32.683 10.758a.773.773 0 01-.778-.768V3.842c0-.424.348-.768.778-.768h1.556c1.288 0 2.335 1.034 2.335 2.305 0 1.271-1.047 2.305-2.335 2.305h-.778V9.99a.773.773 0 01-.778.768zm.778-4.61h.778a.774.774 0 00.779-.769.774.774 0 00-.779-.768h-.778v1.537zM3.89 19.98c-1.715 0-3.112-1.38-3.112-3.074V14.6c0-.424.349-.768.778-.768.43 0 .779.344.779.768v2.306c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"></path>
                          <path d="M8.56 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"></path>
                          <path d="M13.229 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"></path>
                          <path d="M17.898 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"></path>
                          <path d="M22.567 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"></path>
                          <path d="M27.236 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"></path>
                          <path d="M31.905 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"></path>
                          <path d="M36.574 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"></path>
                          <path d="M41.243 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.779-.768.43 0 .778.344.778.768v.769c0 1.695-1.397 3.074-3.113 3.074z"></path>
                          <path d="M45.912 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.779-.768.43 0 .778.344.778.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537V14.6c0-.424.349-.768.779-.768.43 0 .778.344.778.768v2.306c0 1.695-1.397 3.074-3.113 3.074zM47.725 13.832H2.078a.773.773 0 01-.779-.768c0-.425.349-.769.779-.769h45.647c.43 0 .778.344.778.769a.773.773 0 01-.778.768zM41.243 49.18H30.349a.773.773 0 01-.779-.768V29.969c0-.424.349-.768.779-.768h10.894c.43 0 .778.344.778.768v18.443a.773.773 0 01-.778.768zm-10.116-1.537h9.338V30.738h-9.338v16.905zM27.236 41.496H8.56a.773.773 0 01-.778-.769V29.97c0-.424.348-.768.778-.768h18.676c.43 0 .778.344.778.768v10.758a.773.773 0 01-.778.769zM9.338 39.959h17.12v-9.221H9.338v9.221z"></path>
                          <g>
                            <path d="M11.673 35.348a.78.78 0 01-.55-.225.761.761 0 010-1.086l1.556-1.537c.304-.3.796-.3 1.1 0 .304.3.304.786 0 1.086l-1.556 1.537a.78.78 0 01-.55.225z"></path>
                          </g>
                          <g>
                            <path d="M13.229 37.654a.78.78 0 01-.55-.225.761.761 0 010-1.087l3.112-3.074c.304-.3.797-.3 1.1 0 .305.3.305.787 0 1.087l-3.112 3.074a.78.78 0 01-.55.225z"></path>
                          </g>
                          <g>
                            <path d="M38.13 41.496a.824.824 0 01-.552-.223.802.802 0 01-.226-.546c0-.2.086-.4.226-.545.295-.285.817-.285 1.105 0 .14.146.225.345.225.545 0 .2-.085.4-.225.546a.825.825 0 01-.553.223z"></path>
                          </g>
                          <g>
                            <path d="M38.908 7.684a.824.824 0 01-.552-.222.802.802 0 01-.226-.546c0-.208.086-.4.226-.546.296-.284.817-.284 1.105 0 .14.146.226.346.226.546 0 .2-.086.4-.226.546a.825.825 0 01-.553.222z"></path>
                          </g>
                          <g>
                            <path d="M10.894 7.684a.788.788 0 01-.552-.222.802.802 0 01-.226-.546c0-.2.086-.4.226-.546.288-.284.817-.284 1.105 0a.79.79 0 01.226.546c0 .2-.086.4-.226.546a.825.825 0 01-.553.222z"></path>
                          </g>
                        </g>
                      </svg>
                      <div class="label">
                        <span class="text-success font-weight-bold">
                          <b><?= $product['num_inventory'] ?></b> IN STOCK
                        </span>,
                        <span class="font-weight-bold">AVAILABLE AT</span> </br>
                        <?= $settings['businessName'] ?>, <?= $business['business_address'] ?>, <?= $business['business_city'] ?>, <?= $business['business_state'] ?>
                      </div>
                    </div>
                    <span class="small">Purchase this product for local delivery or pickup</span>
                  </div>
                <?php } ?>

                <?php if ($discontinued) { ?>
                  <div class="stock-text">
                    <div class="mr-5 mb-2">This product has been discontinued</div>
                  </div>
                <?php } else { ?>
                  <div class="stock-text">
                    <div class="quantity">
                      <div>
                        <div class="add-remove">
                          <div class="change-quantity d-flex">
                            <button type="button" class="btn action-bt btn-primary" aria-label="Quantity Minus">-</button>
                            <input type="number" min="0" max="9999" aria-label="Number of quantity" maxlength="4" value="5" class="form-control bg-white mx-1 text-center font-weight-bold">
                            <button type="button" class="btn action-bt btn-primary" aria-label="Quantity Plus">+</button>
                            <button class="btn btn-primary add-cart ml-1" aria-label="Add to Cart"><i class="fa fa-shopping-cart fa-lg mr-2"></i> Add to cart</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="py-3 d-flex align-items-center">
                    <div>
                      <svg width="38" height="38" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" class="text-primary mr-3">
                        <g fill="currentColor" fill-rule="evenodd">
                          <path d="M49.025 49.18H.778A.773.773 0 010 48.412c0-.424.348-.769.778-.769h48.247c.43 0 .778.345.778.769a.773.773 0 01-.778.768z"></path>
                          <path d="M3.89 49.18a.773.773 0 01-.777-.768v-29.2c0-.425.348-.77.778-.77.43 0 .778.345.778.77v29.2a.773.773 0 01-.778.768zM45.912 49.18a.773.773 0 01-.778-.768v-29.2c0-.425.348-.77.778-.77.43 0 .778.345.778.77v29.2a.773.773 0 01-.778.768zM48.247 15.37a.778.778 0 01-.739-.526L43.017 1.537H6.787L2.294 14.844a.78.78 0 01-.985.485.766.766 0 01-.492-.972L5.488.525A.777.777 0 016.224 0h37.353c.335 0 .632.212.738.525l4.669 13.832a.766.766 0 01-.492.972.784.784 0 01-.246.04z"></path>
                          <path d="M15.563 10.758h-1.556a.773.773 0 01-.778-.768c0-.425.348-.769.778-.769h1.556a.774.774 0 00.779-.768.774.774 0 00-.779-.769c-1.287 0-2.334-1.034-2.334-2.305 0-1.271 1.047-2.305 2.334-2.305h1.557c.43 0 .778.344.778.768a.773.773 0 01-.778.769h-1.557a.774.774 0 00-.778.768c0 .424.35.769.778.769 1.288 0 2.335 1.034 2.335 2.305 0 1.271-1.047 2.305-2.335 2.305zM20.232 10.758a.773.773 0 01-.778-.768V3.842c0-.424.349-.768.778-.768.43 0 .779.344.779.768V9.99a.773.773 0 01-.779.768z"></path>
                          <path d="M23.345 7.684h-3.113a.773.773 0 01-.778-.768c0-.424.349-.768.778-.768h3.113c.43 0 .778.344.778.768a.773.773 0 01-.778.768z"></path>
                          <path d="M23.345 10.758a.773.773 0 01-.778-.768V3.842c0-.424.348-.768.778-.768.43 0 .778.344.778.768V9.99a.773.773 0 01-.778.768zM28.014 10.758c-1.287 0-2.334-1.034-2.334-2.305V5.379c0-1.271 1.047-2.305 2.334-2.305 1.287 0 2.335 1.034 2.335 2.305v3.074c0 1.271-1.048 2.305-2.335 2.305zm0-6.147a.774.774 0 00-.778.768v3.074c0 .423.35.768.778.768a.774.774 0 00.778-.768V5.379a.774.774 0 00-.778-.768zM32.683 10.758a.773.773 0 01-.778-.768V3.842c0-.424.348-.768.778-.768h1.556c1.288 0 2.335 1.034 2.335 2.305 0 1.271-1.047 2.305-2.335 2.305h-.778V9.99a.773.773 0 01-.778.768zm.778-4.61h.778a.774.774 0 00.779-.769.774.774 0 00-.779-.768h-.778v1.537zM3.89 19.98c-1.715 0-3.112-1.38-3.112-3.074V14.6c0-.424.349-.768.778-.768.43 0 .779.344.779.768v2.306c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"></path>
                          <path d="M8.56 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"></path>
                          <path d="M13.229 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"></path>
                          <path d="M17.898 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"></path>
                          <path d="M22.567 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"></path>
                          <path d="M27.236 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"></path>
                          <path d="M31.905 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"></path>
                          <path d="M36.574 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"></path>
                          <path d="M41.243 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.779-.768.43 0 .778.344.778.768v.769c0 1.695-1.397 3.074-3.113 3.074z"></path>
                          <path d="M45.912 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.779-.768.43 0 .778.344.778.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537V14.6c0-.424.349-.768.779-.768.43 0 .778.344.778.768v2.306c0 1.695-1.397 3.074-3.113 3.074zM47.725 13.832H2.078a.773.773 0 01-.779-.768c0-.425.349-.769.779-.769h45.647c.43 0 .778.344.778.769a.773.773 0 01-.778.768zM41.243 49.18H30.349a.773.773 0 01-.779-.768V29.969c0-.424.349-.768.779-.768h10.894c.43 0 .778.344.778.768v18.443a.773.773 0 01-.778.768zm-10.116-1.537h9.338V30.738h-9.338v16.905zM27.236 41.496H8.56a.773.773 0 01-.778-.769V29.97c0-.424.348-.768.778-.768h18.676c.43 0 .778.344.778.768v10.758a.773.773 0 01-.778.769zM9.338 39.959h17.12v-9.221H9.338v9.221z"></path>
                          <g>
                            <path d="M11.673 35.348a.78.78 0 01-.55-.225.761.761 0 010-1.086l1.556-1.537c.304-.3.796-.3 1.1 0 .304.3.304.786 0 1.086l-1.556 1.537a.78.78 0 01-.55.225z"></path>
                          </g>
                          <g>
                            <path d="M13.229 37.654a.78.78 0 01-.55-.225.761.761 0 010-1.087l3.112-3.074c.304-.3.797-.3 1.1 0 .305.3.305.787 0 1.087l-3.112 3.074a.78.78 0 01-.55.225z"></path>
                          </g>
                          <g>
                            <path d="M38.13 41.496a.824.824 0 01-.552-.223.802.802 0 01-.226-.546c0-.2.086-.4.226-.545.295-.285.817-.285 1.105 0 .14.146.225.345.225.545 0 .2-.085.4-.225.546a.825.825 0 01-.553.223z"></path>
                          </g>
                          <g>
                            <path d="M38.908 7.684a.824.824 0 01-.552-.222.802.802 0 01-.226-.546c0-.208.086-.4.226-.546.296-.284.817-.284 1.105 0 .14.146.226.346.226.546 0 .2-.086.4-.226.546a.825.825 0 01-.553.222z"></path>
                          </g>
                          <g>
                            <path d="M10.894 7.684a.788.788 0 01-.552-.222.802.802 0 01-.226-.546c0-.2.086-.4.226-.546.288-.284.817-.284 1.105 0a.79.79 0 01.226.546c0 .2-.086.4-.226.546a.825.825 0 01-.553.222z"></path>
                          </g>
                        </g>
                      </svg>
                    </div>
                    <div>
                      <div class="font-weight-bold">In-store Pickup</div>
                      <div>Pick up at <?= $settings['businessName'] ?>, <?= $business['business_zipcode'] ?></div>
                      <div class="text-small">
                        <?= $business['pickup_pdp_message'] ?>
                      </div>
                    </div>
                  </div>
                <?php } ?>
              </div>
            </div>
            <!-- product details intro end -->

            <!-- product details videos and description start -->
            <div class="row d-flex flex-column-reverse flex-lg-row align-items-stretch pt-4 mt-2">
              <!-- product details description start -->
              <div class="col-12">
                <div class="border-top border-gray pt-4 pb-4">
                  <strong class="h5 font-weight-bold">Description</strong>
                  <p><?= $product['description'] ?></p>
                </div>
              </div>
              <!-- product details description end -->

              <!-- product details videos start -->
              <?php if ($videos) { ?>
                <div class="col-12">
                  <section style="overflow-y: auto; overflow-x: hidden; padding-top: 1.5rem; border-top: 1px solid #dee2e6;">
                    <h2 style="font-weight: 700; font-size: 1.25rem; line-height: 1.2; margin: 0 0 0.5rem;">Videos</h2>
                    <div class="row">
                      <?php foreach ($videos as $video) { ?>
                        <div class="position-relative col-6 col-md-3">
                          <a href="#" style="text-decoration: none; display: block; margin-bottom: 32px">
                            <img src="<?= $video['thumbnail'] ?>" alt="&nbsp;" style="width: 100%; height: auto; object-fit: cover; vertical-align: top;">
                            <img src="/icons/play.png" alt="play button" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);">
                            <strong style="color: #2f3540; padding-top: 10px; display: block; font-size: 14px; font-weight: 700; line-height: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><?= $video['name'] ?></strong>
                          </a>
                        </div>
                      <?php } ?>
                    </div>
                  </section>
                </div>
              <?php } ?>
              <!-- product details videos end -->

            </div>
          </div>
          <!-- product details videos and description end -->
        </div>
        <!-- related items start -->
        <?php if ($similar) { ?>
          <section class="related-product mb-5">
            <h2 style="margin: 0 0 0.5rem; font-size: 1.5rem; font-weight: 500; line-height: 1.2;">Customers Also Purchased</h2>
            <div style="padding: 20px 0; position: relative; overflow: hidden;">
              <ul style="list-style: none; margin: 0; padding: 0; display: flex;">

                <?php foreach ($similar as $item) { ?>
                  <li style="margin-right: 20px; width: auto; height: 300px; flex-shrink: 0; position: relative; ">
                    <div style="height: 100%;">
                      <a href="<?= '/p/' . $item['slug'] ?>" style="width: 240px; height: 100%; border-radius: 13px; box-shadow: 0 14px 10px 0 rgba(34,44,73,.04); position: relative; flex-shrink: 0; background: #fff; display: flex; flex-direction: column; text-decoration: none;">
                        <div style="font-size: 14px; position: relative; height: 100%; display: flex; flex-direction: column; flex: 1 1 auto; min-height: 1px;">
                          <div style="display: flex; width: 100%; height: 100%; padding: 20px 10px; flex-direction: column; justify-content: space-between;">
                          <?php                       
                              [$width, $height]  = ["130","130"];
                            ?>
                            <img src="<?= $item['image'] ?: '/images/default-img.svg' ?>" alt="<?= $item['title'] ?>" width="<?= $width ?>" height="<?= $height ?>" style="display: block;max-height: 130px;margin: 0 auto;object-fit: contain;">
                            <h3 style="font-size: 1rem; line-height: 1.2; color: #2f3540; font-weight: 600; white-space: normal; text-transform: capitalize; height: 40px; margin: 0 0 30px; overflow: hidden; text-overflow: ellipsis;"><?= $item['title'] ?></h3>
                            <div style="position: absolute; left: 10px; right: 10px; line-height: 12px; bottom: 10px; display: flex; justify-content: space-between;">
                              <?php if ((!isset($settings['products']['hideReg']) || !$settings['products']['hideReg'])
                                && (!isset($settings['products']['hidePrice']) || !$settings['products']['hidePrice'])
                              ) { ?>
                                <div style="color: <?php echo $settings['colors']['primary'] ?>; font-size: 17px; font-weight: 600; font-style: normal; line-height: 20px; margin-bottom: -4px;">
                                  <span style="display: block; font-size: 80%;">reg.</span>
                                  $<?= $item['price'] ?>
                                </div>
                              <?php } ?>
                              <div style="max-width: 100px; text-align: right; margin-left: 1rem; display: flex; align-items: flex-end; justify-content: flex-end;">
                                <strong style="color: #dc3545; font-size: 80%; font-weight: 700;">Only <?= $item['inventory'] ?>
                                  Left</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </li>
                <?php } ?>

              </ul>
            </div>
          </section>
        <?php } ?>
        <!-- related items end -->
      </div>
    </div>

    <?php include __DIR__ . '/dyn_footer.php'; ?>

  </div>

</body>

</html>
