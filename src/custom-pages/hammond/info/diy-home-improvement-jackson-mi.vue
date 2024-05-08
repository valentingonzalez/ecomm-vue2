<template>
  <div class="page-wrapper">
    <h1 class="page-title">Jackson Homeowner DIY Articles, Pinterest Projects & Buying Guides</h1>
    <div class="mb-4">
      <iframe frameborder="0" allowfullscreen="1" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" title="YouTube video player" width="100%" height="360" src="https://www.youtube.com/embed/HGejpuzxeqM?enablejsapi=1&amp;origin=http%3A%2F%2Flocalhost%3A8080&amp;widgetid=1" id="widget2"></iframe>
    </div>

    <div class="banner-main mb-5">
      <div class="row">
          <div class="col-xs-12 col-lg-4">
            <div class="banner-wrapper">
              <div class="banner-image">
                <img src="images/info_pages/repair-expert.png"/>
              </div>
              <div class="banner-info">
                <h3>Expert Service</h3>
                <p>Five Ways We Solve Problems</p>
                <a href="#">Watch How</a>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-lg-4 cursor-pointer">
            <div class="banner-wrapper banner-two">
              <div class="banner-image">
                <img src="images/info_pages/rent-sign.png"/>
              </div>
              <div class="banner-info">
                <h3>Rental Center</h3>
                <p>From Rug Cleaners to Drain Snakes</p>
                <a target="_blank">See Rental List</a>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-lg-4">
        <div class="banner-wrapper border-0 mb-sm-0">
          <div class="banner-image">
            <img src="images/info_pages/list.png"/>
          </div>
          <div class="banner-info">
            <h3>Get More Help</h3>
            <p>DIY Articles, Pinterest Projects & More</p>
            <router-link to="/info/get-the-secret">Check It Out</router-link>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DIY home improvements jackson mi'
  };
</script>

<style lang="scss" scoped>
  .page-wrapper {
    img {
      max-width: 100%;
    }
    .notes {
      color: #DB0900;
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

    .content-block {
      h2 {
        display: block;
        margin: 0 0 15px;
        font-weight: bold;
        font-size: 24px;
        line-height: 28px;
        color: #000000;
      }

      h3 {
        display: block;
        margin: 0 0 15px;
        font-weight: 500;
        font-size: 18px;
        line-height: 21px;
        color: #6C7173;
      }

      p {
        color: #6C7173;
        font-size: 16px;
        line-height: 26px;
      }

      ol {
        margin: 0 0 15px 20px;
        padding: 0;

        li {
          margin: 0;
        }
      }
    }

    .solutions-main {
      .solutions-block {
        @media (min-width: 992px) {
          flex: 0 0 20%;
          max-width: 20%;
        }
        display: flex;
        justify-content: flex-start;
        flex-flow: row wrap;
        .solutions-wrapper {
          background: #ffffff;
          border-radius: 10px;
          padding: 20px;
          @media (max-width: 991px) {
            width: 100%;
            margin-bottom: 15px;
            padding: 15px;
          }
          .solutions-info {
            span {
              font-size: 14px;
              line-height: 26px;
              color: #000000;
              font-weight: bold;
            }
            p {
              font-size: 14px;
              line-height: 24px;
              color: #6C7173;
              margin: 5px 0 0;
            }
          }
        }
      }
    }
    .service-description {
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
    }
  }

</style>
