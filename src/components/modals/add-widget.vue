<template>
  <b-modal size="xl" class="modal-box" ref="addWidgetModal" title="Add Widget" header-class="bg-transparent text" hide-footer centered tabindex="0">
    <div class="d-flex flex-row justify-content-start align-items-start p-0">
      <div class="rounded-lg border ai-widget-banner">
        <svg class="float-right mr-5" width="139" height="183" viewBox="0 0 139 183" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.1"><path d="M136.01 15.901C135.525 18.3146 137.089 20.6742 139.503 21.1597C141.916 21.6451 144.276 20.081 144.761 17.6673C145.247 15.2537 143.683 12.8941 141.269 12.4086C138.855 11.9232 136.496 13.4873 136.01 15.901Z" fill="#272342"/><path d="M110.213 10.6939C109.728 13.1075 111.292 15.4672 113.706 15.9527C116.119 16.4381 118.479 14.8739 118.964 12.4603C119.45 10.0467 117.886 7.68703 115.472 7.20161C113.058 6.71619 110.699 8.28032 110.213 10.6939Z" fill="#272342"/><path d="M84.4047 5.4869C83.9193 7.90051 85.4835 10.2602 87.8971 10.7456C90.3107 11.231 92.6704 9.66691 93.1558 7.2533C93.6413 4.83969 92.0771 2.48 89.6635 1.99458C87.2499 1.50916 84.8902 3.07328 84.4047 5.4869Z" fill="#272342"/><path d="M58.6118 0.283772C58.1263 2.69738 59.6905 5.05707 62.1041 5.54249C64.5177 6.02791 66.8774 4.46379 67.3629 2.05018C67.8483 -0.363436 66.2841 -2.72313 63.8705 -3.20854C61.4569 -3.69396 59.0972 -2.12984 58.6118 0.283772Z" fill="#272342"/><path d="M32.8032 -4.91935C32.3178 -2.50574 33.8818 -0.14605 36.2955 0.339369C38.7091 0.824788 41.0688 -0.739336 41.5542 -3.15295C42.0396 -5.56656 40.4754 -7.92625 38.0618 -8.41167C35.6482 -8.89709 33.2886 -7.33297 32.8032 -4.91935Z" fill="#272342"/><path d="M131.356 38.9439C130.87 41.3575 132.435 43.7172 134.848 44.2026C137.262 44.688 139.622 43.1239 140.107 40.7103C140.592 38.2967 139.028 35.937 136.615 35.4516C134.201 34.9662 131.841 36.5303 131.356 38.9439Z" fill="#272342"/><path d="M105.561 33.7369C105.076 36.1505 106.64 38.5102 109.053 38.9956C111.467 39.481 113.827 37.9169 114.312 35.5033C114.797 33.0897 113.233 30.73 110.82 30.2446C108.406 29.7592 106.046 31.3233 105.561 33.7369Z" fill="#272342"/><path d="M79.7524 28.5338C79.267 30.9474 80.8311 33.3071 83.2447 33.7925C85.6583 34.2779 88.018 32.7138 88.5034 30.3002C88.9888 27.8865 87.4247 25.5269 85.0111 25.0415C82.5974 24.556 80.2378 26.1202 79.7524 28.5338Z" fill="#272342"/><path d="M53.9555 23.3306C53.4701 25.7443 55.0342 28.1039 57.4478 28.5893C59.8614 29.0748 62.2211 27.5106 62.7065 25.097C63.192 22.6834 61.6278 20.3237 59.2142 19.8383C56.8006 19.3529 54.4409 20.917 53.9555 23.3306Z" fill="#272342"/><path d="M28.1489 18.1119C27.6635 20.5255 29.2275 22.8852 31.6412 23.3706C34.0548 23.856 36.4145 22.2919 36.8999 19.8783C37.3853 17.4647 35.8212 15.105 33.4075 14.6196C30.9939 14.1342 28.6343 15.6983 28.1489 18.1119Z" fill="#272342"/><path d="M126.721 61.9752C126.236 64.3888 127.8 66.7485 130.213 67.2339C132.627 67.7193 134.987 66.1552 135.472 63.7416C135.958 61.3279 134.393 58.9683 131.98 58.4829C129.566 57.9974 127.207 59.5616 126.721 61.9752Z" fill="#272342"/><path d="M100.913 56.7681C100.427 59.1818 101.991 61.5414 104.405 62.0268C106.818 62.5123 109.178 60.9481 109.664 58.5345C110.149 56.1209 108.585 53.7612 106.171 53.2758C103.758 52.7904 101.398 54.3545 100.913 56.7681Z" fill="#272342"/><path d="M75.1157 51.5611C74.6303 53.9747 76.1943 56.3344 78.608 56.8198C81.0216 57.3052 83.3813 55.7411 83.8667 53.3275C84.3521 50.9139 82.7879 48.5542 80.3743 48.0688C77.9607 47.5834 75.6011 49.1475 75.1157 51.5611Z" fill="#272342"/><path d="M49.3071 46.358C48.8217 48.7716 50.3857 51.1313 52.7994 51.6167C55.213 52.1021 57.5727 50.538 58.0581 48.1244C58.5435 45.7108 56.9794 43.3511 54.5657 42.8657C52.1521 42.3803 49.7925 43.9444 49.3071 46.358Z" fill="#272342"/><path d="M23.5141 41.1549C23.0287 43.5685 24.5928 45.9281 27.0064 46.4136C29.42 46.899 31.7797 45.3349 32.2651 42.9212C32.7506 40.5076 31.1865 38.148 28.7729 37.6625C26.3592 37.1771 23.9995 38.7413 23.5141 41.1549Z" fill="#272342"/><path d="M122.065 85.0181C121.579 87.4318 123.144 89.7914 125.557 90.2768C127.971 90.7623 130.331 89.1981 130.816 86.7845C131.301 84.3709 129.737 82.0112 127.324 81.5258C124.91 81.0404 122.55 82.6045 122.065 85.0181Z" fill="#272342"/><path d="M96.2583 79.8111C95.7728 82.2247 97.3369 84.5844 99.7505 85.0699C102.164 85.5553 104.524 83.9911 105.009 81.5775C105.495 79.1639 103.931 76.8042 101.517 76.3188C99.1033 75.8334 96.7437 77.3975 96.2583 79.8111Z" fill="#272342"/><path d="M70.4633 74.608C69.9779 77.0216 71.542 79.3813 73.9556 79.8667C76.3692 80.3521 78.7289 78.788 79.2143 76.3744C79.6998 73.9608 78.1356 71.6011 75.722 71.1157C73.3084 70.6303 70.9488 72.1944 70.4633 74.608Z" fill="#272342"/><path d="M44.6665 69.3892C44.181 71.8029 45.7451 74.1625 48.1587 74.6479C50.5723 75.1334 52.9321 73.5692 53.4175 71.1556C53.9029 68.742 52.3387 66.3823 49.9251 65.8969C47.5115 65.4115 45.1519 66.9756 44.6665 69.3892Z" fill="#272342"/><path d="M18.8598 64.1861C18.3744 66.5997 19.9386 68.9594 22.3522 69.4448C24.7658 69.9302 27.1254 68.3661 27.6108 65.9525C28.0963 63.5389 26.5322 61.1792 24.1186 60.6938C21.7049 60.2084 19.3452 61.7725 18.8598 64.1861Z" fill="#272342"/><path d="M117.416 108.049C116.931 110.463 118.495 112.823 120.909 113.308C123.322 113.794 125.682 112.229 126.167 109.816C126.653 107.402 125.089 105.042 122.675 104.557C120.262 104.072 117.902 105.636 117.416 108.049Z" fill="#272342"/><path d="M91.6196 102.842C91.1342 105.256 92.6982 107.616 95.1119 108.101C97.5255 108.586 99.8852 107.022 100.371 104.609C100.856 102.195 99.2919 99.8355 96.8782 99.35C94.4646 98.8646 92.105 100.429 91.6196 102.842Z" fill="#272342"/><path d="M65.811 97.6353C65.3256 100.049 66.8897 102.409 69.3033 102.894C71.717 103.379 74.0766 101.815 74.562 99.4017C75.0474 96.9881 73.4833 94.6284 71.0697 94.143C68.6561 93.6576 66.2964 95.2217 65.811 97.6353Z" fill="#272342"/><path d="M40.018 92.4322C39.5326 94.8458 41.0968 97.2055 43.5104 97.6909C45.924 98.1763 48.2836 96.6122 48.769 94.1986C49.2545 91.785 47.6904 89.4253 45.2768 88.9399C42.8631 88.4545 40.5034 90.0186 40.018 92.4322Z" fill="#272342"/><path d="M14.2094 87.2291C13.724 89.6427 15.2882 92.0024 17.7018 92.4878C20.1154 92.9732 22.475 91.4091 22.9604 88.9955C23.4459 86.5819 21.8818 84.2222 19.4682 83.7368C17.0546 83.2513 14.6948 84.8155 14.2094 87.2291Z" fill="#272342"/><path d="M112.776 131.092C112.29 133.506 113.854 135.866 116.268 136.351C118.682 136.837 121.041 135.272 121.527 132.859C122.012 130.445 120.448 128.085 118.034 127.6C115.621 127.115 113.261 128.679 112.776 131.092Z" fill="#272342"/><path d="M86.9692 125.874C86.4838 128.287 88.0479 130.647 90.4615 131.132C92.8752 131.618 95.2348 130.054 95.7202 127.64C96.2056 125.226 94.6415 122.867 92.2279 122.381C89.8143 121.896 87.4546 123.46 86.9692 125.874Z" fill="#272342"/><path d="M61.1743 120.667C60.6888 123.08 62.253 125.44 64.6666 125.925C67.0802 126.411 69.4399 124.847 69.9253 122.433C70.4107 120.019 68.8466 117.66 66.433 117.174C64.0194 116.689 61.6597 118.253 61.1743 120.667Z" fill="#272342"/><path d="M35.3657 115.463C34.8803 117.877 36.4444 120.237 38.858 120.722C41.2716 121.208 43.6313 119.643 44.1167 117.23C44.6021 114.816 43.038 112.457 40.6244 111.971C38.2108 111.486 35.8511 113.05 35.3657 115.463Z" fill="#272342"/><path d="M9.57075 110.26C9.08533 112.674 10.6495 115.034 13.0631 115.519C15.4767 116.004 17.8364 114.44 18.3219 112.027C18.8073 109.613 17.2431 107.253 14.8295 106.768C12.4159 106.283 10.0562 107.847 9.57075 110.26Z" fill="#272342"/><path d="M108.123 154.131C107.638 156.545 109.202 158.905 111.616 159.39C114.029 159.876 116.389 158.311 116.875 155.898C117.36 153.484 115.796 151.125 113.382 150.639C110.969 150.154 108.609 151.718 108.123 154.131Z" fill="#272342"/><path d="M82.3149 148.924C81.8295 151.338 83.3936 153.698 85.8072 154.183C88.2209 154.669 90.5805 153.104 91.0659 150.691C91.5513 148.277 89.9872 145.917 87.5736 145.432C85.16 144.947 82.8003 146.511 82.3149 148.924Z" fill="#272342"/><path d="M56.518 143.717C56.0326 146.131 57.5968 148.491 60.0104 148.976C62.424 149.461 64.7836 147.897 65.269 145.484C65.7545 143.07 64.1904 140.71 61.7768 140.225C59.3631 139.74 57.0034 141.304 56.518 143.717Z" fill="#272342"/><path d="M30.7094 138.514C30.224 140.928 31.7882 143.288 34.2018 143.773C36.6154 144.258 38.9751 142.694 39.4605 140.281C39.9459 137.867 38.3818 135.507 35.9682 135.022C33.5546 134.537 31.1948 136.101 30.7094 138.514Z" fill="#272342"/><path d="M4.91646 133.311C4.43104 135.725 5.99512 138.084 8.40873 138.57C10.8223 139.055 13.1821 137.491 13.6675 135.077C14.1529 132.664 12.5887 130.304 10.1751 129.819C7.7615 129.333 5.40188 130.898 4.91646 133.311Z" fill="#272342"/><path d="M103.471 177.151C102.986 179.565 104.55 181.924 106.963 182.41C109.377 182.895 111.737 181.331 112.222 178.917C112.708 176.504 111.143 174.144 108.73 173.659C106.316 173.173 103.957 174.737 103.471 177.151Z" fill="#272342"/><path d="M77.6782 171.944C77.1928 174.358 78.7569 176.717 81.1705 177.203C83.5841 177.688 85.9438 176.124 86.4292 173.71C86.9146 171.297 85.3505 168.937 82.9369 168.452C80.5233 167.966 78.1636 169.53 77.6782 171.944Z" fill="#272342"/><path d="M51.8696 166.737C51.3842 169.151 52.9483 171.51 55.3619 171.996C57.7755 172.481 60.1353 170.917 60.6207 168.503C61.1061 166.09 59.5419 163.73 57.1283 163.245C54.7147 162.759 52.355 164.323 51.8696 166.737Z" fill="#272342"/><path d="M26.0727 161.534C25.5873 163.947 27.1514 166.307 29.565 166.792C31.9786 167.278 34.3383 165.714 34.8237 163.3C35.3091 160.887 33.745 158.527 31.3314 158.041C28.9178 157.556 26.5581 159.12 26.0727 161.534Z" fill="#272342"/><path d="M0.266066 156.331C-0.219353 158.744 1.34473 161.104 3.75834 161.589C6.17196 162.075 8.53166 160.511 9.01708 158.097C9.5025 155.683 7.93834 153.324 5.52473 152.838C3.11111 152.353 0.751486 153.917 0.266066 156.331Z" fill="#272342"/></g></svg>
        <svg class="float-right" width="85" height="66" viewBox="0 0 85 66" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.1" d="M0.253479 -17.6474L1.68547 57.9314C1.80572 64.0092 8.58311 67.5618 13.6443 64.2059L81.3197 19.2456C86.3809 15.8788 85.736 8.24877 80.1829 5.78923L11.0754 -24.8292C5.92677 -27.1139 0.144167 -23.277 0.253479 -17.6365V-17.6474Z" fill="url(#paint0_linear_4761_3941)"/><defs><linearGradient id="paint0_linear_4761_3941" x1="93.3049" y1="5.7798" x2="4.8109" y2="-12.0798" gradientUnits="userSpaceOnUse"><stop stop-color="#330E82"/><stop offset="1" stop-color="#330E82"/></linearGradient></defs></svg>
        <img src="https://storage.googleapis.com/content.ezadtv.com/2024/04/19/662231d802780_Frame_1000006745_3_.svg" alt="" class="banner-front-image float-right">
        <div class="d-flex flex-row justify-content-start align-items-start pt-3 px-3 pb-5">
          <div class="d-flex flex-column justify-content-start align-items-start pt-3">
            <div class="d-flex flex-column justify-content-start align-items-start text-white" style="z-index:1">
              <h2 class="m-0 font-weight-bold">
                AI Widget Builder
              </h2>
              <div>
                Prompt the AI and Watch It Build Dynamic, Engaging Product Displays in Seconds!
              </div>
            </div>
          </div>
          <div class="position-absolute mt-n4 ml-n5">
            <router-link to="/admin/settings/ai-widgets-builder" class="btn btn-white rounded shadow-sm d-flex justify-content-start align-items-start try-this-feature">
              Try This Feature <span data-v-2314145c="">→</span>
            </router-link>
            <svg width="259" height="175" viewBox="0 0 259 175" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.1" d="M-26.8085 32.0461L47.8782 259.565C53.8838 277.86 77.7423 282.325 89.9348 267.424L253.03 68.2826C265.241 53.3811 256.178 30.8756 237.04 28.589L-0.741228 0.211369C-18.4555 -1.90689 -32.3836 15.0868 -26.8273 32.0471L-26.8085 32.0461Z" fill="url(#paint0_linear_4761_3942)"/><defs><linearGradient id="paint0_linear_4761_3942" x1="278.629" y1="70.6137" x2="-5.99721" y2="98.9771" gradientUnits="userSpaceOnUse"><stop stop-color="#330E82"/><stop offset="1" stop-color="#330E82"/></linearGradient></defs></svg>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-md-3 mb-1 d-flex flex-column" v-for="widget in widgetTypes" :key="widget.id">
        <div class="flex-grow-1">
          <div v-if="widget.disabled" class="small text-danger mt-n1">You can only add one widget of this type</div>
        </div>
        <a class="widget d-flex flex-column justify-content-between" @click.prevent="selectWidgetType(widget.id)" :class="{'selected': selectedWidgetType == widget.id, 'disabled' : widget.disabled}" aria-label="Widget Type" tabindex="1">
          <div class="gradient-text-container" v-if="widget.name == 'Product Swiper' || widget.name == 'AI Widget Builder'">
              <h1 class="gradient-text">{{widget.name}}</h1>
          </div>
          <div class="name font-weight-bold mb-2 text-dark" v-else>
            {{ widget.id == 10 ? (isBenjaminMoore ? 'Benjamin Moore Hero' : 'Text & Image') : widget.name }}
          </div>
          <div :class="widget.name == 'Product Swiper' || widget.name == 'AI Widget Builder' ? 'gradient-card-bg':''">
          <div class="img card">
            <img :src="widget.image" :alt="widget.name" />
          </div>
          </div>
        </a>
      </div>
    </div>
    <div slot="modal-footer">
      <button type="button" class="btn btn-primary" :disabled="saving || !this.selectedWidgetType" @click="addWidget">Add</button>
    </div>
  </b-modal>
</template>

<script>

export default {
  name: 'AddWidgetModal',
  data() {
    return {
      saving: false,
      selectedWidgetType: 1
    };
  },
  computed: {
    isBenjaminMoore() {
      return this.$root.$children[0].isBenjaminMoore;
    },
    widgetTypes() {
      if(!this.$store.state.widgetTypes)
        return [];
      let ret = this.$store.state.widgetTypes;
      if(ret && this.widgets) {
        const featuredWidget = ret.find(e => e.id == 6);
        if (featuredWidget) {
          featuredWidget.disabled = true;
        } 
        
        ret = !this.isBenjaminMoore ? ret.filter(e => e.id != 10) : ret;
      }
      return ret;
    },
    widgets() {
      return this.$store.state.widgets;
    }
  },
  methods: {
    selectWidgetType(id) {
      this.selectedWidgetType = id;
      this.addWidget();
    },
    addWidget() {
      let order = this.$parent.widgets.length ? Math.max.apply(Math, [...this.$parent.widgets].map(e => e.order)) + 1 : 1;
      let value = this.selectedWidgetType == 8 ? '' : JSON.stringify({hidden: false});
      let widget = { widget_type_id: this.selectedWidgetType, order: order, value: value, master: this.$store.state.activeUser.data.is_developer, generated_single:1 };
      this.$emit('onAdd', widget);
      this.hide();
    },
    hide() {
      this.$refs.addWidgetModal.hide();
    },
    show() {
      this.selectedWidgetType = null;
      this.$refs.addWidgetModal.show();
    }
  }
};
</script>

<style scoped lang="scss">
  .widget {
    cursor: pointer;
    .card {
      height: 180px;
      border: 1px solid #E2E2E7;
      box-shadow: none;
      border-radius: 4px;
      position: relative;
      padding: 10px;
      position: relative;
      background: #F7F7F7;
      display: flex;
      justify-content: center;
      .img {
        box-shadow: 0 2px 2px rgba(0,0,0,.05);
        overflow: hidden;
        border-radius: 6px;
        img {
          max-height: 80px;
          width: 100%;
          object-fit: cover;
        }
      }
      
    }
    .name {
      font-size: 16px;
      display: flex;
      align-items: center;
      /*&::before {
        content: '';
        margin-right: 10px;
        width: 20px;
        height: 20px;
        background: #FFFFFF;
        border: 1px solid #E2E2E7;
        border-radius: 16px;
      }*/
    }
    &:hover {
      text-decoration: none;
      .card {
        border-color: var(--primary);
        box-shadow: 0 0 0 1px var(--primary);
      }
    }
    &.selected {
      border-color: var(--primary);
      box-shadow: 0 0 0 1px var(--primary);
      cursor: default;
    }
  }
  .gradient-text-container {
    width: fit-content;
  }
  .gradient-text {
      background: linear-gradient(270deg, rgb(255, 190, 113) 0%, rgb(251, 92, 207) 24.13%, rgb(95, 71, 240) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 16px;
      font-weight:bold;

  }
  .gradient-card-bg {
    background: linear-gradient(#5f47f0,#fb5ccf,#ffbe71)!important;
    padding: 2px;
    border-radius: 3px;
  }
  .banner-front-image {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
  }
  .ai-widget-banner{
    height: 195px;
    width: 100%; 
    background: linear-gradient(91.5deg, #5f47f0, #fb5ccf 50.5%, #ffbd71); 
    overflow: hidden; 
    position: relative;    
  }
  .try-this-feature{
    gap: 10px;
    margin-top: 138px;
    margin-left: 45px;
    position:absolute
  }
  .try-this-feature span{
    font-size: 30px;
    margin-top: -3px;
    margin-left: -4px;  
  }
  @media (min-width: 3170px) {
   .try-this-feature span{
      font-size: 30px;
      margin-top: -2px;
      margin-left: -4px;  
    } 
  }
  @media (min-height: 1600px) {
   .try-this-feature span{
      font-size: 30px;
      margin-top: -2px;
      margin-left: -4px;  
    } 
  }
</style>
