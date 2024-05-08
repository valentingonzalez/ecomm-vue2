<template>
  <div class="page-wrapper">
    <h1 class="page-title">6 Ways We Help Jackson, MI Homeowners & Landlords</h1>
    <div class="carousel-container mb-5">
      <b-carousel
        id="carousel-1"
        v-model="slide"
        :interval="4000"
        controls
      >
        <!-- Text slides with image -->
        <b-carousel-slide
          v-for="index of 7"
          :key="index"
          :img-src="`images/info_pages/services_${index}.jpg`"
        ></b-carousel-slide>

      </b-carousel>
    </div>

    <div class="row mb-4">
      <div class="col-12">
        <div class="dealer-info">
          <h3>Six Ways We Help Homeowners</h3>
          <p><strong>Frustration!</strong> That's the only word that describes those jobs around the house! Waiting around for someone to quote, making appointments and waiting some more for the work to be done.</p>

          <p>Why not make it easier by letting us do the work? Experienced pros offering “While-U-Wait” services or drop it off and pick it up done a few days later. <strong>We know your time is precious, let us help and FOR LESS than contractors or handymen!</strong></p>
        </div>
      </div>
    </div>

    <div class="row mb-5">
      <div class="col-xs-12 col-lg-6">
        <div class="service-description">
          <h3>Homeowner Services & Benefits</h3>
          <ul>
            <li><strong>Key Cutting</strong> – Home, Auto & Padlock keys cut "While-U-Wait"</li>
            <li><strong>Window & Screen Repair</strong> – Expert Service, Quick Turnaround</li>
            <li><strong>Glass & Plexiglas</strong> – Standard & Custom Sizes Cut "While-U-Wait"</li>
            <li><strong>Chain & Blade Sharpening</strong> – Make Old Blades New...For Pennies</li>
            <li><strong>Custom Paint Matching</strong> – Find The Perfect Color? We Can Make It!</li>
            <li><strong>Small Engine Repair</strong> – Power Equipment Parts & Service</li>
          </ul>
        </div>
      </div>
      <div class="col-xs-12 col-lg-6">
        <div class="service-image">
          <img class="float-right" src="images/info_pages/precious_time.jpg"/>
        </div>
      </div>
    </div>

    <div class="banner-main mb-5">
      <div class="row">
          <div class="col-xs-12 col-lg-4">
            <div class="banner-wrapper">
              <div class="banner-image">
                <img src="images/info_pages/key-with-a-house-shape-hanging.png"/>
              </div>
              <div class="banner-info">
                <h3>Need A Key?</h3>
                <p>House Key Buy 1, Get 1 Free Special</p>
                <a href="#">Get Offer</a>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-lg-4">
            <div class="banner-wrapper banner-two">
              <div class="banner-image">
                <img src="images/info_pages/rent-sign.png"/>
              </div>
              <div class="banner-info">
                <h3>Rentals</h3>
                <p>From Rug Cleaners to Drain Snakes.</p>
                <a target="_blank" href="https://www.hammondhardware.com/pages/small-engine-repair-jackson-mi">See Rental List </a>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-lg-4">
        <div class="banner-wrapper border-0 mb-sm-0">
          <div class="banner-image">
            <img src="images/info_pages/screwdriver.png"/>
          </div>
          <div class="banner-info">
            <h3>Service Dept</h3>
            <p>Small Engine Repair Parts & Service</p>
            <router-link to="/info/get-the-secret">Watch Them In Action </router-link>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'WeberGrillsBuyingGuide'
  };
</script>

<style scoped lang="scss">
  .page-wrapper {
    img {
      max-width: 100%;
    }
    .page-title {
      display: block;
      margin: 0 0 15px;
      font-weight: bold;
      font-size: 24px;
      line-height: 28px;
      color: #000000;
    }

    .responsive-frame {
      position: relative;
    }
    .banner-main {
      background-color: #ffffff;
      border-radius: 10px;
      padding: 40px;
      @media (max-width: 767px) {
        padding: 15px;
      }
    }
    .banner-wrapper {
      display: inline-flex;
      align-items: center;
      padding-right: 15px;
      border-right: 1px solid #F2F2F2;
      @media (max-width: 991px) {
        border-right:0;
        width: 100%;
        padding: 0;
        margin-bottom: 20px;
        &.banner-two {
          border-top:1px solid #F2F2F2;
          border-bottom: 1px solid #F2F2F2;
          padding: 20px 0;
        }
      }
      .banner-image {
        margin-right: 20px;
        img {
         max-height: 100px;
        }
      }

      .banner-info {
        flex: 1;
        text-align: left;
        padding-right: 10px;

        h3 {
          font-weight: 500;
          font-size: 24px;
          line-height: 28px;
          color: #000000;
          margin-bottom: 5px;
        }

        p {
          margin: 10px 0 0;
          font-size: 16px;
          line-height: 26px;
          color: #6C7173;
        }

        a {
          display: block;
          margin-top: 10px;
          font-size: 14px;
          font-weight: bold;
          color: #088ACE;
        }

      }
    }

    .service-title {
      font-weight: bold;
      font-size: 24px;
      line-height: 28px;
      color: #000000;
      margin-bottom: 50px;
    }
    .service-description {
      display: flex;
      flex-flow: column nowrap;
      height: 100%;
      justify-content: center;
      align-items: flex-start;
      h2 {
        font-weight: bold;
        font-size: 24px;
        line-height: 28px;
        color: #000000;
        margin-bottom: 10px;
      }

      h3 {
        display: block;
        margin: 0 0 15px;
        font-weight: 600;
        font-size: 18px;
        line-height: 21px;
        color: #000000;
      }

      p {
        margin: 0 0 15px;
        color: #6C7173;
        font-size: 16px;
        line-height: 26px;
        font-weight: normal;
      }
      .service-text {
        color: #6C7173;
        font-size: 18px;
        line-height: 26px;
        font-weight: 500;
      }
      ul {
        margin: 0 0 15px 20px;
        padding: 0;
        li {
          font-weight: normal;
          font-size: 16px;
          line-height: 26px;
          color: #6C7173;
          margin-bottom: 10px;
        }
      }
    }

    .product-item {
      display: flex;
      flex-flow: row wrap;
      flex:0 0 100%;
      max-width: 100%;
      .product-block {
        margin-bottom: 30px;
        .product-wrapper {
          background: #ffffff;
          padding: 30px;
          overflow: hidden;
          .product-description {
            text-align: left;
            padding-top: 10px;
            .product-title {
              font-weight: 600;
              font-size: 18px;
              line-height: 26px;
              color: #000000;
            }
            .product-text {
              font-size: 16px;
              line-height: 26px;
              color: #6C7173;
              margin: 8px 0 0;
            }
            .product-price {
              font-weight: bold;
              font-size: 24px;
              line-height: 28px;
              color: #DB0900;
              margin-top: 10px;
            }
          }
        }
      }
    }

  }
  .swiper-slide {
    width: auto;
    height: 340px;
    > .discounted-item {
      margin: 0 !important;
    }
  }
  .swiper-button-disabled {
    opacity: 0;
  }
  @media (max-width: 766px) {
    .products-slider.swiper-container {
      margin: 0 !important;
    }
  }
  @media (max-width: 480px) {
    .swiper-wrapper {
      .swiper-slide {
        width: 100% !important;
        > .card {
          width: 100% !important;
          max-width: 230px;
          margin: 0 auto !important;
        }
      }
    }

    .swiper-button-next {
      right: 0;
    }
    .swiper-button-prev {
      left: 0;
    }
  }
</style>
