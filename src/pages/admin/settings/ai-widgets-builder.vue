<template>
  <div v-if="$ezHasNoPermission('manage_ai_widgets')">
    <NoPermission />
  </div>
  <div class="bg-white  h-100" v-else>
    <div class="settings-header">
      <div class="settings-header-info">
        <div class="d-flex flex-column">
          <h5 class="font-weight-bold">AI Powered Widgets</h5>
          <p class="my-2">
            Elevate your e-commerce landing page with our AI Widget Builder, the ultimate tool for effortless product display. 
            Simply feed it your desired product criteria and watch as it crafts and creates personalized product widgets with captivating headers and selections. 
            The AI-driven feature not only creates but also refreshes your widgets monthly, keeping your storefront fresh and in tune with the latest trends. 
            Save time, engage customers, and boost sales with minimal effort. The AI Widget Builder is not just a feature; 
            it's your smart, tireless merchandiser, ensuring your online store always looks its best.
          </p>  
        </div>
      </div>
    </div>
    <div class="settings-header align-items-start">
        <div class="d-flex mb-3">
          <div class="custom-control custom-switch">
            <input type="checkbox" v-model="aiWidgetsStatus" class="custom-control-input" id="ai_widgets_status" @change="saveAIWidgetsSettings">
            <label class="custom-control-label" for="ai_widgets_status" v-html="'AI Widgets ' + widgetStatus"></label>
          </div>  
        </div>
        <template v-if="aiWidgetsStatus">        
          <div class="d-flex my-1">  
            <h5 class="font-weight-bold">Provide Further Instructions to the AI</h5>  
          </div>
          <div class="d-flex flex-column mb-2 form-group">
            <span class="my-2">
              Guide your AI Widget Builder with ease: simply type natural language instructions like "highlight Christmas decor" or 
              "feature Fertilizer Merchandise" to tailor your product widgets perfectly
            </span>
            <textarea v-model="instructions" class="form-control" rows="2"></textarea>
            <button class="btn btn-primary flex-grow-0 ml-auto mt-3 w-md-25" :disabled="saving" @click="saveAIWidgetsSettings">
              <i v-if="saving" class="fa fa-spin fa-spinner mr-1"></i>
              Save & Generate
            </button>
          </div>
        </template>
    </div>
    <div class="settings-body">
      
      <template v-if="aiWidgetsStatus">        
        <template v-if="saving">
          <div class="row">
              <div class="col-12">
                <div class="d-flex progress-item mb-3" v-if="progress.length == 0">
                  <div class="ai-thinker currentWrting">
                    <svg class="star1" xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                      <path d="M9.5565 0.5C8.35782 7.01114 7.38609 7.98282 0.875 9.1815C7.38614 10.3802 8.35782 11.3519 9.5565 17.863C10.7552 11.3519 11.7269 10.3802 18.238 9.1815C11.7269 7.98282 10.7551 7.01114 9.5565 0.5Z" fill="white"/>
                    </svg>
                    <svg class="star2" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M5.83359 0.816406C5.07135 4.95723 4.45327 5.57525 0.3125 6.3375C4.45327 7.0998 5.07135 7.71783 5.83359 11.8586C6.59584 7.71783 7.21392 7.09975 11.3546 6.3375C7.21381 5.57525 6.59589 4.95723 5.83359 0.816406Z" fill="white"/>
                    </svg>
                  </div>
                  <!-- <div class="ai-progress-detail ml-3 d-flex align-items-center justify-content-center writing" >
                    <p class="mb-0 mx-3 typingEffect"> </p>
                  </div> -->
                </div>
                <template v-else>
                  <div class="d-flex progress-item mb-3">
                    <div class="ai-thinker" :class="{'currentWrting' : progress[progress.length - 1].done == 0}">
                      <svg class="star1" xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                        <path d="M9.5565 0.5C8.35782 7.01114 7.38609 7.98282 0.875 9.1815C7.38614 10.3802 8.35782 11.3519 9.5565 17.863C10.7552 11.3519 11.7269 10.3802 18.238 9.1815C11.7269 7.98282 10.7551 7.01114 9.5565 0.5Z" fill="white"/>
                      </svg>
                      <svg class="star2" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M5.83359 0.816406C5.07135 4.95723 4.45327 5.57525 0.3125 6.3375C4.45327 7.0998 5.07135 7.71783 5.83359 11.8586C6.59584 7.71783 7.21392 7.09975 11.3546 6.3375C7.21381 5.57525 6.59589 4.95723 5.83359 0.816406Z" fill="white"/>
                      </svg>
                    </div>
                    <div class="ai-progress-detail ml-3 d-flex align-items-center justify-content-start w-100 writing" :class="{'writing' : progress[progress.length - 1].done == 0, 'expanded' : progress[progress.length - 1].text.length > 0}" >
                      <p class="mb-0 mx-3 typingEffect"> {{ progress[progress.length - 1].text }}</p>
                    </div>
                  </div>
                </template>
                
              </div> 
              
          </div>
          <div class="w-100 d-flex pl-5 mt-3">              
              <div class="w-25 mr-2 product-skeleton skeleton-box"></div>
              <div class="w-25 mx-2 product-skeleton skeleton-box"></div>
              <div class="w-25 mx-2 product-skeleton skeleton-box"></div>
              <div class="w-25 ml-2 product-skeleton skeleton-box"></div>
          </div>
        </template>
        <template v-else-if="aiWidgets.length">
          <div class="d-flex my-2 flex-column">
            <h5 class="font-weight-bold mt-3">Current AI Generated Widgets</h5>
            <span v-if="generatedTime"> (Generated on {{ generatedTime }}) </span>
            <span v-if="aiWidgetsSearchTerms"> Based on your input, the AI identified the following keywords as relevant search categories for widget generation: <b>{{ aiWidgetsSearchTerms }}</b> </span>
            
          </div>

          <div v-if="aiWidgets && aiWidgets.length" class="px-2">
            <div v-for="e in aiWidgets" :key="e.id" class="container my-3">
              <ProductSwiper :id="e.id" :editableFromAiBuilder="true" :showAddCart="false" :products="e.value.productList" :widget="e" :autoPlay="5000" :title="e.value.title" :loop="e.value.loop" :itemsToShow="visibleItems" @remove="removeSwiper"  />
            </div>
          </div>
        </template>
      </template> 
    </div>
  </div>
