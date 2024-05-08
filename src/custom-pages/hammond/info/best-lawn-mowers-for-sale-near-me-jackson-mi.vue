<template>
  <div class="page-wrapper">
    <h1 class="page-title">Best Lawn Mowers For Sale in Jackson MI</h1>
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
          :img-src="`images/info_pages/lawn_mowers_${index}.jpg`"
        ></b-carousel-slide>

      </b-carousel>
    </div>


    <div class="banner-main mb-5">
      <div class="row">
        <div @click="sureCanRedirection" class="col-xs-12 col-lg-4 cursor-pointer">
          <div class="banner-wrapper">
            <div class="banner-image">
              <img src="images/info_pages/jerrycan_echo.png"/>
            </div>
            <div class="banner-info">
              <h3>Want Easier Fueling Too?</h3>
              <p>See how this Gas Can makes fueling safer</p>
              <a>Join The Revolution</a>
            </div>
          </div>
        </div>
        <div @click="heroesRedirection" class="col-xs-12 col-lg-4 cursor-pointer">
          <div class="banner-wrapper banner-two">
            <div class="banner-image">
              <img src="images/info_pages/businessman_echo.png"/>
            </div>
            <div class="banner-info">
              <h3>Want Piece Of Mind?</h3>
              <p>See How Factory Service Matters</p>
              <a>Heroes In Action</a>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-lg-4">
          <div class="banner-wrapper border-0 mb-sm-0">
            <div class="banner-image">
              <img src="images/info_pages/fuel_station_echo.png"/>
            </div>
            <div class="banner-info">
              <h3>The Secret Sauce?</h3>
              <p>How To Perform Better & Last Longer</p>
              <router-link to="/info/get-the-secret">Get The Secret</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-5">
      <div class="col-xs-12 col-lg-6">
        <div class="service-description">
          <h3>Get The Cutting Edge From Jackson County's Authorized Toro Dealer</h3>
          <p>Toro Lawn Mowers are always on the cutting edge of mowing technology. Toro offers these features found on NO other mower manufacturers:</p>
          <ul>
            <li>Iso-Flex Handle to Reduce Vibrations</li>
            <li>Bag On Demand Switch System</li>
            <li>Power Reverse</li>
            <li>Smart Stow</li>
            <li>Personal Pace w/ Traction Assist</li>
          </ul>
          <p>In Addition, when you buy your Toro Lawn Mower from Hammond Hardware you get factory trained & certified staff, genuine Toro parts & preferred warranty & service attention. This added benefit makes buying a Toro Lawn Mower from Hammond Hardware in Jackson, MI - simply the best value for your buying dollar!</p>
        </div>
      </div>
      <div class="col-xs-12 col-lg-6">
        <div class="service-image">
          <img class="float-right" src="images/info_pages/toro_mowers.png"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'WeberGrillsBuyingGuide',
    methods: {
      heroesRedirection() {
        this.$router.push("/info/small-engine-repair");
      },
      sureCanRedirection() {
        this.$router.push("/info/sure-can");
      }
    }
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
