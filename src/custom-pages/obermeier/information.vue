<template>
  <div class="container">
    <div>
      <div class="page-content">
        <div class="textDiv">
          <h1>
            Obermeier Hardware: Beer & Wine Making Supplies
          </h1>
          <span>
      Obermeier Hardware & Rental is your home base for home brewing supplies, wine making supplies, and even home made soda supplies.  We are proud to stock everything you need to keep your hobby of homebrew alive.  We stock everything from sugar to hops from yeast to hydrometers.  We have all the equipment you need to make beer or wine.
      </span>
        </div>
      </div>

      <div class="page-content">
        <div class="textDiv">
          <h1>
            Obermeier Hardware: Lumber & Building Materials
          </h1>
          <div class="banner-container">
            <img alt="Framed house" src="https://storage.googleapis.com/content.ezadtv.com/2020/05/20/5ec56df656796_information-page-1.jpg">
          </div>
          <h3>
            Delivery Service
          </h3>
          <span>
      Obermeier Hardware and Rental provides professional delivery service to your jobsite, commercial business, or residence.  We deliver with a truck mounted forklift, Cab Over roll off truck or hand unload if necessary.  We always strive to make your projects moving forward by keeping you in-stock with all the materials you need.
      </span>
        </div>
      </div>

      <div class="page-content">
        <div class="textDiv">
          <h1>
            Obermeier Hardware: Tool and Equipment Rental
          </h1>
          <span>
      Obermeier Hardware & Rental has a full line rental department to support the Rockport, Richland, Reo, Hatfield, Chrisney, Dale, Tell City, Troy, Owensboro, Maceo, Lewisport, Santa Claus, and Grandview area that includes: hand tool rental, power tool rental, drain auger rental, landscaping tool rental, mini excavator rental, track loader rental, trencher rental, concrete mixer rental, air compressor rental, concrete related rental, water pump rental, party supplies rental, floor refinishing rental, and more.  We rent items based on a 1/2 day, day, week, month and year rental rates.  We are a one stop shop when it comes to projects.
      </span>
        </div>
      </div>

      <div class="page-content">
        <div class="row textDiv">
          <div class="col-md-6 col-12">
            <h1>Our Niche Categories:</h1>
            <ul>
              <li>STIHL OPE</li>
              <li>Milwaukee Tools</li>
              <li>Beer & Wine Making Supplies</li>
              <li>Rental Equipment</li>
              <li>Camp Chef Pellet Grills</li>
              <li>Weber Gas Grills</li>
              <li>Nebo Flashlights</li>
              <li>Ammunition</li>
              <li>Live Annual Flowers/Garden Plants</li>
            </ul>
          </div>

          <div class="col-md-6 col-12">
            <h1>Our Services:</h1>
            <ul>
              <li>Franzen Chain Sharpening Services</li>
              <li>Franzen Blade/Tool Sharpening Services</li>
              <li>Key Cutting</li>
              <li>Pipe Cutting/Threading</li>
              <li>Custom Paint Color Matching</li>
              <li>Truck Mounted Forklift Delivery Service</li>
              <li>Blue Print Take Off </li>
              <li>20/20 Kitchen/Bath Layout & Design Service</li>
              <li>Propane Refill</li>
              <li>Pool Water Testing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'SingleDepartmentPage'
  };
</script>

<style lang="scss" scoped>
  :deep(.textDiv) {
    color: #747474;
    h1, h2 {
      font-size: 32px;
      line-height: 65px;
      font-weight: bold;
      color: var(--primary) !important;
    }

    h3 {
      font-size: 18px;
      font-weight: bolder;
      margin: 20px 0;
      color: #000;
    }

  }
  .brand-logo {
    width: 100%;
    .logo-container {
      display: flex;
      flex-wrap: wrap;
      .logo-center {
        display: flex;
        justify-content: center;
        align-items: center;
        a {
          flex: 1;
          text-align: left;

          img {
            padding: 20px 0;
            max-width: 205px;
            width: 100%;
          }
        }
      }
    }
  }

  .banner-container {
    padding-top: 50px;
    img {
      width: 100%;
      height: auto;
    }
  }

  .banner-img {
    width: 100%;
    margin: 30px auto;

    img {
      width: 100%;
      height: auto;
    }

    .block-img {
      width: 100%;
    }
  }

  .dept-details {
    width: 100%;

    .box-element {
      a {
        img {
          width: 100%;
          height: auto;
        }
      }

      .form-submit {
        border: 1px solid #ddd;
        color: #777;
        background: #f5f5f5;
        height: 100%;
        padding: 0 15px;

        p {
          font-size: 1.2em;
          margin-bottom: 0;
          line-height: 40px;
          text-align: center;
        }

        .input {
          input {
            width: 100%;
            padding: 0.8em;
            border: 1px solid #ddd;
          }
        }

        .disclaimer-text {
          display: flex;
          margin-top: 5px;
          align-items: center;

          label {
            font-size: 0.7em;
            line-height: 16px;
            margin-left: 10px;
            margin-bottom: 0;
          }
        }

        button {
          width: 100%;
          line-height: 40px;
          margin-top: 15px;
        }
      }
    }
  }

  ul {
    list-style: none;
    padding: 5px 5px 5px 0px;
  }
</style>