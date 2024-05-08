<template>
  <main>
    <Container @drop="onDrop" :non-drag-area-selector="'.disable-drag'">
      <Draggable v-for="section in homepageSections" :key="'section-' + section.id">
        <admin-subscribe-section v-if="section.widget_type == 3"/>
        <admin-carousel-section v-if="section.widget_type == 4"/>
        <admin-departments-section v-if="section.widget_type == 6"/>
      </Draggable>
    </Container>

    <div class="container">
      <div class="widget-tool cursor-pointer" @click="showModal('addWidgetModal')">
       <span>
        <img src="/icons/plus.png" alt="Add New Widget" />
        <h4>Add New Widget</h4>
       </span>
      </div>
    </div>

    <b-modal ref="addWidgetModal" size="xl" class="add-widget">
      <div class="modal-title" slot="modal-header">
        <h5>Add a Widget</h5>
        <span @click="hideModal('addWidgetModal')">&times;</span>
      </div>

      <div class="modal-body">
        <div class="add-widget">
          <b-form-group>
            <div class="row">
              <div class="col-md-4 col-sm-6 col-xs-12">
                <h5>Product Widget</h5>
                <div class="modal-box" :class="{'active' : selectedWidgetType === 'productWidgetModal'}">
                  <b-form-radio name="widget-type" v-model="selectedWidgetType" value="productWidgetModal"></b-form-radio>
                  <div class="radio-img">
                    <img src="/images/product-widget.png" class="img-fluid" alt="Product Widget" />
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-sm-6 col-xs-12">
                <h5>Subscription Widget</h5>
                <div class="modal-box" :class="{'active' : selectedWidgetType === 'subscriptionWidgetModal'}">
                  <b-form-radio name="widget-type" v-model="selectedWidgetType" value="subscriptionWidgetModal"></b-form-radio>
                  <div class="radio-img">
                    <img src="/images/product-widget.png" class="img-fluid" alt="Subscription Widget" />
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-sm-6 col-xs-12">
                <h5>Carousel Widget</h5>
                <div class="modal-box" :class="{'active' : selectedWidgetType === 'carouselWidgetModal'}">
                  <b-form-radio name="widget-type" v-model="selectedWidgetType" value="carouselWidgetModal"></b-form-radio>
                  <div class="radio-img">
                    <img src="/images/carousel-widget.png" class="img-fluid" alt="Carousel Widget" />
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-sm-6 col-xs-12">
                <h5>Banner Widget</h5>
                <div class="modal-box" :class="{'active' : selectedWidgetType === 'bannerWidgetModal'}">
                  <b-form-radio name="widget-type" v-model="selectedWidgetType" value="bannerWidgetModal"></b-form-radio>
                  <div class="radio-img">
                    <img src="/images/banner-widget.png" class="img-fluid" alt="Banner Widget" />
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-sm-6 col-xs-12">
                <h5>Department Widget</h5>
                <div class="modal-box" :class="{'active' : selectedWidgetType === 'departmentWidgetModal'}">
                  <b-form-radio name="widget-type" v-model="selectedWidgetType" value="departmentWidgetModal"></b-form-radio>
                  <div class="radio-img">
                    <img src="/images/department-widget.png" class="img-fluid" alt="Department Widget" />
                  </div>
                </div>
              </div>
            </div>
          </b-form-group>
        </div>
      </div>

      <div slot="modal-footer">
        <button class="btn btn-primary" @click="selectWidgetType()">Next</button>
      </div>
    </b-modal>

    <b-modal size="lg" ref="subscriptionWidgetModal">
      <div class="modal-title" slot="modal-header">
        <div class="modal-widget">
          <h5>Add a Widget</h5>
          <img src="/icons/arrow-right-gray.png" class="img-fluid" alt="Add a Widget" />
          <h4>Subscription Widget</h4>
        </div>
        <span @click="hideModal('subscriptionWidgetModal')">&times;</span>
      </div>

      <div class="modal-body">
        <div class="subscription-content">
          <h6>PREVIEW</h6>
          <div class="preview-box">
            <img class="image-preview" :src="subscriptionImage || '/images/no-image.jpg'" alt="Image Preview" />
            <div class="mailing-list">
              <h5>Join our email mailing list!</h5>
              <p>SAVE UP TO 80% OFF</p>
              <input
                type-="text"
                disabled
                class="form-control"
                placeholder="Enter Email Address" />
              <button disabled class="btn btn-primary">Submit</button>
            </div>
          </div>
        </div>
        <div class="subscription-image-upload">
          <b-form @submit.stop.prevent>
            <b-form-group label="Widget Name *" label-for="subscription-widget-name" class="mt-3">
              <b-form-input
                id="subscription-widget-name"
                type="text"
                placeholder="Enter the widget name"
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Title" label-for="subscription-widget-title">
              <b-form-input
                id="subscription-widget-title"
                placeholder="Join our email mailing list!"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-22" label="Subtitle" label-for="subscription-widget-subtitle">
              <b-form-input
                id="subscription-widget-subtitle"
                placeholder="SAVE UP TO 80% OFF"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-23" label="Button Text" label-for="subscription-widget-button">
              <b-form-input
                id="subscription-widget-button"
                placeholder="Submit"
              ></b-form-input>
            </b-form-group>

            <div class="sub-upload">
              <img class="upload-preview" :src="subscriptionImage || '/images/no-image.jpg'"/>
              <div class="upload-image">
                <h5>Image</h5>
                <p>Upload an image from your computer</p>
                <input type="file"
                       accept="image/*"
                       class="d-none"
                       ref="subscription-file-upload"
                       @change="subscriptionFileUpload"/>
                <button class="btn btn-outline-primary" @click="triggerFileUpload('subscription-file-upload')">
                  <img src="/icons/upload-icon.png" alt="Upload" />
                  &nbsp; Change Image</button>
              </div>
            </div>

          </b-form>
        </div>
      </div>

      <div class="footer" slot="modal-footer">
        <div class="modal-widget-footer">
          <div class="switch">
            <h5>Hide Widget Name</h5>
            <input type="checkbox" class="toggle" id="toggle-subscription-widget-name"/>
            <label for="toggle-subscription-widget-name">
              <span class="on">Yes</span>
              <span class="off">No</span>
            </label>
          </div>
          <button class="btn btn-primary">Add Widget</button>
        </div>
      </div>
    </b-modal>

    <b-modal ref="productWidgetModal">
      <div class="modal-title" slot="modal-header">
        <div class="modal-widget">
          <h5>Add a Widget</h5>
          <img src="/icons/arrow-right-gray.png" class="img-fluid" alt="Add Widget" />
          <h4>Product Widget</h4>
        </div>
        <span @click="hideModal('productWidgetModal')">&times;</span>
      </div>

      <div class="modal-body">
        <b-form-group>
          <b-form-group id="product-widget-form" label="Widget Name *" label-for="product-widget-name">
            <b-form-input id="product-widget-name" placeholder="Enter name"></b-form-input>
          </b-form-group>
        </b-form-group>
      </div>

      <div class="footer" slot="modal-footer">
        <div class="modal-widget-footer">
          <div class="switch">
            <h5>Hide Widget Name</h5>
            <input type="checkbox" class="toggle" id="toggle-product-widget"/>
            <label for="toggle-product-widget">
              <span class="on">Yes</span>
              <span class="off">No</span>
            </label>
          </div>
          <button class="btn btn-primary">Add Widget</button>
        </div>
      </div>
    </b-modal>

    <b-modal size="lg" ref="carouselWidgetModal">
      <div class="modal-title" slot="modal-header">
        <div class="modal-widget">
          <h5>Add a Widget</h5>
          <img src="/icons/arrow-right-gray.png" class="img-fluid" alt="Add Widget" />
          <h4>Carousel Widget</h4>
        </div>
        <span @click="hideModal('carouselWidgetModal')">&times;</span>
      </div>
      <div class="modal-body">
        <div class="carousel-content">
          <h6>PREVIEW</h6>
          <div class="preview-box products-slider">
            <swiper ref="carouselProductsSlider" :options="swiperOption">
              <swiper-slide v-if="!carouselImages.length">
                <img src="/images/no-image.jpg" class="img-fluid" alt="Preview Image" />
              </swiper-slide>
              <swiper-slide v-else v-for="(image, index) of carouselImages" :key="index">
                <img :src="image" class="img-fluid carousel-image" alt="Preview Image" />
              </swiper-slide>
            </swiper>

            <div class="swiper-button-prev" slot="button-prev" @click="swiper.slidePrev()" />
            <div class="swiper-button-next" slot="button-next" @click="swiper.slideNext()" />

          </div>

        </div>
        <b-form-group label="Widget Name *" label-for="carousel-widget-name" class="mt-3">
          <b-form-input
            id="carousel-widget-name"
            type="text"
            placeholder="Enter the widget name"
          ></b-form-input>
        </b-form-group>
        <div class="carousel-img-upload">
          <h5>Images</h5>
          <p>Upload multiple images from your computer</p>
          <div class="row d-none">
            <div class="col-md-4">
              <img src="/images/no-image.jpg" class="img-fluid" alt="Image Preview" />
            </div>
            <div class="col-md-4">
              <img src="/images/no-image.jpg" class="img-fluid" alt="Image Preview" />
            </div>
            <div class="col-md-4">
              <img src="/images/no-image.jpg" class="img-fluid" alt="Image Preview" />
            </div>
          </div>
          <div class="image-upload" @click="triggerFileUpload('carousel-file-upload')">
            <input type="file"
                   accept="image/*"
                   class="d-none"
                   ref="carousel-file-upload"
                   multiple
                   @change="carouselFileUpload"/>
            <img src="/icons/upload-icon.png" alt="Upload" />
            <p>Click here or drag images to upload</p>
          </div>
        </div>
      </div>
      <div class="footer" slot="modal-footer">
        <div class="modal-widget-footer">
          <div class="switch">
            <h5>Hide Widget Name</h5>
            <input type="checkbox" class="toggle" id="toggle-carousel-widget"/>
            <label for="toggle-carousel-widget">
              <span class="on">Yes</span>
              <span class="off">No</span>
            </label>
          </div>
          <button class="btn btn-primary">Add Widget</button>
        </div>
      </div>
    </b-modal>

    <b-modal ref="bannerWidgetModal">
      <div class="modal-title" slot="modal-header">
        <div class="modal-widget">
          <h5>Add a Widget</h5>
          <img src="/icons/arrow-right-gray.png" class="img-fluid" alt="Add Widget" />
          <h4>Banner Widget</h4>
        </div>
        <span @click="hideModal('bannerWidgetModal')">&times;</span>
      </div>

      <div class="modal-body">

      </div>

      <div class="footer" slot="modal-footer">
        <div class="modal-widget-footer">
          <div class="switch">
            <h5>Hide Widget Name</h5>
            <input type="checkbox" class="toggle" id="toggle-banner-widget"/>
            <label for="toggle-banner-widget">
              <span class="on">Yes</span>
              <span class="off">No</span>
            </label>
          </div>
          <button class="btn btn-primary">Add Widget</button>
        </div>
      </div>
    </b-modal>

    <b-modal ref="departmentWidgetModal">
      <div class="modal-title" slot="modal-header">
        <div class="modal-widget">
          <h5>Add a Widget</h5>
          <img src="/icons/arrow-right-gray.png" class="img-fluid" alt="Add Widget" />
          <h4>Department Widget</h4>
        </div>
        <span @click="hideModal('departmentWidgetModal')">&times;</span>
      </div>

      <div class="modal-body">
        <div class="modal-body">
          <b-form-group>
            <b-form-group id="department-widget-form" label="Widget Name *" label-for="department-widget-name">
              <b-form-input id="department-widget-name" placeholder="Enter name"></b-form-input>
            </b-form-group>
          </b-form-group>
        </div>
      </div>

      <div class="footer" slot="modal-footer">
        <div class="modal-widget-footer">
          <div class="switch">
            <h5>Hide Widget Name</h5>
            <input type="checkbox" class="toggle" id="toggle-department-widget"/>
            <label for="toggle-department-widget">
              <span class="on">Yes</span>
              <span class="off">No</span>
            </label>
          </div>
          <button class="btn btn-primary">Add Widget</button>
        </div>
      </div>
    </b-modal>
  </main>
