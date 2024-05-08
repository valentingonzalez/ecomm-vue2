<template>
  <div class="department-wrapper">
    <div class="container">
      <template v-if="!departments || departments.length === 0">
        <div class="page-loader">
          <img src="/icons/loader.gif" class="loader" alt="Loading..." />
        </div>
      </template>
      <template v-else>
        <div class="row">
          <div class="col-md-3 col-xs-12">
            <div class="category d-md-block d-sm-none d-none">
              <h5>Category</h5>
              <ul>
                <li>
                  <a @click="filterDepartmentId = null" :class="{active: !filterDepartmentId}">
                    All
                  </a>
                </li>
                <li v-for="category in parentDepartmentsToDisplay"
                    :key="category.dept_id" class="text-capitalize">
                  <a @click="filterDepartmentId = category.dept_id" :class="{active: filterDepartmentId === category.dept_id}">
                    {{ category.name.toLowerCase() }}
                  </a>
                </li>
              </ul>
              <button class="btn" @click="showMoreParentDepartments = !showMoreParentDepartments;">
                {{(showMoreParentDepartments) ? 'Show More' : 'Show Less' }}
                <img
                  :class="{'show-more': showMoreParentDepartments, 'show-less': !showMoreParentDepartments }"
                  src="/icons/arrow-left-green.svg"/>
              </button>
            </div>
            <div class="d-md-none  d-sm-block m-toggle shadow-sm">
              <b-navbar-toggle target="category" class="bg-light">Category <img src="/icons/arrow-left-green.svg" alt="Cat" />
              </b-navbar-toggle>
              <b-collapse id="category" is-nav>
                <b-navbar-nav class="mr-auto">
                  <div class="category">
                    <ul>
                      <li>
                        <a href="#" @click="filterDepartmentId = null" :class="{active: !filterDepartmentId}">
                          All
                        </a>
                      </li>
                      <li v-for="category in parentDepartmentsToDisplay" :key="category.dept_id" class="text-capitalize">
                        <a href="#" @click="filterDepartmentId = category.dept_id" :class="{active: filterDepartmentId === category.dept_id}">
                          {{category.name.toLowerCase()}}
                        </a>
                      </li>
                    </ul>
                    <button class="btn" @click="showMoreParentDepartments = !showMoreParentDepartments;">
                      {{(showMoreParentDepartments) ? 'Show More' : 'Show Less' }}
                      <img :class="{'show-more': showMoreParentDepartments, 'show-less': !showMoreParentDepartments }" src="/icons/arrow-left-green.svg" alt="Toggle Visibility" />
                    </button>
                  </div>
                </b-navbar-nav>
              </b-collapse>
            </div>
          </div>
          <div class="col-md-9">
            <template v-if="isLoading">
              <div class="page-loader">
                <img src="/icons/loader.gif" class="loader" alt="Loading..." />
              </div>
            </template>
            <template v-else>
              <div class="department-right-panel">
                <h4 class="mt-4 mb-3">Shop All Departments</h4>
                <div class="department-pagination pagination" v-if="!filterDepartmentId">
                  <v-pagination
                    v-model="currentPage"
                    :page-count="pages"
                    :classes="bootstrapPaginationClasses"
                    :labels="paginationAnchorTexts"
                    @input="gotoPage"/>
                </div>

                <div class="department-card mb-3" v-for="department in departments" :key="department.dept_id">
                  <department-category :department="department"></department-category>
                </div>

                <div class="pagination" v-if="!filterDepartmentId">
                  <v-pagination
                    v-model="currentPage"
                    :page-count="pages"
                    :classes="bootstrapPaginationClasses"
                    :labels="paginationAnchorTexts"
                    @input="gotoPage"/>
                </div>
              </div>
            </template>

          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script>
  import DepartmentApiService from '@/api-services/departments.service';
  import {paginationConfig} from '@/config/modules';

  export default {
    name: 'DepartmentMainPage',
    data() {
      return {
        ...paginationConfig,
        showMoreParentDepartments: true,
        showMoreDepartments: true,
        filterDepartmentId: null,
        isLoading: false,
        pages: 0,
        currentPage: 1,
        perPage: 5,
        total: 10,
        perPages: [5, 10, 15, 20, 25, 30],
        coolStyle: {
          'text-algin': 'center',
          width: '50px',
          margin: '0 14px',
        },
        coolClass: 'text-center',
        bootstrapPaginationClasses: {
          ul: 'pagination justify-content-center',
          li: 'page-item',
          liActive: 'active',
          liDisable: 'disabled',
          button: 'page-link',
        },
        paginationAnchorTexts: {
          first: 'Prev',
          last: 'Next',
        },
        swiperOptions: {
          loop: true,
          slidesPerView: 'auto',
          spaceBetween: 0,
          draggable: true,
          allowTouchMove: true,
        },
      };
    },
    watch: {
      filterDepartmentId: function() {
        this.gotoPage();
      }
    },
    computed: {
      parentDepartmentsToDisplay() {
        if (this.showMoreParentDepartments && this.parentDepartments.length > 25) {
          return this.parentDepartments.slice(0, 25);
        }
        return this.parentDepartments;
      },
      parentDepartments() {
        if (this.$store.state.departmentResults) {
          let parentDepartments = this.$store.state.departmentResults.parent_departments;
          if (parentDepartments) {
            parentDepartments.map(department => {
              department.active = false;
              return department;
            });
            parentDepartments.sort((a, b) => {
              if( a.name > b.name) {
                return 1;
              } else if( a.name < b.name) {
                return -1;
              }
              return 0;
            });
            return parentDepartments;
          } else {
            return [];
          }
        }
        return [];
      },
      departments() {
        if (this.$store.state.departmentResults) {
          this.setPaginationProperties(this.$store.state.departmentResults.departments);
          return this.$store.state.departmentResults.departments.data;
        }
        return [];
      },
      preferences() {
        return this.$store.state.preferences;
      }
    },
    filters: {
      ceil(num) {
        return Math.ceil(num);
      },
    },
    async mounted() {
      this.$ezSetTitle('Departments');
      if (!this.preferences.departments) {
        this.$router.push('/').catch(err => console.log(err));
      }
      this.gotoPage();
    },
    methods: {
      async gotoPage() {
        window.scrollTo({top: 0, behavior: 'smooth'});
        this.isLoading = true;
        let response = await DepartmentApiService.getDepartments(
          this.currentPage,
          this.perPage,
          this.filterDepartmentId
        );
        this.$store.commit('saveDepartmentResults', response.data.data);
        this.isLoading = false;
      },
      setPaginationProperties(departments) {
        this.total = departments.total;
        this.currentPage = departments.current_page;
        this.pages = Math.ceil(this.total / this.perPage);
      }
    },
  };
