<template>
  <section class="subscribe widget" :class="{'editable': editable}">
    <WidgetHeader name="Subscription" :id="id" @remove="remove" @updateHidden="updateHidden" :hidden="hidden" :master="master" @updateAssociatedLocations="updateAssociatedLocations" :associatedLocations="associatedLocations" v-if="editable" />
    <div class="d-flex align-items-center justify-between w-100 title-bar mb-4" v-if="editable || title">
      <div class="flex-grow-1 d-flex align-items-center">
        <input v-if="editable" class="form-control" placeholder="Title for Subscription (optional)" v-model="intTitle" />
        <h4 class="mb-0" v-else-if="title" v-html="title" />
      </div>
    </div>
    <div class="align-items-center subscribe-content overflow-hidden" :class="{'bg-center' : bg}" :style="bg ? `background-image: url(${bg})` : ''" v-if="intData">
      <div class="row align-items-center h-100">
        <a href="#" class="image-bt" @click.prevent="$refs.imageUploader.click()" v-if="editable" v-b-tooltip.hover title="Change Background Image" aria-label="Change Background Image">
          <svg width="15" height="13" xmlns="http://www.w3.org/2000/svg"><g fill="#FFF" fill-rule="nonzero"><ellipse cx="7.5" cy="7" rx="2.143" ry="2"/><path d="M5.25 0L3.877 1.389H1.5c-.825 0-1.5.625-1.5 1.389v8.333c0 .764.675 1.389 1.5 1.389h12c.825 0 1.5-.625 1.5-1.389V2.778c0-.764-.675-1.39-1.5-1.39h-2.377L9.75 0h-4.5zM7.5 10.417c-2.07 0-3.75-1.556-3.75-3.473 0-1.916 1.68-3.472 3.75-3.472 2.07 0 3.75 1.556 3.75 3.472 0 1.917-1.68 3.473-3.75 3.473z"/></g></svg>
        </a>
        <a href="#" class="logo-bt" @click.prevent="$refs.logoUploader.click()" v-if="editable && !bg" v-b-tooltip.hover title="Change Logo" aria-label="Change Logo">
          <svg width="15" height="13" xmlns="http://www.w3.org/2000/svg"><g fill="#FFF" fill-rule="nonzero"><ellipse cx="7.5" cy="7" rx="2.143" ry="2"/><path d="M5.25 0L3.877 1.389H1.5c-.825 0-1.5.625-1.5 1.389v8.333c0 .764.675 1.389 1.5 1.389h12c.825 0 1.5-.625 1.5-1.389V2.778c0-.764-.675-1.39-1.5-1.39h-2.377L9.75 0h-4.5zM7.5 10.417c-2.07 0-3.75-1.556-3.75-3.473 0-1.916 1.68-3.472 3.75-3.472 2.07 0 3.75 1.556 3.75 3.472 0 1.917-1.68 3.473-3.75 3.473z"/></g></svg>
        </a>
        <a href="#" class="remove-logo-bt" @click.prevent="removeLogo" v-if="editable && intData.logo" v-b-tooltip.hover title="Remove Logo" aria-label="Remove Logo">
          <svg width="14" height="16" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-8 -7)" fill-rule="nonzero" fill="none"><circle fill="#E2E2E3" cx="15" cy="15" r="15"/><path d="M21 13v8c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2v-8h12zm-3-6c.6 0 1 .4 1 1v2h3v2H8v-2h3V8c0-.6.4-1 1-1zm-1 2h-4v1h4V9z" fill="#90939A"/></g></svg>
        </a>
        <a href="#" class="remove-image-bt" @click.prevent="removeImage" v-if="bg && editable" v-b-tooltip.hover title="Remove Background Image" aria-label="Remove Background Image">
          <svg width="14" height="16" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-8 -7)" fill-rule="nonzero" fill="none"><circle fill="#E2E2E3" cx="15" cy="15" r="15"/><path d="M21 13v8c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2v-8h12zm-3-6c.6 0 1 .4 1 1v2h3v2H8v-2h3V8c0-.6.4-1 1-1zm-1 2h-4v1h4V9z" fill="#90939A"/></g></svg>
        </a>

        <input type="file" ref="imageUploader" class="d-none" @change="uploadImage" v-if="editable" />
        <input type="file" ref="logoUploader" class="d-none" @change="uploadImage($event, 'logo')" v-if="editable" />

        <div v-if="!bg" class="phone-screen">
          <img v-if="logo" class="phone-logo" :src="logo" :alt="$store.state.settings.businessName">
        </div>
        <div class="loading-image small d-flex align-items-center" v-if="loading">
          <div class="spinner-border spinner-border-sm mr-3"></div>
          uploading {{ loading }}...
        </div>
        <div class="overlay" v-if="loading"></div>
        <div class="offset-md-5 col-md-7 offset-lg-6 col-lg-6 d-flex align-items-center justify-content-center" style="z-index: 3;">
          <div class="flash-deal">
            <div class="position-relative">
              <a @click.prevent="$refs.title.focus()" href="#" class="edit-title-icon" v-if="editable" v-b-tooltip.hover title="Edit Title Text" aria-label="Edit Title Text">
                <svg width="9" height="10" xmlns="http://www.w3.org/2000/svg"><path d="M8.489 3.316l-.246.273L5.769.843 6.015.57C6.456.08 7.1-.113 7.703.066c.603.18 1.075.702 1.237 1.373.162.67-.01 1.386-.451 1.877zM7.448 4.472L5.807 6.295 3.594 8.753C3.314 9.04.452 9.97.452 9.97a.299.299 0 01-.357-.074.388.388 0 01-.068-.397s.838-3.18 1.095-3.49l2.213-2.459 1.641-1.823 2.472 2.746z" fill="#C02838" fill-rule="evenodd"/></svg>
              </a>
              <div ref="titleWrapper" @focus="editingText = true" @blur="editingText = false" tabindex="0">
                <h3 v-if="colors" ref="title" :style="{color: colors.hex}" class="pt-0" v-html="intData.title || 'Join our email mailing list'" @focus="editingText = true" :contenteditable="editable" @blur="editText"></h3>
                <chrome-picker v-show="editable && editingText" v-model="colors" v-if="colors" />
              </div>
            </div>
            <div class="d-flex flex-column flex-sm-row mt-3 position-relative" :class="{'interacting': isInteracting}">
              <div class="position-relative flex-grow-1">
                <a @click.prevent="$refs.placeholder.focus()" href="#" class="edit-title-icon" v-if="editable" v-b-tooltip.hover title="Edit Placeholder" aria-label="Edit Placeholder">
                  <svg width="9" height="10" xmlns="http://www.w3.org/2000/svg"><path d="M8.489 3.316l-.246.273L5.769.843 6.015.57C6.456.08 7.1-.113 7.703.066c.603.18 1.075.702 1.237 1.373.162.67-.01 1.386-.451 1.877zM7.448 4.472L5.807 6.295 3.594 8.753C3.314 9.04.452 9.97.452 9.97a.299.299 0 01-.357-.074.388.388 0 01-.068-.397s.838-3.18 1.095-3.49l2.213-2.459 1.641-1.823 2.472 2.746z" fill="#C02838" fill-rule="evenodd"/></svg>
                </a>
                <input v-if="editable" ref="placeholder" @blur="editPlaceholder" v-model="intData.placeholder" type="text" class="form-control" placeholder="Enter Email" aria-label="Enter Email" />
                <input v-else ref="subscriberEmail" id="subscriberEmail" @blur="stopInteracting" v-model="subscriberEmail" type="text" class="form-control" :placeholder="intData.placeholder || 'Enter Email'" aria-label="Enter Email" @keypress.enter="subscribe">
              </div>
              <button type="button" class="d-none d-sm-block btn btn-primary ml-sm-2 submit-btn" @click="subscribe">
                <b>Submit</b>
              </button>
              <button type="button" class="d-sm-none btn btn-primary ml-sm-3 submit-btn" @click="startInteracting">
                <b>Subscribe</b>
                <svg width="25" height="24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g fill="none" fill-rule="evenodd"><image x="-41" y="-43" width="99" height="95" /><g fill="#FFF" fill-rule="nonzero"><path d="M21.354 21a.794.794 0 01-.252-.042L.53 13.87a.79.79 0 01-.11-1.444L23.856.088a.78.78 0 01.815.057c.24.172.363.464.32.758L22.128 20.33a.788.788 0 01-.773.671zM2.756 12.972l17.963 6.19 2.5-16.96-20.463 10.77z"/><path d="M9.787 24A.787.787 0 019 23.217v-7.043c0-.197.076-.39.21-.534L23.638.25A.79.79 0 0124.75.21c.318.295.335.79.039 1.108L10.574 16.482v4.35l2.626-3.556a.791.791 0 011.1-.167.78.78 0 01.168 1.095l-4.046 5.478a.793.793 0 01-.635.318z"/></g></g></svg>
              </button>
            </div>
            <small id="subscriberEmailSuccess" ref="subscriberEmailSuccess" class="d-none form-text">
              Successfully subscribed!
            </small>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import SubscriberApiService from '@/api-services/subscriber.service';