</template>

<script>
  import {Container, Draggable} from "vue-smooth-dnd";
  import HomePageApiService from '@/api-services/homepage.service';

  export default {
    name: 'AdminDashboard',
    components: {Container, Draggable},
    data() {
      return {
        selectedWidgetType: '',
        swiperOption: {
          loop: false,
          slidesPerView: '1',
          spaceBetween: 0,
          draggable: true,
          allowTouchMove: true,
        },
        subscriptionImage: null,
        carouselImages: []
      };
    },
    computed: {
      homepageSections: {
        get() {
          return this.$store.state.homepage;
        },
        set(value) {
          this.$store.commit('setHomepageSection', value);
        }
      },
      swiper() {
        return this.$refs.carouselProductsSlider.swiper;
      },
    },
    async mounted() {
      let response;
      if (!this.homepageSections) {
        let resp = await HomePageApiService.getSections();
        response = resp.data.data;
      } else {
        response = this.homepageSections;
      }


      let productSections1 = response.filter(elem => elem.widget_type === '2');
      let productSections2 = response.filter(elem => elem.widget_type === '7');
      let productSections = [...productSections1, ...productSections2];

      let allSKUs = [];
      let allProducts = [];
      productSections.forEach((section) => {
        section.data.forEach((item) => {
          item.competitors = null;
          item.similars = null;
          item.videos = null;

          allProducts.push(item);
          allSKUs.push(item.sku);
        });
      });

      this.$store.commit('addProductsRange', allProducts);
      this.$store.commit('setHomepageSection', response);
      localStorage.setItem('homepage', JSON.stringify(response));

      if (this.$store.state.activeUser && !this.$store.state.activeUser.store && !localStorage.getItem('store')) {
        // this.$refs.storeModal.showModal();
      }
    },
    methods: {
      onDrop(dropResult) {
        this.homepageSections = this.applyDrag(this.homepageSections, dropResult);
      },
      applyDrag(arr, dragResult) {
        const {removedIndex, addedIndex, payload} = dragResult;
        if (removedIndex === null && addedIndex === null) return arr;

        const result = [...arr];
        let itemToAdd = payload;

        if (removedIndex !== null) {
          itemToAdd = result.splice(removedIndex, 1)[0];
        }

        if (addedIndex !== null) {
          result.splice(addedIndex, 0, itemToAdd);
        }

        return result;
      },
      hideModal(modalRef) {
        this.$refs[modalRef].hide();
      },
      showModal(modalRef) {
        this.$refs[modalRef].show();
      },
      selectWidgetType() {
        this.hideModal('addWidgetModal');
        this.showModal(this.selectedWidgetType);
        this.selectedWidgetType = '';
      },
      triggerFileUpload(id) {
        this.$refs[id].click();
      },
      subscriptionFileUpload() {
        const files = this.$refs['subscription-file-upload'].files;
        this.subscriptionImage = URL.createObjectURL(files[0]);
      },
      carouselFileUpload() {
        const files = [...this.$refs['carousel-file-upload'].files];
        const fileUrls = files.map(file => {
          return URL.createObjectURL(file);
        });
        this.carouselImages = [...this.carouselImages, ...fileUrls];
      }
    }
  };
