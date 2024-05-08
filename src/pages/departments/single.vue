<template>
  <div class="container" v-if="pageData">
    <div>
      <div class="brand-logo" v-if="pageData.brands">
        <div class="logo-container">
          <div class="col-md-12">
          <div class="row">
            <div class="col-md-3 logo-center" v-for="(item, key) in pageData.brands" :key="key">
              <a><img :src="'/images/info_pages/' + item.image" :title="item.title" /></a>
            </div>
          </div>
          </div>
        </div>
      </div>

      <div class="banner-container" v-if="pageData.bannerImage">
        <img :src="'/images/info_pages/' + pageData.bannerImage.image" :title="pageData.bannerImage.title" :alt="pageData.bannerImage.title" />
      </div>

      <div class="page-content" v-html="pageData.description"></div>

      <div class="brand-logo" v-if="pageData.brands_bottom">
        <div class="logo-container">
          <div class="col-md-12">
          <div class="row">
            <div class="col-md-3 logo-center" v-for="(item, key) in pageData.brands_bottom" :key="key">
              <router-link v-if="item.brand_id" :to="{ name: 'brands-id', params: { id: item.brand_id},query: {in_stock_only:1} }">
                <img :src="`/images/info_pages/${item.image}`" :title="item.title" :alt="item.title" />
              </router-link>
              <img v-else :src="`/images/info_pages/${item.image}`" :title="item.title" :alt="item.title" />
            </div>
          </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import departmentApi from '@/api-services/departments.service';

  export default {
    name: 'SingleDepartmentPage',
    data() {
      return {
        pageData: undefined
      };
    },
    mounted() {
      if (!this.$route.params && this.$route.params.id) {
        this.$router.push('/').catch(err => console.log(err));
      } else {
        this.pageData = departmentApi.getInfoPage(this.$route.params.id);
      }
    }
  };
</script>

<style lang="scss" scoped>
  :deep(.textDiv) {
    color: #747474;
    h1, h2 {
      font-size: 32px;
      line-height: 65px;
      font-weight: bold;
      color: #ed6715 !important;
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

</style>
