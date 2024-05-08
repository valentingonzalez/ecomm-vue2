<template>
  <div class="page-wrapper">
    <h1 class="page-title">Jackson's Small Engine Repair Super Heroes</h1>
    <div class="mb-4">
      <iframe frameborder="0" allowfullscreen="1" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" title="YouTube video player" width="100%" height="360" src="https://www.youtube.com/embed/P0OYobqPSSs?enablejsapi=1&amp;origin=http%3A%2F%2Flocalhost%3A8080&amp;widgetid=1" id="widget2"></iframe>
    </div>

    <div class="row mb-4">
      <div class="col-md-12">
        <div class="serving-section">
          <div class="config-wrapper">
            <ul>
              <li><a>Lawn Mower Repair</a></li>
              <li><a>Snow Blower Repair</a></li>
              <li><a>Outdoor Equipment Repair</a></li>
            </ul>
            <h5>Serving Jackson, Brooklyn & Vandercook Lake MI</h5>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <div class="pick-up-section">
          <div class="pickup-text">
            <img src="/images/truck.png"/>
            <span>
              <h4>Pickup & Delivery Available</h4>
              <h5>Click to Call us Now..!!</h5>
            </span>
          </div>
          <button>Call us now <img src="/images/arrow-right.png"/> </button>
        </div>
      </div>
    </div>

    <div class="fuel-section">
      <div class="row">
        <div @click="redirectToSecret" class="col-sm-12 col-md-6 cursor-pointer">
          <div class="banner-wrapper">
            <div class="banner-image">
              <img src="images/fuel-station.png"/>
            </div>
            <div class="banner-info">
              <h3>Mower Won't Start?</h3>
              <p>Find Out The Secret To Better Performance & Longer Life In Your Small Engines.</p>
            </div>
          </div>
        </div>
        <div @click="sureCanRedirect" class="col-sm-12 col-md-6 cursor-pointer">
          <div class="banner-wrapper border-0 banner-two">
            <div class="banner-image">
              <img src="images/jerrycan.png"/>
            </div>
            <div class="banner-info">
              <h3>Frustrated Fueling?</h3>
              <p>See how you can easily feed your machines with this revolutionary new gas can</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <div class="black-banner">
          <h5>"Pick up my faulty snowblower today. Great job fixing it and it is running better then ever. Bring on the snow. Highly recommended for snowblower repair." <b>-Ted James</b></h5>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 col-lg-4 media-card-block">
        <div class="media-card-wrapper">
          <div class="media-card-image">
            <img src="images/businessman.png"/>
          </div>
          <div class="media-card-info">
            <h2>Lawn Mower Repair</h2>
            <p>Our Small Engine Repair service team are Jackson'
              Authorized Toro Service Center, stocking parts & accessories for the complete line
              of Toro walk behind mowers for warranty & repairs on ALL Toro lawn mowers. When
              you buy your mower from us - you have the trust & security of knowing you can get it
              fixed right...the first time by professionals.</p>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-lg-4 media-card-block">
        <div class="media-card-wrapper">
          <div class="media-card-image">
            <img src="images/businessman.png"/>
          </div>
          <div class="media-card-info">
            <h2>Snow Blower Repair Service</h2>
            <p>Our Small Engine repair heroes are here to rescue you when you need to fix that
              snow blower before the next blizzard hits. Proud to be Jackson's Authorized Service
                Center, Get piece of mind that you can get the parts & accessories you need PLUS the service you deserve with your new Toro Snow Thrower. Guaranteed!
            </p>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-lg-4 media-card-block">
        <div class="media-card-wrapper media-last">
          <div class="media-card-image">
            <img src="images/businessman.png"/>
          </div>
          <div class="media-card-info">
            <h2>Outdoor Power Equipment Service</h2>
            <p>Featuring ECHO outdoor power equipment including
              parts, accessories & warranty support plus the YOU CAN series of DIY maintenance
                kits. Buying outdoor power equipment from Hammond Hardware comes with a
              guarantee of service & support after the sale to keep your equipment running for many
              years. If It Runs On Gas, We Fix It!</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'SmallEngineRepair',
    methods: {
      sureCanRedirect() {
        this.$router.push("/info/sure-can");
      },
      redirectToSecret() {
        this.$router.push("/info/get-the-secret");
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
      height: auto;
    }

    .dealer-info {
      h2, h3 {
        display: block;
        margin: 0 0 15px;
        font-weight: 600;
      }

      h2 {
        font-size: 20px;
      }

      h3 {
        font-size: 16px;
      }
    }

    .add-banner {
      padding-top: 30px;
      border-top: 1px solid #cacaca;

      img {
        border: 3px solid #f1f1f1;
        width: 100%;
      }
    }

    .banner-wrapper {
      display: inline-flex;
      padding: 0 40px 0 45px;
      border-right: 1px solid #F2F2F2;
      @media (min-width: 768px) and (max-width: 991px) {
        flex-flow: column nowrap;
        padding: 0 10px;
        text-align: center;
      }
      @media (max-width: 767px) {
        padding: 0;
        border-bottom: 1px solid #F2F2F2;
        border-right: 0;
        padding-bottom: 20px;
        margin-bottom: 20px;
        &.banner-two {
          padding-bottom: 0;
          margin-bottom: 0;
        }
      }
      @media (max-width: 543px) {
        flex-flow: column nowrap;
        text-align: center;
      }
      .banner-image {
        margin-right: 14px;
        @media (min-width: 768px) and (max-width: 991px) {
          margin-right: 0;
          margin-bottom: 20px;
        }
        @media (max-width: 543px) {
          margin-right: 0;
          margin-bottom: 20px;
        }
        img {
          max-width: 80px;
          height: 90px;
        }
      }

      .banner-info {
        flex: 1;
        text-align: left;
        @media (min-width: 768px) and (max-width: 991px) {
          text-align: center;
        }
        @media (max-width: 543px) {
          text-align: center;
        }
        h3 {
          font-weight: 600;
          font-size: 24px;
          line-height: 28px;
          color: #000000;
        }

        p {
          margin: 0;
          font-size: 16px;
          line-height: 26px;
          color: #6C7173;
        }

      }
    }

    .black-banner {
      padding: 50px 15px 80px;
      overflow: hidden;
      h5 {
        font-weight: 300;
        font-size: 24px;
        line-height: 37px;
        text-align: center;
        color: #6C7173;
      }
      b {
        color: #000000;
      }
      img {
        width: 100%;
      }
    }

    .add-text {
      display: block;
      margin: 0 0 15px;
      font-weight: 600;
      font-size: 16px;
    }
    .media-card-block {
      display: flex;
      justify-content: flex-start;
    }
    .media-card-wrapper {
      background: #fff;
      padding: 40px 30px;
      @media (max-width: 991px) {
        margin-bottom: 20px;
        text-align: center;
        &.media-last {
          margin-bottom: 0;
        }
      }
      @media (max-width: 543px) {
        padding: 30px 15px;
      }
      .media-card-image {
        text-align: left;
        margin-bottom: 20px;
        @media (max-width: 991px) {
          text-align: center;
        }
        img {
          max-width: 128px;
        }
      }

      .media-card-info {
        margin: 10px 0 0;
        overflow: hidden;

        h2 {
          font-weight: 600;
          font-size: 18px;
          line-height: 21px;
          color: #000000;
          margin-bottom: 10px;
        }

        p {
          margin: 0 0 15px;
          font-weight: normal;
          font-size: 15px;
          line-height: 26px;
          color: #6C7173;
          /*max-height: 255px;*/
          /*height: 100%;*/
        }

        a {
          color: #088ace;
          background: transparent;
          text-decoration: none;
        }
      }
    }

    .serving-section {
      display: flex;
      justify-content: center;
      align-items: center;
      .config-wrapper {
        ul {
          padding-left: 0;
          display: flex;
          @media (max-width: 480px) {
            flex-flow: wrap;
          }
          li {
            list-style: none;
            background: #ffffff;
            line-height: 50px;
            border-radius: 25px;
            padding: 0 18px;
            @media (max-width: 767px) {
              line-height: normal;
              align-items: center;
              display: flex;
              padding: 8px 15px;
            }
            @media (max-width: 480px) {
              width: 100%;
              margin-bottom: 10px;
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
              @media (max-width: 767px) {
                  font-size: 14px;
                  line-height: normal;
              }
            }
            @media (min-width: 1200px) {
              &:nth-of-type(2) {
                margin: 0 10px;
              }
            }
            @media (min-width: 481px) and (max-width: 1200px) {
              &:nth-of-type(2) {
                margin: 0 10px;
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

    .pick-up-section {
      //background: url('../../../../public/images/bg-truck.png')no-repeat top center / cover;
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30px 50px;
      @media (max-width: 767px) {
        flex-direction: column;
        justify-content: center;
      }
      @media (max-width: 543px) {
        padding: 20px 15px;
        text-align: center;
      }
      .pickup-text {
        display: flex;
        @media (max-width: 543px) {
          flex-flow: column nowrap;
          align-items: center;
        }
        span {
          margin-left: 30px;
          @media (max-width: 543px) {
            margin: 15px 0 0;
          }
          h4 {
            font-weight: bold;
            font-size: 24px;
            line-height: 28px;
            color: #FFFFFF;
            margin-bottom: 0;
            @media (max-width: 543px) {
              font-size: 20px;
            }
          }
          h5 {
            line-height: 28px;
            color: #FFFFFF;
            margin-bottom: 0;
            font-weight: normal;
          }
        }

      }
      button {
        width: 230px;
        border-radius: 25px;
        font-weight: bold;
        font-size: 18px;
        line-height: 50px;
        text-transform: uppercase;
        color: #000000;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        @media (max-width: 767px) {
          margin-top: 15px;
          justify-content: center;
          img {
            margin-left: 20px;
          }
        }
      }
    }

    .fuel-section {
      background: #fff;
      margin: 30px 0;
      display: flex;
      padding: 60px 25px;
      border-radius: 15px;
      @media (max-width: 767px) {
        padding: 30px 15px;
      }
    }
  }

</style>
