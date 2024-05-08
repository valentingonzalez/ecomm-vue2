<?php if ($settings['homeAlert']['visible'] ?? false) { ?>
  <div class="alert border-0 rounded-0 py-2 text-center mb-0"
       role="alert"
       style="text-align: center; padding: 8px 20px;
           color: <?php echo $settings['homeAlert']['textColor'] ?>;
           font-size: <?php echo $settings['homeAlert']['fontSize'] ?? 13 ?>px;
           font-weight: <?php echo $settings['homeAlert']['fontWeight'] ?? 400 ?>;
           background-color: <?php echo $settings['colors'][$settings['homeAlert']['background']] ?>">
      <?php echo $settings['homeAlert']['text'] ?>
  </div>
<?php } ?>

<?php

$logoStyle = function($settings) {
  $css = '';
  if ( $settings['logoMaxWidth'] ) {
    $css .= 'max-width:' . $settings['logoMaxWidth'] . ' !important;';
  }
  if ( $settings['logoMaxHeight'] ) {
    $css .= 'max-height:' . $settings['logoMaxHeight'] . ' !important;';
  }
  return $css;
};

?>

<!-- page header start -->
<div class="sticky-top">
  <input type="checkbox" id="burger-menu">
  <header class="main-header flex-column" id="main-header">
    <!-- page header top start -->
    <div class="container justify-content-between">
      <label for="burger-menu" class="d-block nav-icon d-lg-none"><span></span></label>
      <a href="/" class="brand text-white">        
        <?php if ( $settings['logo'] ) { ?>
        <img class="brand-logo-image mr-md-3" width="100%" height="100%"
            src="<?php echo $settings['logo'] ?>"
            alt="<?php echo $settings['businessName'] ?>"
            style="<?php $logoStyle($settings) ?>">
        <?php } else { ?>
        <span class="text-logo"><?php echo $settings['businessName'] ?></span>
        <?php } ?>
      </a>
      <div class="break md-none"></div>
      <div class="search-wrapper flex-grow-1 justify-content-center d-flex">
        <div class="search d-flex">
          <form action="#">
            <div class="search-bar" id="search-header-autosuggest">
              <div role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-owns="autosuggest-autosuggest__results">
                <input class="form-control" type="search" name="search" placeholder="Enter what you're looking for">                
              </div>
            </div>
            <button type="submit" class="btn-search-custom" aria-label="Search">
              <svg style="stroke: <?php echo $settings['colors']['primary'] ?? '#fff' ?>"
                  width="16" height="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <defs>
                  <filter x="-8.1%" y="-113.8%" width="116.2%" height="327.5%" filterUnits="objectBoundingBox" id="a">
                    <feMorphology radius=".5" operator="dilate" in="SourceAlpha"
                                  result="shadowSpreadOuter1"></feMorphology>
                    <feOffset in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset>
                    <feGaussianBlur stdDeviation="15" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                    <feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out"
                                result="shadowBlurOuter1"></feComposite>
                    <feColorMatrix values="0 0 0 0 0.13236882 0 0 0 0 0.171002098 0 0 0 0 0.285297781 0 0 0 0.04 0"
                                  in="shadowBlurOuter1"></feColorMatrix>
                  </filter>
                  <rect id="b" x="0" y="0" width="560" height="40" rx="20"></rect>
                </defs>
                <g fill="none" fill-rule="evenodd">
                  <path fill="#fff" d="M-884-28H556v1536H-884z"></path>
                  <g transform="translate(-529 -11)">
                    <use fill="#000" filter="url(#a)" xlink:href="#b"></use>
                    <use stroke="<?php echo $settings['colors']['primary'] ?? '#fff' ?>"
                        fill="#fff" xlink:href="#b"></use>
                  </g>
                  <g stroke-width="2" transform="translate(1 1)"
                    stroke="<?php echo $settings['colors']['primary'] ?? '#fff' ?>"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <circle cx="6" cy="6" r="6"></circle>
                    <path d="M14 14l-3.758-3.758"></path>
                  </g>
                </g>
              </svg>
            </button>
          </form>
        </div>
      </div>

      <div class="d-lg-flex d-none" id="authorization">
        <div class="d-flex flex-lg-row align-items-center mx-4">
          <a href="/login" class="text-uppercase font-weight-bold" style="color: <?php echo $settings['colors']['primary'] ?>;">Sign In</a>
          <em class="my-n1 my-lg-0 mx-2">or</em>
          <a href="/register" class="text-uppercase font-weight-bold" style="color: <?php echo $settings['colors']['primary'] ?>">Sign Up</a>
        </div>
      </div>

      <?php if ( !$settings['products']['disableOrdering'] ) { ?>
      <a href="/cart" style="color: <?php echo $settings['colors']['primary'] ?>;" class="cart-btn">
        <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(1 1)" fill="none" fill-rule="evenodd">
            <circle fill="#000" fill-rule="nonzero" cx="4.235" cy="17.788" r="1"></circle>
            <circle fill="#000" fill-rule="nonzero" cx="16.094" cy="17.788" r="1"></circle>
            <circle stroke="<?php echo $settings['colors']['primary'] ?>" stroke-width="1.694" stroke-linecap="round" stroke-linejoin="round" cx="4" cy="17"
                    r="1"></circle>
            <circle stroke="<?php echo $settings['colors']['primary'] ?>" stroke-width="1.694" stroke-linecap="round" stroke-linejoin="round" cx="16" cy="17"
                    r="1"></circle>
            <path d="M0 0h2.571v11.25c0 .966.768 1.75 1.715 1.75H18" stroke="<?php echo $settings['colors']['primary'] ?>" stroke-width="1.694"
                  stroke-linecap="round" stroke-linejoin="round"></path>
            <path stroke="<?php echo $settings['colors']['primary'] ?>" stroke-width="1.694" stroke-linecap="round" stroke-linejoin="round"
                  d="M3 3h14l-1.647 7H3"></path>
          </g>
        </svg>
        <span class="cart-badge badge badge-pill badge-danger">0</span>
      </a>
      <?php } ?>

    </div>
    <!-- page header top end -->

    
  </header>
  <!-- main navigation start -->
  <nav id="mainNav" style="color: <?php echo $settings['colors']['primary'] ?>;" class="navbar p-0 navbar-light collapsed">
    <div class="container flex-column flex-lg-row justify-content-between">
      <ul class="navbar-nav flex-column flex-lg-row">
        <li class="nav-item left">
          <a class="nav-link" href="/" style="color: <?php echo $settings['colors']['primary'] ?>;">Home</a>
        </li>
        <li class="nav-item left">
          <a class="nav-link" href="/departments" style="color:<?php echo $settings['colors']['primary'] ?>;">Departments</a>
        </li>
        <li class="nav-item left">
          <a class="nav-link" href="/brands" style="color: <?php echo $settings['colors']['primary'] ?>;">Brands</a>
        </li>
        <li class="nav-item left">
          <a class="nav-link" href="/store-info" style="color: <?php echo $settings['colors']['primary'] ?>;">About Us</a>
        </li>
      </ul>
    </div>
  </nav>
  <!-- main navigation end -->
</div>
<!-- page header end -->