</script>

<style lang="scss">
  @import '@/assets/scss/home.scss';
  @import '@/assets/scss/modal-common.scss';

  .add-widget {
    h5 {
      font-size: 18px;
      line-height: 21px;
      color: var(--text);
    }

    .modal-box {
      border: 1px solid #eee;
      min-height: 202px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 8px;
      margin-bottom: 15px;

      &.active {
        border: 1px solid var(--primary);
      }

      .radio-img {
        flex: 1;
        display: flex;
        align-items: center;
      }
    }
  }

  .footer {
    width: 100%;

    .modal-widget-footer {
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items: center;

      .switch {
        h5 {
          font-size: 14px;
          line-height: 16px;
          color: var(--text);
          margin-bottom: 8px;
        }

        input[type="checkbox"] {

          &.toggle {

            opacity: 0;
            position: absolute;
            left: -99999px;

            & + label {

              height: 30px;
              line-height: 30px;
              background-color: #ccc;
              padding: 0px 8px;
              border-radius: 25px;
              display: inline-block;
              position: relative;
              cursor: pointer;
              transition: all .25s ease-in;
              box-shadow: inset 0px 0px 2px rgba(0, 0, 0, .5);

              &:before, &:hover:before {

                content: ' ';
                position: absolute;
                top: 2px;
                left: 2px;
                width: 25px;
                height: 25px;
                background: #fff;
                z-index: 2;
                transition: all .25s ease-in;
                border-radius: 14px;

              }

              .off, .on {
                color: #fff;
              }

              .off {
                margin-left: 37px;
                display: inline-block;
              }

              .on {
                display: none;
              }

            }

            &:checked + label {

              .off {
                display: none;
              }

              .on {
                margin-right: 32px;
                display: inline-block;
              }

            }

            &:checked + label, &:focus:checked + label {

              background-color: var(--primary);

              &:before, &:hover:before {

                background-position: 0 0;
                top: 2px;
                left: 100%;
                margin-left: -28px;

              }

            }

          }
        }
      }
    }
  }

  .modal-title {
    .modal-widget {
      display: flex;
      justify-content: flex-start;

      h5 {
        font-size: 16px;
        line-height: 19px;
        color: #434343;
        mix-blend-mode: normal;
        opacity: 0.3;
        margin-right: 15px;
      }

      h4 {
        font-size: 16px;
        line-height: 19px;
        color: #434343;
        margin-bottom: 0;
        margin-left: 15px;
      }
    }

  }

  .subscription-content, .carousel-content {
    h6 {
      font-size: 11px;
      line-height: 13px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: var(--text);
      mix-blend-mode: normal;
      opacity: 0.52;

    }

    .preview-box {
      display: flex;
      justify-content: space-between;
      border: 1px solid #dee2e6;
      border-radius: 5px;
      padding: 15px;
      position: relative;

      .image-preview {
        width: 210px;
        height: 160px;
      }

      .carousel-image {
        max-width: 500px;
        max-height: 220px;
      }

      .mailing-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        padding: 0 50px;

        h5 {
          font-size: 17.193px;
          line-height: 20px;
          color: var(--text);
        }

        p {
          font-size: 10.7456px;
          line-height: 13px;
          letter-spacing: 0.429825px;
          color: #6D7179;
          margin-bottom: 0;
        }

        input {
          &::placeholder {
            color: #80848A;
            mix-blend-mode: normal;
            opacity: 0.7;
          }
        }
      }

      .swiper-slide {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .subscription-image-upload {
    .sub-upload {
      display: flex;
      justify-content: space-between;
      border-radius: 5px;

      .upload-preview {
        width: 140px;
        height: 110px;
      }

      .upload-image {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        padding: 0 50px;


        .btn-outline-primary {
          white-space: nowrap;
        }
      }
    }

    input {
      &::placeholder {
        color: #80848A;
        mix-blend-mode: normal;
        opacity: 0.7;
      }
    }
  }

  .carousel-img-upload {
    h5 {
      font-weight: 500;
      font-size: 16px;
      line-height: 26px;
      color: var(--text);
      margin-bottom: 0;
    }

    p {
      font-size: 13px;
      line-height: 18px;
      color: var(--text);
      mix-blend-mode: normal;
      opacity: 0.5;
      margin-bottom: 10px;
    }

    .image-upload {
      min-height: 128px;
      border: 1px dashed var(--primary);
      border-radius: 2px;
      background: rgba(62, 206, 62, 0.1);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin-top: 30px;

      p {
        margin-top: 10px;
        font-size: 16px;
        line-height: 19px;
        color: var(--primary);
        font-weight: 600;
      }
    }
  }
@media (max-width: 576px) {
  .disable-drag {
    .swiper-container {
      margin: 0 15px;
    }
    .swiper-button-prev {
      left: 0 !important;
    }
    .swiper-button-next {
      right: 0 !important;
    }
  }
}
</style>
