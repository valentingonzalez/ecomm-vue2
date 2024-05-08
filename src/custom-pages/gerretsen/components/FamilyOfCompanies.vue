<template>
  <section class="company-family-wrapper">
    <div class="company-header">
      <span>TAL FAMILY OF COMPANIES</span>
    </div>
    <div class="container">
      <div class="company-logo-wrapper">
        <div v-for="(link, index) in getCompanies()" :key="index" class="company-logo">
          <a :href="link.link" :aria-label="`To ${link.link}`">
            <img :src="link.logo" :width="link.width" :height="link.height" alt="Company Logo">
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "FamilyOfCompanies",
  methods: {
    getCompanies() {
      return [
        {
          logo: '/images/gerretsen/tum-logo.png',
          width: '120px',
          height: '120px',
          link: 'https://www.tumalum.com/'
        },
        {
          logo: '/images/gerretsen/marson-logo.png',
          width: '120px',
          height: '88px',
          link: 'https://www.marsonandmarson.com/'
        },
        {
          logo: '/images/gerretsen/brownes-logo.png',
          width: '191px',
          height: '120px',
          link: 'http://www.browneshomecenter.com/'
        },
        {
          logo: '/images/gerretsen/gerretsen-logo.png',
          width: '120px',
          height: '120px',
          link: 'http://www.gerretsen.com/'
        },
        {
          logo: '/images/gerretsen/chelan-logo.png',
          width: '120px',
          height: '120px',
          link: 'http://www.lakechelanbuildingsupply.com/'
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
  .company-family-wrapper {
    background-image: url("/images/gerretsen/wood-background.jpg");

    padding-bottom: 0px;
    .company-header {
      background-color: #000;
      text-align: center;
      color: white;
      padding-bottom: 0px;
      letter-spacing: 2px;
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      &:before,
      &:after {
        content: "";
        flex: 1 1;
        border-bottom: 1px solid #fff;
        margin: auto;
      }
      span {
        padding-left: 10px;
        padding-right: 10px;
        background-color: #000;
        display: flex;
        margin-bottom: 0;
        font-family: 'Open Sans', sans-serif;
        font-size: 16px;
      }
    }
    .company-logo-wrapper {
      width: 100%;
      max-width: 1370px;
      margin: auto;
      padding-top: 0px;
      padding-bottom: 0px;
      padding-left: 20px;
      padding-right: 20px;
      text-align: center;
      .company-logo {
        height: 250px;
        width: 19%;
        min-width: 150px;
        display: inline-block;
        vertical-align: middle;
        border-right: 5px solid #000;
        padding-top: 60px;
        &:last-child {
          margin-bottom: 0;
          border-right: none;
        }
      }
    }
  }
  @media only screen and (max-width: 800px) {
    .company-family-wrapper {
      .company-logo-wrapper {
        .company-logo {
          border-right: none;
          padding-top: 30px;
          height: 200px;
        }
      }
    }
  }
</style>
