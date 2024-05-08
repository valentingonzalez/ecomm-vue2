<template>
<main>
  <div class="container pt-5">
    <h1 class="page-title text-center">The Easiest Starting Outdoor Power Equipment</h1>
    <div class="mb-4">
      <iframe frameborder="0" allowfullscreen="1" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" title="YouTube video player" width="100%" height="360" src="https://www.youtube.com/embed/EI7zYMDWEx4?enablejsapi=1&amp;origin=http%3A%2F%2Flocalhost%3A8080&amp;widgetid=1" id="widget2"></iframe>
    </div>
    <div class="banner-main mb-5">
      <div class="row justify-content-between">
        <div @click="sureCanRedirection" class="col-xs-12 col-lg-4 cursor-pointer">
          <div class="banner-wrapper">
            <div class="banner-image mb-2">
              <img src="https://storage.googleapis.com/content.ezadtv.com/2020/08/04/5f2a05b40b24c_oil-can.png" alt="Oil Can" />
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
            <div class="banner-image mb-2">
              <img src="https://storage.googleapis.com/content.ezadtv.com/2020/08/04/5f2a058ff137d_repair-expert.png" alt="Repair Expert" />
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
            <div class="banner-image mb-2">
              <img src="https://storage.googleapis.com/content.ezadtv.com/2020/08/04/5f2a054a0682d_gasoline-pump.png" alt="Gasoline Pump" />
            </div>
            <div class="banner-info">
              <h3>The Secret Sauce?</h3>
              <p>How To Perform Better & Last Longer</p>
              <router-link to="/get-the-secret">Get The Secret</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-5">
      <div class="content-block col-md-12">
        <h2>Get The Best In Class Lawn Care with ECHO Outdoor Power Equipment</h2>
        <h3>Quality Assured, Warranty Included</h3>
        <p>Get the <b>power desired </b>by Professional Lawn Care Services<b> </b>with
          the <b>affordability</b> of a Homeowner Budget! Speed & Productivity matters
          whether you are getting paid by the hour or using hours of your valuable weekend and ECHO
          power equipment delivers with easier starting, lighter weight & more powerful
          than their competitors. </p>
      </div>
    </div>
    <div v-if="!productsFetched" class="loader-wrapper">
      <img src="/icons/loader.gif" class="loader" alt="Loading..." />
    </div>
    <div v-else class="row">
      <div class="w-100 mb-4">
        <div class="position-relative">
          <template>
            <swiper ref="similarProductsSwiper" class="products-slider" :options="swiperOptions">
              <swiper-slide v-for="(item, index) in sliderProducts" :key="'similar-products-' + index">
                <ProductItem :item="item" :internal-api="false" :add-start-stop-scroller="true" @stop-autoplay="stopAutoplay" @start-autoplay="startAutoplay"/>
              </swiper-slide>
            </swiper>
            <div class="swiper-button-prev" id="similar-swiper-button-prev" slot="button-prev" />
            <div class="swiper-button-next" id="similar-swiper-button-next" slot="button-next" />
          </template>
        </div>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-xs-12 col-lg-6 mb-sm-4">
        <div class="service-image">
          <img src="https://storage.googleapis.com/content.ezadtv.com/2020/08/04/5f2a050c48b9f_Quality_Assured.jpg" alt="QA" />
        </div>
      </div>
      <div class="col-xs-12 col-lg-6">
        <div class="service-description">
          <h3>Chainsaws</h3>
          <p>Whether you are cutting firewood for the family campfire or trimming tress for a
            living, ECHO chainsaws are built to give you the years of trouble-free service you
            want! </p>
          <h3>Easy starting, smooth running & unmatched dependability!</h3>
          <p>Your new chainsaw is backed by a 5 year consumer warranty and factory trained &
            certified service provided by Hammond Hardware's Service Team. Genuine Parts &
            Service or YOU CAN kits for those DIYers are stocked in our Service Department.</p>
          <p>ECHO gives you the equipment you desire, Hammond Hardware provides the Piece Of Mind
            Service you need!</p>
          <p>Check out these great tips & guides</p>
          <ul>
            <li><a
              href="https://www.echo-usa.com/Products/Chain-Saws/ECHO-Chainsaw-Guide-2017-Final.pdf"
              text="https://www.echo-usa.com/Products/Chain-Saws/ECHO-Chainsaw-Guide-2017-Final.pdf"
              rel="" target="_blank"
              title="Link: https://www.echo-usa.com/Products/Chain-Saws/ECHO-Chainsaw-Guide-2017-Final.pdf">How
              To Choose The Right Chainsaw (Beginner's Guide)</a></li>
            <li><a
              href="https://www.echo-usa.com/Products/Chain-Saws/ECHO-female-chainsaw-safety-gear.pdf?lang=en-US"
              text="https://www.echo-usa.com/Products/Chain-Saws/ECHO-female-chainsaw-safety-gear.pdf?lang=en-US"
              rel="" target="_blank"
              title="Link: https://www.echo-usa.com/Products/Chain-Saws/ECHO-female-chainsaw-safety-gear.pdf?lang=en-US">Chainsaw
              Safety Gear Guide</a></li>
            <li><a href="https://www.echo-usa.com/Products/Chain-Saws/ChainSaw_bars_chains.pdf"
                   text="https://www.echo-usa.com/Products/Chain-Saws/ChainSaw_bars_chains.pdf"
                   rel="" target="_blank">Chainsaw Bar & Chain Guide</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-xs-12 col-lg-6">
        <div class="service-description">
          <h3>The World's Best String Trimmers</h3>
          <p>In the backyard or the backwoods - ECHO has powerful, productive & lightweight
            string trimmer for every job!  All feature easy-to-use controls with the cutting
            edge & professional grade 2 stroke engine to make quick work of any job!</p>
          <h3>ECHO String Trimmers Are Simply The Best!</h3>
          <p>Ergonomically designed for lighter weight & less fatigue choose the curved shaft
            models for trimming small yards & garden beds, trees & fence post or choose the
            Straight Shaft Models for longer reach, brush & larger jobs.</p>
          <p><br></p>
        </div>
      </div>
      <div class="col-xs-12 col-lg-6">
        <div class="service-image">
          <img src="https://storage.googleapis.com/content.ezadtv.com/2020/08/04/5f2a04aaca2c5_Easy_Starting.jpg" alt="Easy Starting" />
        </div>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-xs-12 col-lg-6">
        <div class="service-image">
          <img class="img-fluid" src="https://storage.googleapis.com/content.ezadtv.com/2020/08/04/5f2a044f7d3a5_Powerful_Performance.jpg" alt="Powerful Performance" />
        </div>
      </div>
      <div class="col-xs-12 col-lg-6">
        <div class="service-description">
          <h3>Leaf Blowers - Quick & Fast Yard Clean-Up</h3>
          <p>Yard Clean-Up stinks! Wasting a weekend and at a time when there just aren't many more good left this year! Get amazing productivity and get on with your fun this weekend with an ECHO Leaf Blower designed to perform the job while being comfortable to operate!</p>
          <p>CFM rules! Many manufacturers like to us MPH for ratings of power (which it is) but CFM is what really matters! This is what moves leaves farther and easier. Definitely compare this when you make your buying decision!</p>
          <h3>Powerful, Productive & Quiet..!!!</h3>
          <p>Get Piece of Mind with ECHO's 5 year Consumer Warranty backed by the Outdoor Power Equipment Service Team at Hammond Hardware. Quality in every Blower with your warranty assured!</p>
          <p>Read this <a href="https://www.echo-usa.com/Products/Blowers/ECHO-male-blower-safety-gear.pdf" target="_blank">Safety Guide</a> before you operate your new blower</p>
          <p><br></p>
        </div>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-xs-12 col-lg-6">
        <div class="service-description">
          <h3>Pro Attachment Series - Be A Multitasking Master!</h3>
          <p>If versatility is what you need for your yard or job, then the Pro Attachment
            Series (PAS) is for you! Only service one engine while getting the
            productivity of several tools with this Multi-Tasking Monster!</p>
          <h3>Expandable, Versatile & Powerful</h3>
          <p>CSimple tool-less change-over for these and many more attachments</p>
          <ul>
            <li><a
              href="https://www.echo-usa.com/Products/Chain-Saws/ECHO-Chainsaw-Guide-2017-Final.pdf"
              text="https://www.echo-usa.com/Products/Chain-Saws/ECHO-Chainsaw-Guide-2017-Final.pdf"
              rel="" target="_blank"
              title="Link: https://www.echo-usa.com/Products/Chain-Saws/ECHO-Chainsaw-Guide-2017-Final.pdf">
              Power Paddle</a></li>
            <li><a
              href="https://www.echo-usa.com/Products/Chain-Saws/ECHO-female-chainsaw-safety-gear.pdf?lang=en-US"
              text="https://www.echo-usa.com/Products/Chain-Saws/ECHO-female-chainsaw-safety-gear.pdf?lang=en-US"
              rel="" target="_blank"
              title="Link: https://www.echo-usa.com/Products/Chain-Saws/ECHO-female-chainsaw-safety-gear.pdf?lang=en-US">String Trimmers</a></li>
            <li><a href="https://www.echo-usa.com/Products/Chain-Saws/ChainSaw_bars_chains.pdf"
                   text="https://www.echo-usa.com/Products/Chain-Saws/ChainSaw_bars_chains.pdf"
                   rel="" target="_blank">Hedge Trimmers</a></li>
            <li><a href="https://www.echo-usa.com/Products/Chain-Saws/ChainSaw_bars_chains.pdf"
                   text="https://www.echo-usa.com/Products/Chain-Saws/ChainSaw_bars_chains.pdf"
                   rel="" target="_blank">Pruning Attachments</a></li>
            <li><a href="https://www.echo-usa.com/Products/Chain-Saws/ChainSaw_bars_chains.pdf"
                   text="https://www.echo-usa.com/Products/Chain-Saws/ChainSaw_bars_chains.pdf"
                   rel="" target="_blank">Blower Attachments</a></li>
            <li><a href="https://www.echo-usa.com/Products/Chain-Saws/ChainSaw_bars_chains.pdf"
                   text="https://www.echo-usa.com/Products/Chain-Saws/ChainSaw_bars_chains.pdf"
                   rel="" target="_blank">Edgers & More!</a></li>
          </ul>
          <p>Use this handy <a href="https://www.echo-usa.com/Products/Pro-Attachment-Series/PAS_Sell_Sheet.pdf" target="_blank">compatibility chart</a> to choose the right head & attachments for your needs!</p>
        </div>
      </div>
      <div class="col-xs-12 col-lg-6 mb-sm-4">
        <div class="service-image">
          <img src="https://storage.googleapis.com/content.ezadtv.com/2020/08/04/5f2a043b5616f_power_attachment.jpg" alt="Power Attachment" />
        </div>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-xs-12 col-lg-6">
        <div class="service-image">
          <img src="https://storage.googleapis.com/content.ezadtv.com/2020/08/04/5f2a041cf2db3_youcan_kits.jpg" alt="Youcan Kits" />
        </div>
      </div>
      <div class="col-xs-12 col-lg-6">
        <div class="service-description">
          <h3>YOU CAN Do-It-Yourself..!</h3>
          <p>It's no secret our service team loves to help you maintain power & performance in all your outdoor power equipment
            but we know some just like to Do-It-Yourself. We support this lifestyle and offer you
            genuine parts & DIY kits to maintain your power equipment.</p>
          <h3>Repairs Can Be Costly...!!</h3>
          <p>It's plain & simple, MAINTENANCE SAVES TIME & MONEY! ﻿When you maintain your equipment with us you get these great benefits!
          </p>
          <ul>
            <li><a href="#">Extend The Life of Your Equipment</a></li>
            <li><a href="#">Reduce Downtime & Costly Repairs</a></li>
            <li><a href="#">Genuine Parts Deliver High Performance</a></li>
          </ul>
          <p>Stop in and let our expert staff find the parts you need or check this <b class="notes cursor-pointer" @click="youCanRedirection">handy reference guide & maintenance schedule</b> and pick up parts you need in our store.</p>
        </div>
      </div>
    </div>
  </div>
</main>
</template>
<script>
  export default {
    name: 'echo-dealer',
    data() {
      return {
        sliderProducts: [],
        productsFetched: false,
        swiperOptions: {
          spaceBetween: 20,
          autoplay: {
            delay: 3500,
            disableOnInteraction: false
          },
          allowTouchMove: false,
          slidesPerView: 'auto',
          draggable: true,
          breakpoints: {
            320: {
              centeredSlides: true,
              spaceBetween: 0,
            },
            640: {
                allowTouchMove: true
            },
          },
          navigation: {
            disabledClass: 'd-none',
            nextEl: '#similar-swiper-button-next',
            prevEl: '#similar-swiper-button-prev',
          }
        }
      };
    },
    methods: {
      stopAutoplay() {
        this.$refs.productsSwiper.swiper.autoplay.stop();
      },
      startAutoplay() {
        this.$refs.productsSwiper.swiper.autoplay.start();
      },
      async fetchProducts() {
        // let products = this.$store.state.products;
        // let product = products.find( item => item.upc === '021038516172');
        // if (product == null) {
        //   await ProductApiService.getProduct('021038516172').then(response => {
        //     product = response.data.data;
        //     product.competitors = null;
        //     product.similars = null;
        //     product.videos = null;
        //     this.sliderProducts.push(product);
        //     this.$store.commit('addProduct', product);
        //   });
        // } else {
        //   this.sliderProducts.push(product);
        // }
        // let allSKUs = [];
        // this.sliderProducts.forEach(item => {
        //   allSKUs.push(item.sku);
        // });
        // if (allSKUs.length) {
        //   ProductApiService.getCompetitorsForSKUList(allSKUs).then(
        //     response => {
        //       this.$store.commit('setMultiCompetitors', response.data.data);
        //     }
        //   );
        // }
        this.productsFetched = true;
      },
      heroesRedirection() {
        this.$router.push("/small-engine-repair");
      },
      chainSawsRedirection() {
        window.open('https://www.echo-usa.com/Products/Chain-Saws', '_blank');
      },
      trimmersRedirection() {
        window.open('https://www.echo-usa.com/Products/Trimmers', '_blank');
      },
      blowersRedirection() {
        window.open('https://www.echo-usa.com/Products/Blowers', '_blank');
      },
      attachmentRedirection() {
        window.open('https://www.echo-usa.com/Products/Pro-Attachment-Series', '_blank');
      },
      youCanRedirection() {
        window.open('https://www.echo-usa.com/You-Can', '_blank');
      },
      sureCanRedirection() {
        this.$router.push("/sure-can");
      }
    },
    async mounted() {
      this.fetchProducts();
    }
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