</template>

<script>
  import AdminService from '@/api-services/admin.service';
  import NoPermission from './no-permission';
  import moment from 'moment-timezone';
  import widgetsApiService from '@/api-services/widgets.service';

  export default {
    name: 'aiWidgetsBuilder',
    components: { NoPermission },
    data() {
      return {
        loading: true,
        saving: false,
        aiWidgetsStatus: true,
        instructions: '',
        windowWidth: window.innerWidth,
        writing: false,
        progress: [],
        aiWidgetsSearchTerms: ''
      };
    },
    created() {
      window.addEventListener('resize', () => this.windowWidth = window.innerWidth);
    },
    computed: {
      widgetStatus() {
        return this.aiWidgetsStatus == 1 ? "Enabled" : "Disabled";
      },
      widgets() {
        if(this.$store.state.widgets)
          return this.$store.state.widgets.map(e => {
            e.value = e.value == '' || typeof e.value != 'string' ? e.value : JSON.parse(e.value);
            return e;
          }).sort((a, b) => (a.order > b.order) ? 1 : -1);
        return null;
      },
      aiWidgets() {
        return this.widgets ? this.widgets.filter(e => e.ai == 1 && e.generated_single == 0) : [];
      },
      generatedTime() {
        const generationTime = this.aiWidgets && this.aiWidgets.length ? this.aiWidgets[0].created_at : null;
        return generationTime ? moment.tz(generationTime, 'America/New_York').local().format('MMM Do YYYY @ h:mm A') : null;
      },
      visibleItems() {
        return this.windowWidth > 992  ? 4
           : this.windowWidth > 768  ? 3
           : 2;
      },
    },
    async mounted() {
      if(this.$ezHasNoPermission("manage_ai_widgets")) return;
      this.getAIWidgetsSettings();
    },
    methods: {
      
      saveAIWidgetsSettings() {
        this.saving = true;
        this.progress = [];
        AdminService.updateAIWidgetsSettings({ disabled: this.aiWidgetsStatus == true ? 0 : 1, instructions: this.instructions }).then((res) => {
          if (res.data.status === 'success') {
            this.$swal({
              toast: true,
              position: 'top',
              type: 'success',
              html: `<div class="ml-2">${res.data.message}</div>`,
              showConfirmButton: false,
              timer: 5000
            });

            if(this.aiWidgetsStatus == true) {
              var _self = this;
              setTimeout(function() {
                _self.checkAIWidgetsTaskStatus();
              },3000); // check every 10 sec
            } else {
              this.$store.dispatch('widgets');
              this.saving = false;
            }
          } else {
            this.$swal(res.data.message, '', 'error');
            this.saving = false;
          }
        });
      },
      getAIWidgetsSettings() {
        this.loading = true;
        AdminService.getAIWidgetsSettings().then(result => {
          this.loading = false;
          if(result.data.status === 'error') {
            this.$swal(result.data.message, '', 'error');
          } else {
            this.instructions = result.data.aiWidgets.instructions;
            this.aiWidgetsStatus = result.data.aiWidgets.disabled == 0 ? true : false;
            this.aiWidgetsSearchTerms = this.getSearchTerms(result.data.progress);
          }
        });
      },
      getSearchTerms(progress){
        let categoriesText = progress.find(x => x.includes('search categories:'));
        if(categoriesText) {
          // remove the text before colon including the colon
          let categories = categoriesText.split(':').pop();
          return categories;
        }
        return "";
      },
      async checkAIWidgetsTaskStatus() {
        let resp = await AdminService.checkAIWidgetsTaskStatus();
        let _self = this; 
        if(resp.status == 200) {
          const taskStatus = resp.data.taskStatus;
          const progress = resp.data.progress;
          if(this.progress.length < progress.length) {
            for(let i = 0; i < progress.length; i++) {
              if(this.progress.length <= i) {
                await this.pushProgress({text: progress[i]});
              }
            }
            setTimeout(function() {
              _self.checkAIWidgetsTaskStatus();
            },1500); // check every 10 sec
          } else {
            await new Promise(resolve => setTimeout(resolve, 3000)); // Adjust the delay if needed
            if(taskStatus === 1) { // Done
              this.$store.dispatch('widgets');
              this.saving = false;
            } else if(taskStatus === 0) { // running                  
              setTimeout(function() {
                _self.checkAIWidgetsTaskStatus();
              },2500); // check every 10 sec
            } else if(taskStatus === -1) { // not run yet
              this.loading = false;
            }
          }               
        }
      },
      async pushProgress(message) {
        const addCharacter = async () => {
          if(message && message.text && message.text.length > 0) {
            this.writing = true;
            this.progress.push({
              text: '',
              done: 0
            });
            for (const char of message.text) {
              this.progress[this.progress.length - 1].text += char;
              await new Promise(resolve => setTimeout(resolve, 25)); // Adjust the delay if needed
            }
            await new Promise(resolve => setTimeout(resolve, 1500)); // Adjust the delay if needed
            if(this.progress[this.progress.length - 1].text.length == message.text.length) {
              this.progress[this.progress.length - 1].done = 1;
              this.writing = false;
            }
          }
        };
        await addCharacter();
      },
      removeSwiper(id) {
        this.$swal({
          title: 'Remove Swiper',
          html: `Are you sure you want to remove this Product Swiper?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes'
        }).then((result) => {
          if (result.value) {
            widgetsApiService.delete(id);
            this.$store.commit('deleteWidget', id);
            this.$swal({
              toast: true,
              position: 'top',
              type: 'success',
              html: `<div class="ml-2">Widget successfully removed</div>`,
              showConfirmButton: false,
              timer: 3000
            });
          }
        });
      }

    },
    watch: {
      progress(val) {
        if(val.length > 0) {
          let terms = this.getSearchTerms(val.map(x => x.text));
          this.aiWidgetsSearchTerms = terms ? terms : this.aiWidgetsSearchTerms;
        }
      }
    }
  };
</script>
<style scoped lang="scss">
.widget-info-skeleton h3 {
    content: ' ';
    width: 250px;
    height: 24px;
    background-color: #ddd;
    margin: 10px 0;
    border-radius: 50px;
  }
  .widget-info-skeleton span {
    width: 300px;
    height: 17px;
    display: inline-block;
    background-color: #ddd;
    border-radius: 50px;
  }

  .widget-info-skeleton-p {
    width: 330px;
    background-color: #ddd;
    height: 23px;
    line-height: 140%;
    border-radius: 50px;
  }

  .product-skeleton {
    height: 373px;
    width: 25%;
    background-color: #ddd;
    border-radius: 14px;
  }
  .skeleton-box {
    background: linear-gradient(90deg, #F0EFF0 25%, #e0e0e0 50%, #EBEBEA 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .ai-thinker {
    background: linear-gradient(300deg,#1d1a1e,#452ca6,#e036a8);
    background-size: 180% 180%;
    animation: gradient-animation 3s ease infinite;
    height: 50px;
    min-width: 50px;
    width: 50px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .star1 {
    position: relative;
    top: -4px;    
  }
  .currentWrting {
    .star1, .star2 {
      animation: zoom-in-zoom-out 1.5s ease-in infinite;
    }
  }
  .star2 {
    position: relative;
    top: 5px;
    left: -2px;
  }

  @keyframes zoom-in-zoom-out {
    0% {
      transform: scale(1, 1);
    }
    50% {
      transform: scale(1.4, 1.4);
    }
    100% {
      transform: scale(1, 1);
    }
  }

  @keyframes gradient-animation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  .ai-progress-detail {
    align-items: start;
    justify-content: start;
    background: #F1F5F9;
    width: 50px;
    height: 70px;
    box-sizing: content-box;
    border-radius: 18.43px;
    border-top-left-radius: 0px !important;
    -webkit-transition: width 0.3s linear;
    -moz-transition: width 0.3s linear;
    -o-transition: width 0.3s linear;
    transition: width 0.3s linear;

    &.writing {
      background: transparent;
      background-image: linear-gradient(white, white), 
                      linear-gradient(to right, #5F47F0, #FB5CCF, #FFBE71);
      background-origin: border-box;
      background-clip: content-box, border-box;
      border: double 1px transparent;        
      animation: border-gradient-animation 0.75s ease-in-out infinite;
    }
    &.expanded{
      width: auto;
    }
    p{
      font-size: 16.13px;
    }
  }

  @keyframes border-gradient-animation {
    0% {
      background-image: linear-gradient(white, white), 
                      linear-gradient(to right, #5F47F0, #FB5CCF, #FFBE71);
    }
    25% {
      background-image: linear-gradient(white, white), 
                      linear-gradient(to right, #5F47F0, #FFBE71, #FB5CCF);
    }
    50% {
      background-image: linear-gradient(white, white), 
                      linear-gradient(to right, #FFBE71, #5F47F0, #FB5CCF);
    }
    75% {
      background-image: linear-gradient(white, white), 
                      linear-gradient(to right, #FB5CCF, #FFBE71, #5F47F0);
    }
    100% {
      background-image: linear-gradient(white, white), 
                      linear-gradient(to right, #5F47F0, #FB5CCF, #FFBE71);
    }
  }
</style>