</script>

<style lang="scss">
  .department-wrapper {
    .page-loader {
      height: calc((var(--vh, 1vh) * 100) - 375px);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .category {
      background: #fff;
      padding: 15px;
      border: 1px solid #eee;
      margin-top: 1.5rem;

      ul {
        padding-left: 0;
        margin-bottom: 0;

        li {
          list-style: none;

          a {
            cursor: pointer;
            font-size: 14px;
            color: #6d7179;
            font-weight: 400;
            text-decoration: none;

            &:hover {
              color: var(--primary);
            }

            &.active {
              color: var(--primary);
            }
          }
        }
      }

      .btn {
        color: var(--primary);
        padding: 0;
        width: 100%;
        text-align: left;

        img {
          margin-left: 10px;
        }

        .show-more {
          transform: rotate(-90deg);
        }

        .show-less {
          transform: rotate(90deg);
        }

        &:focus {
          outline: none;
          box-shadow: none;
        }
      }
    }

    .department-pagination {
      margin: 0 auto 0;
      ul {
        margin: 0 auto;
      }
    }

    .card-reverse {
      margin-bottom: 10px;

      .card-header {
        text-transform: normal;
        border-top: 0;
        white-space: normal;
        word-wrap: break-word;
      }

      .card-body.image-wrapper {
        height: 140px;
        padding: 30px !important;

        img {
          max-height: 120px;
          width: 100%;
          margin: auto;
          display: block;
        }
      }
    }

    .department-card {
      .category-wrapper {
        background: #fff;
        margin-top: 1.5rem;
        border: 1px solid #eee;
        padding: 30px;
        border-radius: 5px;

        .card {
          .card-header {
            h6 {
              font-weight: 600;
            }
          }

          .card-body {
            padding: 0 25px;

            .products-slider {
              display: flex;
              justify-content: space-between;
              flex-direction: column;
              align-items: center;

              .product-card {
                border-radius: 3px;
                border: 1px solid #e2e2e2;
                width: 163px;
                min-height: 163px;
                display: flex;
                flex-direction: column;

                .product-img {
                  padding: 20px 0;
                  text-align: center;
                  width: 100%;
                  flex: 2;
                  min-height: 130px;
                  max-height: 130px;
                  align-self: center;
                  display: flex;

                  img {
                    max-width: 108px;
                    max-height: 108px;
                    height: auto;
                    margin: 0 auto;
                  }
                }

                .product-title {
                  border-top: 1px solid #e2e2e2;
                  margin: 0 auto;
                  flex: 1;

                  h6 {
                    font-weight: 400;
                    margin-bottom: 0;
                    text-overflow: ellipsis;
                    width: 125px;
                    overflow: hidden;
                    padding: 10px 3px;
                    text-align: center;
                    font-size: 12px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: horizontal;
                    height: 50px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }
                }
              }
            }

            .swiper-container {
              border: none !important;
              margin: 0 90px;

              .swiper-button-prev {
                left: 30px;
              }

              .swiper-button-next {
                right: 30px;
              }
            }
          }
        }
      }

      .expand-btn {
        width: 100%;
        background: #fff;
        border: 1px solid #eee;
        border-top: none;
        line-height: 50px;
        color: var(--primary);
        outline: none;

        .show-more {
          transform: rotate(90deg);
        }

        .show-less {
          transform: rotate(-90deg);
        }

        &:focus {
          outline: none;
          box-shadow: none;
        }
      }
    }
  }

  @media (max-width: 767px) {
    .department-wrapper {
      .card-body {
        .swiper-container {
          margin: 0 15px !important;

          .swiper-wrapper {
            justify-content: center;
          }
        }

        .swiper-button-prev {
          left: -20px;
        }

        .swiper-button-next {
          right: -15px;
        }
      }

      .m-toggle {
        margin-top: 15px;

        button {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          outline: none;
          border-radius: 0;
          background-color: #fff !important;
          line-height: 40px;
          padding: 0 15px;

          img {
            transform: rotate(-90deg);
          }
        }

        .category {
          margin-top: 0 !important;
        }
      }
    }
  }
</style>
