<template>
  <div class="page-wrapper">
    <h1 class="page-title">The Best Gas Grill Store In Jackson, Brooklyn & Vandercook Lake</h1>
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
          :img-src="`images/info_pages/slider_${index + 1}.jpg`"
        ></b-carousel-slide>

      </b-carousel>
    </div>

    <div class="row mb-5">
      <div class="col-12">
        <div class="dealer-info">
          <h2 class="text-left">Don't Make A $500 Mistake..!!</h2>
          <p>One of our very knowledgeable customers purchased a grill based on reviews & online
            manufacturer brochures & ads. The grill manufacturer is an industry titan and he
            declined any help - he had done his homework - all of it - online. </p>
          <p>Without any in-store inspection or comparison to other grills it was no surprise he was
            seriously disappointed with his purchase. </p>
          <p>When I witnessed this "buyer's remorse", it became a passion of mine to make sure grill
            buyers received the knowledge they needed to purchase the best gas grill for your
              family. Download this guide & checklist & compare - everywhere - go to our
              store, our competitors and take this checklist to compare & find the best grill for
              you!</p>
          <h3>Download For Free, Compare & Buy with Confidence...!!!</h3>
        </div>
      </div>
    </div>

    <div class="service-main mb-5">
      <div class="row">
        <div class="col-md-6">
          <div class="service-image">
            <img src="images/info_pages/grill_buying.png"/>
          </div>
        </div>
        <div class="col-md-6">
          <div class="service-description">
            <h3>2019 Grill Buying Guide & Checklist</h3>
            <p>Get these FREE benefits</p>
            <ul>
              <li><a>Learn & Compare the 5 key features of any gas grill</a></li>
              <li><a>Recipes, coupons, deals & more</a></li>
              <li><a>REE checklist to find your perfect grill</a></li>
            </ul>
            <a class="btn btn-download"
              href="https://www.doitbest.com/media/W1siZiIsIjIwMTkvMDQvMTIvMTAvNTMvMTIvNzJhMTgwODEtZDQyMS00NmY5LWJkNzgtNzVmYjU1N2RmMzZjL0dyaWxsaW5nIEJ1eWluZyBHdWlkZS5wZGYiXV0/Grilling%20Buying%20Guide.pdf?sha=2eb258b927d9ed47"
              target="_blank">Download Now</a>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-4">
        <div class="banner-wrapper">
          <div class="banner-image">
            <img src="images/info_pages/broil_grill.png"/>
          </div>
          <div class="banner-info">
            <h2>Broil King Gas Grills</h2>
            <p>Built For Searious Grilling<br>Built For Great Flavor<br>The Best Grill You've Never
              Heard Of</p>
            <router-link to="/info/welcome-to-broil-king">Welcome To Broil King >></router-link>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="banner-wrapper">
          <div class="banner-image">
            <img src="images/info_pages/weber_grill.png"/>
          </div>
          <div class="banner-info">
            <h2>Weber Grills</h2>
            <p>Over 65 yrs of Great Grilling<br>GS4 Revolutionary Burner System<br>10 yr Warranty
              Piece Of Mind<br></p>
            <router-link to="/info/weber-grills-buying-guide">Weber Grill Buying Guide >></router-link>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="banner-wrapper border-0">
          <div class="banner-image">
            <img src="images/info_pages/accesories_grill.png"/>
          </div>
          <div class="banner-info">
            <h2>Grill Accessories</h2>
            <p>Turners & Tongs<br>Woks, Racks & Cookers<br>Injectors & Thermometers</p>
            <router-link to="/info/grill_accessories">Accessorize Your Grill >></router-link>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'GrillsForSale',
    data() {
      return {
        slide: 0,
        sliding: null
      };
    },
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

    .dealer-info {
      h2 {
        display: block;
        margin: 0 0 15px;
        ffont-size: 24px;
        line-height: 28px;
        font-weight: bold;
        color: #000000;
      }
      h3 {
        display: block;
        margin: 0 0 15px;
        font-size: 18px;
        font-weight: bold;
        line-height: 21px;
        color: #000000;
      }
      p {
        margin: 0 0 15px;
        font-size: 16px;
        line-height: 26px;
        color: #6C7173;
      }
    }
    .service-main {
      background: #ffffff;
      padding: 30px;
      @media (max-width: 543px) {
        padding: 15px;
      }
    }
    .service-description {
      text-align: left;
      @media (max-width: 767px) {
        margin-top: 20px;
      }
      h3 {
        display: block;
        margin: 0 0 15px;
        font-weight: bold;
        font-size: 18px;
        line-height: 21px;
        color: #000000;
      }

      p {
        margin: 0 0 15px;
        color: #6C7173;
        font-size: 16px;
        line-height: 26px;
      }

      ul {
        margin: 0 0 15px 20px;
        padding: 0;
        li {
          > a {
            font-size: 16px;
            line-height: 36px;
            font-weight: bold;
          }
        }
      }
      ul, a {
        color: #088ACE;
        font-weight: bold;
      }
      .btn-download {
        background: #DB0900;
        color: #ffffff;
        height: 40px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 5px 25px;
        font-weight: bold;
        font-size: 16px;
      }
    }

    .banner-wrapper {
      .banner-image {
        text-align: center;
        margin-bottom: 20px;
        img {
          width: 100%;
        }
      }

      .banner-info {
        margin: 10px 0 20px;
        overflow: hidden;

        h2 {
          margin-bottom: 10px;
          font-weight: 600;
          font-size: 24px;
          line-height: 28px;
          color: #000000;
        }

        p {
          font-size: 16px;
          line-height: 26px;
          margin: 0 0 15px;
          color: #6C7173;
        }

        a {
          font-size: 14px;
          line-height: 16px;
          color: #088ACE;
          font-weight: bold;
        }
      }
    }

  }
</style>
