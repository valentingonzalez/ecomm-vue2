<template>
  <div class="departments-wrapper h-100">
    <router-link
    :to="{name: 'department-products-slug', params: {slug: this.$ezSlugify(item.dept_name) + '-' + item.dept_id}, query: {name: item.dept_name}}"
    class="card card-primary department-item">
      <div class="card-body">
        <div class="departments">
          <div v-if="!loaded" class="d-flex loader-wrapper align-items-center justify-content-center">
            <img src="/icons/loader.gif" class="loader" alt="Loading..." />
          </div>
          <img
            :src="item.image_url"
            :alt="item.dept_name | lowerCase"
            @load="loaded = true"
            :class="{ 'd-none': !loaded }"
            class="department-image img-fluid">
          <h6>{{ item.dept_name }}</h6>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'DepartmentItem',
    props: {
      item: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        loaded: false
      };
    },
    methods: {
      urlFriendly(value) {
        return value.replace(/[ /]/g, '+');
      }
    }
  };
</script>

<style lang="scss" scoped>
  .department-item {
    position: relative;
    width: auto;
    height: 100%;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    cursor: pointer;

    &:hover{
      text-decoration: none;
    }
  }

  .departments {
    display: flex;
    width: 100%;
    height: 100%;
    text-align: center;
    padding: 20px 10px;
    flex-direction: column;
    justify-content: space-between;

    .loader-wrapper {
      height: 150px;
    }

    img.department-image {
      display: block;
      max-height: 130px;
      // min-height: 130px;
      margin: 0 auto;
      margin-bottom: 30px;
    }

    h6 {
      color: var(--text);
      font-weight: 600;
      white-space: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-bottom: 0;
    }
  }
  .card {
    border: none;
    box-shadow: 0 14px 10px 0 rgba(34,44,73, .04);
    border-radius: 13px;
    border: 1px solid #E8E8E8;

    .card-body {
      padding: 0;

      .product {
        .edit-product {
          position: relative;
          top: -10px;
          left: 0;
          margin-left: 5px !important;

          a {
            margin: 0 3px;

            img {
              width: 25px;
              height: 25px;
            }
          }
        }
      }
    }
  }

  @media screen and (max-width: 576px) {
    .departments {
      img.department-image {
        margin-bottom: 0;
      }
      h6 {
        margin-top: 12px;
        margin-bottom: 0;
      }
    }
  }
</style>
