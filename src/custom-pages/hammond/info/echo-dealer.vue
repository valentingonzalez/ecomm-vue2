<template>
  <div class="page-wrapper">
    <h1 class="page-title">Limited Mobility Shopping</h1>
    <div class="responsive-frame mb-4">
      <img style="width: 100% !important;" src="images/info_pages/disbaility_connections_header.png"/>
    </div>

    <div class="row mb-5">
      <div class="col-xs-12 col-lg-8">
        <div class="service-description">
          <p>Hammond Hardware is Approved For Shopping With Limited Mobility</p>
          <p>We offer our these benefits for our customers</p>
          <ul>
            <li>Handicap Parking with Wide Entrance Doors</li>
            <li>Effective Circulation & Wide Aisles</li>
            <li>Wheel Chair Accessible Restrooms</li>
            <li>Assisted Shopping & Loading</li>
          </ul>
          <p>We are committed to our Veterans & Seniors and offer a 10% discount with Best Rewards!</p>
          <p>Click The Icon to see the result of our hard work to make a great shopping experience for ALL customers!</p>
        </div>
      </div>
      <div class="col-xs-12 col-lg-4 mb-sm-4">
        <div class="responsive-frame mb-4">
          <img src="images/info_pages/Handicap-badge.jpg"/>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
    export default {
        name: 'Disability Survey'
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
        margin: 0;
        font-weight: 600;
        font-size: 18px;
        line-height: 21px;
        color: #6C7173;
      }

      p {
        color: #6C7173;
        font-size: 16px;
        line-height: 26px;
      }
    }

    .serving-section {
      display: flex;
      justify-content: flex-start;
      flex-flow: column nowrap;
      h2 {
        display: block;
        margin: 0 0 15px;
        font-weight: bold;
        font-size: 24px;
        line-height: 28px;
        color: #000000;
      }

      > p {
        color: #6C7173;
        font-weight: normal;
        font-size: 16px;
        line-height: 26px;
      }
      .config-wrapper {
        ul {
          padding-left: 0;
          display: flex;
          margin: 0;
          @media (max-width: 991px) {
            flex-flow: wrap;
          }
          li {
            list-style: none;
            background: #ffffff;
            height: 50px;
            border-radius: 25px;
            padding: 0 20px;
            margin-right: 15px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            &:last-child {
              margin-right: 0;
            }
            @media (max-width: 991px) {
              margin-bottom: 10px;
            }
            @media (max-width: 767px) {
              line-height: normal;
              align-items: center;
              display: flex;
              padding: 8px 15px;
            }
            @media (max-width: 480px) {
              width: 100%;
              margin-right: 0;
              justify-content: center;
              &:last-child {
                margin-bottom: 0;
              }
            }
            a {
              font-weight: 500;
              font-size: 18px;
              line-height: 21px;
              text-align: center;
              color: #000000;
              text-decoration: none;
              @media (max-width: 767px) {
                font-size: 14px;
                line-height: normal;
              }
            }
          }
        }
        h5 {
          font-size: 18px;
          line-height: 26px;
          text-align: center;
          color: #6C7173;
        }
      }
    }

    .banner-main {
      background-color: #ffffff;
      border-radius: 10px;
      padding: 55px 40px;
      @media (max-width: 767px) {
        padding: 15px;
      }
    }
    .banner-wrapper {
      display: inline-flex;
      align-items: center;
      border-right: 1px solid #F2F2F2;
      @media (max-width: 991px) {
        border-bottom: 1px solid #F2F2F2;
        border-right: 0;
        padding-bottom: 15px;
        margin-bottom: 15px;
        &.banner-two {
          padding: 0;
          margin: 0;
        }
      }
      @media (max-width: 543px) {
        flex-direction: column;
      }
      .banner-image {
        margin-right: 25px;
        @media (max-width: 543px) {
          margin-right: 0;
          margin-bottom: 20px;
        }
        img {
          max-height: 100px;
        }
      }

      .banner-info {
        flex: 1;
        text-align: left;
        padding-right: 35px;
        @media (max-width: 543px) {
          text-align: center;
          padding: 0;
        }
        h3 {
          font-weight: 600;
          font-size: 24px;
          line-height: 28px;
          color: #000000;
          margin-bottom: 4px;
        }

        p {
          margin: 0;
          font-size: 16px;
          line-height: 26px;
          color: #6C7173;
        }

      }
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
        font-weight: normal;
      }
      .service-text {
        color: #6C7173;
        font-size: 18px;
        line-height: 26px;
        font-weight: 500;
      }
      ul {
        &.service-list-block {
          margin-top: 20px;
          display: block;
          li {
            font-size: 18px;
            line-height: 21px;
            color: #000000;
            font-weight: 600;
            margin-bottom: 20px;
          }
        }
      }
    }
  }
</style>