import AdminService from '@/api-services/admin.service';
import { Chrome } from 'vue-color';
import { debounce } from 'debounce';

export default {
  name: 'Subscription',
  props: {
    id: {
      default: null
    },
    editable: {
      default: false
    },
    title: {
      default: ''
    },
    data: {
      default: null
    },
    master: {
      default: false
    },
    hidden: {
      default: true
    },
    associatedLocations: {
      default: null
    }
  },
  components: {
    'chrome-picker': Chrome
  },
  data() {
    return {
      intTitle: '',
      subscriberEmail: null,
      isInteracting: false,
      loading: false,
      editingText: false,
      intData: {},
      colors: null,
      bg: null,
      logo: null,
    };
  },
  created() {
    this.intTitle = this.title;
  },
  computed: {
    options() {
      if(this.$store.state.homepage) {
        const section = this.$store.state.homepage.find(x => x.widget_type === '3');
        if ( section ) {
          return section.data;
        }
      }
      return null;
    }
  },
  mounted() {
    this.intData = this.data;
    this.bg = this.intData.overrideImage;
    this.logo = this.intData.logo || this.$store.state.settings.logo || '/images/logo.svg';
    this.colors = { hex: this.intData.color || '#000' };
  },
  methods: {
    preventNav(evt) {
      if (!this.loading) return;
      evt.preventDefault();
      evt.returnValue = '';
    },
    remove() {
      this.$emit('remove');
    },
    removeImage() {
      this.$swal({
        title: 'Remove Background Image',
        html: `Are you sure you want to remove this background image?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.value) {
          delete this.intData.overrideImage;
          this.bg = null;
          this.onChange(this.intData);
        }
      });
    },
    removeLogo() {
      this.$swal({
        title: 'Remove Logo',
        html: `Are you sure you want to remove this logo?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.value) {
          delete this.intData.logo;
          this.logo = this.$store.state.settings.logo;
          this.onChange(this.intData);
        }
      });
    },
    editText(val) {
      this.intData.title = val.target.innerHTML;
      this.onChange(this.intData);
      this.editingText = false;
    },
    editPlaceholder() {
      this.onChange(this.intData);
    },
    uploadImage(evt, type = null) {
      if(!this.loading) {
        this.loading = type || 'image';
        if (evt.dataTransfer) {
          var file = evt.dataTransfer.files[0];
        } else {
          var file = evt.target.files[0];
        }
        this.uploadingImage = true;
        AdminService.uploadImage(file).then(response => {
          this.loading = false;
          this.uploadingImage = false;
          if(type == 'logo') {
            this.intData.logo = response.data.url;
            this.logo = response.data.url;
          } else {
            this.intData.overrideImage = response.data.url;
            this.bg = response.data.url;
          }
          this.onChange(this.intData);
        })
        .catch(() => {
          this.loading = false;
          this.$swal('Error', 'Error while uploading image', 'error');
        });
      }
    },
    onChange(data) {
      this.$emit('onChange', data);
    },
    updateAssociatedLocations(val) {
      this.$emit('updateAssociatedLocations', val);
    },
    subscribe() {
      if(!this.editable) {
        let target = this.$refs.subscriberEmailSuccess;
        target.classList.add('d-none');
        target.classList.remove('error');
        if (!this.subscriberEmail) return;
        SubscriberApiService.subscribe(this.subscriberEmail)
        .then((response) => {
          this.carouselSlides = response.data.data;
          target.classList.remove('d-none');
          target.innerText = 'Successfully subscribed!';
          this.subscriberEmail = '';
          this.stopInteracting();
        })
        .catch((error) => {
          target.classList.remove('d-none');
          target.classList.add('error');
          const errorResponse = error.response && error.response.data && error.response.data.errors;
          if (errorResponse['email'] && errorResponse['email'].length
            && errorResponse['email'][0] === 'The email has already been taken.') {
            target.innerText = 'This email has already been submitted.';
          } else {
            target.innerText = 'Something went wrong, please try again later.';
          }
        });
      }
    },
    startInteracting() {
      if(!this.editable) {
        if(!this.isInteracting) {
          this.$refs.subscriberEmail.focus();
          this.isInteracting = true;
        } else {
          this.subscribe();
        }
      }
    },
    stopInteracting(event) {
      if(!this.editable) {
        if(!(event && event.relatedTarget && event.relatedTarget.classList.contains('submit-btn')))
          this.isInteracting = false;
      }
    },
    updateHidden(val) {
      this.$emit('updateHidden', val);
      if(!val)
      this.colors = { hex: this.intData.color || '#000' };
    }
  },
  beforeMount() {
    window.addEventListener('beforeunload', this.preventNav);
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.preventNav);
  },
  watch: {
    colors: debounce(function(val) {
      if(val && this.intData.color != val.hex) {
        this.intData.color = val.hex;
        this.onChange(this.intData);
      }
    }, 2000),
    intTitle: debounce(function(value) {
      this.$emit('updateTitle', value);
    }, 1500)
  }
};
</script>
<style lang="scss" scoped>
  .subscribe {
    .subscribe-content {
      border-radius: 13px;
      background-repeat: no-repeat;
      background-size: auto 126%;
      background-image: url('/images/subscribe-image.webp');
      background-color: #e7eaef;
      max-height: 345px;
      padding: 50px 0;
      height: 345px;
      position: relative;
      &.bg-center {
        background-position: center;
      }
      img {
        max-height: 345px;
      }
      .flash-deal {
        padding-right: 30px;
        width: 100%;
      }
    }
    .image-bt,
    .logo-bt,
    .remove-logo-bt,
    .remove-image-bt {
      z-index: 1;
      width: 30px;
      height: 30px;
      border-radius: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 20px;
    }
    .image-bt{
      background: var(--primary);
      left: 20px;
    }
    .logo-bt {
      background: var(--primary);
      left: 350px;
      top: 85px;
    }
    .remove-logo-bt {
      background: #E2E2E3;
      left: 390px;
      top: 85px;
    }
    .remove-image-bt {
      background: #E2E2E3;
      left: 60px;
    }
    [contenteditable=true] {
      border: 1px dashed #dadada;
      &:focus {
        outline: none;
      }
    }
    .edit-title-icon {
      position: absolute;
      right: -10px;
      top: -10px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 20px;
      svg * {
        fill: var(--primary);
      }
    }
    h3 {
      max-width: 500px;
    }
    .form-control {
      height: 48px;
      box-shadow: 0 2px 2px 0 rgba(34,44,73,0.04);
      border-radius: 8px;
    }
    .btn {
      height: 48px;
      box-shadow: 0 2px 2px 0 rgba(34,44,73,0.04);
      min-width: 114px;
      border-radius: 8px;
    }

    .phone-screen {
      position: absolute;
      -webkit-transform: rotateX(-45deg) rotateZ(45deg) scale(3.2);
      transform: rotateX(-45deg) rotateZ(45deg) scale(3.2);
      width: 90px;
      height: 160px;
      top: 100px;
      left: 183px;
      display: flex;
      align-items: center;
      justify-content: center;

      .phone-logo {
        width: 80%;
        -webkit-backface-visibility: hidden;
      }
    }

    .overlay {
      width: 100%;
      height: 100%;
      position: absolute;
      background: #fff;
      opacity: .9;
      left: 0;
      z-index: 2;
    }
    .loading-image {
      position: absolute;
      bottom: 26px;
      left: 26px;
      z-index: 3;
    }

  }
  :deep(.vc-chrome) {
    position: absolute;
    z-index: 2;
  }


  @media screen and (max-width: 991px) {
    .subscribe {
      .subscribe-content {
        height: 260px;
      }
      .phone-screen {
        top: 56px;
        left: 124px;
        transform: rotateX(-45deg) rotateZ(45deg) scale(2.4);
      }
    }
  }

  @media screen and (max-width: 767px) {
    .subscribe {
      .subscribe-content {
        height: 200px;
        padding: 0;
        background-image: none;
        position: relative;

        &:after {
          content: '';
          width: 100%;
          height: 100%;
          display: block;
          position: absolute;
          background-image: linear-gradient(90deg, #ECEFF4 0%, rgba(236,239,244,0.00) 100%);
          top: 0;
          left: 0;
        }
        .phone-screen {
          display: none;
        }
        .flash-deal {
          padding: 0 32px;
          max-width: 600px;
        }
      }
    }
  }
  @media screen and (max-width: 576px) {
    .subscribe {
      h3 {
        padding: 0;
        text-align: center;
        font-size: 24px;
      }

      .subscribe-content {
        background: none;
        .flash-deal {
          max-width: 100%;
        }
      }
      .btn {
        min-width: 0;
      }
    }
    .form-control {
      max-width: 100%;
    }
    .flash-deal {
      align-items: center;
      max-width: 560px;
      margin: 0 auto;
      padding-right: 0;
    }
    .submit-btn {
      position: absolute;
      top: 0;
      right: 0;
      overflow: hidden;
      min-width: 0;
      width: 100%;
      bottom: 0;
      height: auto;
      transition: all .2s;
      padding: 0;
      svg {
        transition: transform .2s;
        transform: scale(0);
        margin-left: -2px;
        display: none;
      }
    }
    #subscriberEmail {
      width: calc(100% - 56px);
      margin-left: 1px;
    }
    .interacting {
      .submit-btn {
        width: 46px;
        text-indent: -100px;
        svg {
          transform: scale(1);
          display: block;
        }
      }
    }
  }
</style>
