<template>
  <div>
    <div class="videoWrapper">
      <iframe width="560" height="315" src="https://www.youtube.com/embed/sxYDLJ5xpws" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
    <div class="bg-white py-5">
      <div class="container">
        <img class="logo mt-4 mb-4" alt="Benjamin Moore" src="https://storage.googleapis.com/content.ezadtv.com/2020/05/26/5ecd5b464d7f3_Benjamin-moore-logo.png" />
        <h6>Celebration Hardware is an Authorized Benjamin Moore® Paint Retailer.</h6>
        <p>
          Celebration Hardware’s extensive commitment to the Benjamin Moore brand delivers 
          a comprehensive line of the finest quality interior and exterior paints. Our customers 
          choose Benjamin Moore Paint for its quality, durability, value and unmatched color 
          retention and selection. Benjamin Moore sets the standard for the paint industry by 
          which its competitors are measured. At Celebration Hardware you get a complete Benjamin 
          Moore Paint Store and a full service hardware store and maintenance supply in one.
        </p>
        <a class="mt-2 d-inline-block" href="https://celebrationhardware.com/wp-content/uploads/2019/09/Benjamin-Moore-US-Product-Guide_v7.pdf" target="_blank">
          View the Benjamin Moore Product Catalog
        </a>
        <br>
        <a class="mt-2 d-inline-block" href="https://celebrationhardware.com/benjamin-moore-favorites-fan-deck-2020/" target="_blank">
          See the most popular Benjamin Moore Colors
        </a>
      </div>
    </div>
    <div class="container py-5">
      <div class="py-4" v-for="(paint, key) in paints" :key="`key${key}`">
        <h4 class="mb-3">{{ paint.name }}</h4>
        <div class="row small-gutters">
            <div class="col-sm-6 col-md-4 col-lg-3 mb-2" v-for="(e, key) in paint.elements" :key="paint.name + key">
              <div class="paint-card card d-block p-3 text-center h-100">
                <img class="mw-100 paint-img" :src="e.img" :alt="e.name" />
                <h5 class="mt-3 mb-2">{{ e.name }}</h5>
                <p class="mb-5 small">{{ e.description }}</p>
                <router-link :to="`/benjamin-moore/`+ e.name | parseUrl" class="view-more-bt">Learn more</router-link>
              </div>
            </div>
          <div :class="`swiper-button-prev p-s-${key}`" slot="button-prev" />
          <div :class="`swiper-button-next n-s-${key}`" slot="button-next" />
        </div>
      </div>
    </div>
    <div class="bg-white py-5">
      <div class="container">
        <div class="mt-4">
          <div class="row">
            <div class="col-md-4">
              <h4 class="text-primary">Our Company</h4>
              <p class="paragraph pr-4">
                Established in 2012, Celebration Hardware sells Benjamin Moore Paint, 
                hardware, tools, plumbing and electrical supplies, building materials 
                and facility maintenance supplies to professionals, painters, homeowners, 
                theme parks, property managers, and businesses in Central Florida. Our 
                retail storefront is conveniently located in the Publix anchored Water 
                Tower Shopping Center on the corner of 192 and Celebration Avenue in 
                Celebration, Florida.
              </p>
            </div>
            <div class="col-md-4">
              <h4 class="text-primary">Our Products</h4>
              <p class="paragraph pr-4">
                As an independent business we answer only to our customers, delivering the 
                products and brands you request at competitive prices. We are supplied by 
                Benjamin Moore, Emery Jensen, a division of Ace Hardware, Orgill, Inc., and 
                Hardware Express, a division of The Home Depot. We offer diverse and 
                specialized access to localized assortments and brand name products 
                delivering an array of over 250,000 products to our customers.
              </p>
            </div>
            <div class="col-md-4">
              <h4 class="text-primary">Our Customers</h4>
              <p class="paragraph pr-4">
                Our business is strategically designed to serve our most valuable asset, our 
                customers. We serve homeowners, painters, general contractors, businesses, 
                property managers and facilities maintenance teams. Our local expertise and 
                experienced team works to meet and exceed your expectations and to offer 
                competitive value across a diverse range of product categories.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  
  import router from '@/router/index';

  let paints = [
    {
      name: 'Benjamin Moore Interior Paint',
      elements: [
        {
          name: 'Aura Interior',
          description: 'Trusted quality plus outstanding durability delivers unmatched coverage and washability.',
          img: 'https://storage.googleapis.com/content.ezadtv.com/2020/05/26/5ecd5ef883722_1.png'
        },
        {
          name: 'Natura Interior',
          description: 'Natura Waterborne Interior Paint is Benjamin Moore’s greenest paint.',
          img: 'https://storage.googleapis.com/content.ezadtv.com/2020/05/26/5ecd5f10c7368_2.png'
        },
        {
          name: 'Regal Select Interior',
          description: 'Trusted Quality with Great Coverage and Outstanding Durability & Washability. Engineered with Gennex®. Mildew Resistant. Excellent Hide. Easy Application.',
          img: 'https://storage.googleapis.com/content.ezadtv.com/2020/05/26/5ecd5f1c8d8fd_3.png'
        },
        {
          name: 'Ben Interior',
          description: 'ben Interior is user-friendly paint for flawless results and puts premium color within reach.',
          img: 'https://storage.googleapis.com/content.ezadtv.com/2020/05/26/5ecd5f271c526_4.png'
        },
        {
          name: 'Waterborne Ceiling Paint',
          description: 'Waterborne Ceiling Paint is an ultra flat finish designed to hide common ceiling imperfections for a look that is virtually flawless.',
          img: 'https://storage.googleapis.com/content.ezadtv.com/2020/05/26/5ecd5f315217e_5.png'
        },
        {
          name: 'Ultra Spec 500 Interior',
          description: 'Zero-VOC Ultra Spec 500 is a professional-quality interior coating designed to meet the needs of professional painting contractors, facility managers, and property managers.',
          img: 'https://storage.googleapis.com/content.ezadtv.com/2020/05/26/5ecd5f38b5820_6.png'
        },
        {
          name: 'Ultra Spec Scuff-X',
          description: 'Ultra Spec® SCUFF–X® is a revolutionary, single-component paint which resists scuffing before it starts. Built for professionals, it is engineered with cutting-edge protection against scuffs.',
          img: 'https://storage.googleapis.com/content.ezadtv.com/2020/05/26/5ecd5f405a943_7.png'
        },
        {
          name: 'Super Hide Zero',
          description: 'Super Hide ® Zero VOC is a professional-quality interior paint designed to meet the needs of high-volume commercial paint contractors.',
          img: 'https://storage.googleapis.com/content.ezadtv.com/2020/05/26/5ecd5f488b2cc_8.png'
        },
        {
          name: 'Advance Interior Paint',
          description: 'Provides a total waterborne system for Advance Waterborne Interior Alkyd finishes',
          img: 'https://storage.googleapis.com/content.ezadtv.com/2020/05/26/5ecd5f54dae2a_9.png'
        }
      ]
    },
    {
      name: 'Benjamin Moore Exterior Paint',
      elements: [
        {
          name: 'Aura Exterior',
          description: 'Proprietary Color Lock® technology for richer colors and superior fade resistance',
          img: 'https://storage.googleapis.com/content.ezadtv.com/2020/05/26/5ecd6f9638fba_1.png'
        },
        {
          name: 'Regal Select High Build',
          description: 'Durable finish resists fading, cracking and peeling so your home’s exterior looks freshly painted for years to come',
          img: 'https://storage.googleapis.com/content.ezadtv.com/2020/05/26/5ecd6fa1d513b_2.png'
        },
        {
          name: 'Ben Exterior',
          description: 'Easy application for beautiful transformations',
          img: 'https://storage.googleapis.com/content.ezadtv.com/2020/05/26/5ecd6faa8a788_3.png'
        },
        {
          name: 'Aura Grand Entrance',
          description: 'Rich, lustrous finish, Excellent color retention and fade resistance, Easy, smooth application, For interior & exterior use, Lifetime Limited Warranty',
          img: 'https://storage.googleapis.com/content.ezadtv.com/2020/05/26/5ecd6fb10eee0_4.png'
        },
        {
          name: 'Ultra Spec EXT',
          description: 'Use on both bare and previously coated siding and trim. Ideal for exterior surfaces such as new or previously painted exterior wood, hardboard siding, cured masonry, aluminum and galvanized metal, and unglazed brick.',
          img: 'https://storage.googleapis.com/content.ezadtv.com/2020/05/26/5ecd6fb658516_5.png'
        },
        {
          name: 'Ultra Spec Masonry',
          description: 'A family of products used to penetrate, seal, protect and beautify new or previously painted masonry surfaces.',
          img: 'https://storage.googleapis.com/content.ezadtv.com/2020/05/26/5ecd6fbc1104f_6.png'
        },
        {
          name: 'Floor & Patio N112',
          description: 'Particularly recommended for basements, porches, patios, breezeways, showrooms, and light industrial applications.',
          img: 'https://storage.googleapis.com/content.ezadtv.com/2020/05/26/5ecd6fc11ec90_7.png'
        }
      ]
    },
    {
      name: 'Benjamin Moore Primers',
      elements: [
        {
          name: 'Sure Seal Latex Primer',
          description: 'Designed for a wide range of interior and exterior projects.',
          img: 'https://storage.googleapis.com/content.ezadtv.com/2020/05/26/5ecd72a5c450f_1.png'
        },
        {
          name: 'Fresh Start Primers',
          description: 'A premium quality, 100% acrylic interior primer that adheres to nearly every surface. Enjoy the product’s quick dry time and environmentally friendly low VOC.',
          img: 'https://storage.googleapis.com/content.ezadtv.com/2020/05/26/5ecd72ad6958b_2.png'
        },
        {
          name: 'Fresh Start Brochure',
          description: 'Easy application for beautiful transformations',
          img: 'https://storage.googleapis.com/content.ezadtv.com/2020/05/26/5ecd72b36c062_3.png'
        }
      ]
    }
  ];

  let routes = [].concat.apply([], paints.map(e => e.elements.map(x => {
      let name = x.name.replace(/ /g, '-').toLowerCase();
      let path = `/benjamin-moore/${name}`;
      return {
        path: path,
        name: name,
        components: {
          default:() => import(`@/custom-pages/celebration/single.vue`),
          catalog:() => import(`@/custom-pages/celebration/single.vue`)
        }
      };
    }
  )));
  router.addRoutes(routes);

  export default {
    name: 'BenjaminMoore',
    data() {
      return {
        paints: paints,
        swiperOptions: {
          spaceBetween: 10,
          slidesPerView: 4,
          draggable: true,
          allowTouchMove: false,
          breakpoints: {
            576: {
              allowTouchMove: true,
              spaceBetween: 0,
              autoplay: false
            },
          }
        }
      };
    }
  };
</script>

<style lang="scss" scoped>
.logo {
  max-width: 300px;
}
.paint-card {
  .view-more-bt {
    position: absolute;
    bottom: 15px;
    font-size: 14px;
    left: 50%;
    transform: translateX(-50%);
  }
}
.paint-img {
  max-height: 120px;
  width: auto;
}
.paragraph {
  font-size: 15px;
  line-height: 22px;
  color: #636363;
}
.videoWrapper {
  position: relative;
  // padding-bottom: 56.25%; /* 16:9 */
  // height: 0;
  height: calc((var(--vh, 1vh) * 100) - 130px);
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>