<template>
  <div class="container">
    <section class="subscribe align-items-center" :style="$store.state.settings.overrideSubscribeImage ? `background-image: ${$store.state.settings.subscribeBannerImage}` : ''" v-if="options">
      <div class="row align-items-center h-100">

        <div v-if="!$store.state.settings.overrideSubscribeImage" class="phone-screen">
          <img v-if="$store.state.settings.logo" class="phone-logo" :src="$store.state.settings.logo" :alt="$store.state.settings.businessName" />
        </div>

        <div class="offset-md-5 col-md-7 offset-lg-6 col-lg-6 d-flex align-items-center">
          <div class="flash-deal w-100">
            <h3 class="pt-0">{{ options.title || 'Join our email mailing list!'}}</h3>
            <div class="d-flex flex-column flex-sm-row mt-3 position-relative" :class="{'interacting': isInteracting}">
              <input id="subscriberEmail" @blur="stopInteracting" v-model="subscriberEmail" aria-label="Enter Email" type="text" class="form-control" placeholder="Enter Email" @keypress.enter="subscribe">
              <button type="button" class="d-none d-sm-block btn btn-primary ml-sm-2 submit-btn" @click="subscribe">
                <b>Submit</b>
              </button>
              <button type="button" class="d-sm-none btn btn-primary ml-sm-2 submit-btn" @click="startInteracting">
                <b>Subscribe</b>
                <svg width="25" height="24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g fill="none" fill-rule="evenodd"><image x="-41" y="-43" width="99" height="95" xlink:href="data:image/png;base64,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"/><g fill="#FFF" fill-rule="nonzero"><path d="M21.354 21a.794.794 0 01-.252-.042L.53 13.87a.79.79 0 01-.11-1.444L23.856.088a.78.78 0 01.815.057c.24.172.363.464.32.758L22.128 20.33a.788.788 0 01-.773.671zM2.756 12.972l17.963 6.19 2.5-16.96-20.463 10.77z"/><path d="M9.787 24A.787.787 0 019 23.217v-7.043c0-.197.076-.39.21-.534L23.638.25A.79.79 0 0124.75.21c.318.295.335.79.039 1.108L10.574 16.482v4.35l2.626-3.556a.791.791 0 011.1-.167.78.78 0 01.168 1.095l-4.046 5.478a.793.793 0 01-.635.318z"/></g></g></svg>
              </button>
            </div>
            <small id="subscriberEmailSuccess" ref="subscriberEmailSuccess" class="d-none form-text">
              Successfully subscribed!
            </small>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import SubscriberApiService from '@/api-services/subscriber.service';
export default {
  name: 'SubscribeSection',
  data() {
    return {
      subscriberEmail: null,
      isInteracting: false
    };
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
  methods: {
    subscribe() {
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
        console.log('error in subscribe: ', error.response);
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
    },
    startInteracting() {
      if(!this.isInteracting) {
        document.getElementById('subscriberEmail').focus();
        this.isInteracting = true;
      } else {
        this.subscribe();
      }
    },
    stopInteracting(event) {
      if(!(event && event.relatedTarget && event.relatedTarget.classList.contains('submit-btn')))
        this.isInteracting = false;
    }
  }
};
</script>
<style lang="scss" scoped>
  section {
    padding: 0;
    margin-top: 30px;
    border-radius: 13px;
  }
  .subscribe {
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url('/images/subscribe-image.webp');
    background-color: #e7eaef;
    max-height: 345px;
    padding: 50px 0;
    height: 345px;
    position: relative;

    img {
      max-height: 345px;
    }
  }
  h3 {
    max-width: 500px;
  }
  .form-control {
    max-width: 400px;
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
    left: 13.5%;
    display: flex;
    align-items: center;
    justify-content: center;

    .phone-logo {
      width: 70%;
    }
  }

  @media screen and (max-width: 1599px) {
    .phone-screen {
      top: 65px;
      left: 12%;
      -webkit-transform: rotateX(-45deg) rotateZ(45deg) scale(2.6);
      transform: rotateX(-45deg) rotateZ(45deg) scale(2.6);
    }
  }

  @media screen and (max-width: 1050px) {
    .subscribe {
      height: auto;
    }
    .phone-screen {
      top: 42px;
      left: 11.5%;
      -webkit-transform: rotateX(-45deg) rotateZ(45deg) scale(2.2);
      transform: rotateX(-45deg) rotateZ(45deg) scale(2.2);
    }
  }

  @media screen and (max-width: 871px) {
    .phone-screen {
      top: 22px;
      left: 11.5%;
      -webkit-transform: rotateX(-45deg) rotateZ(45deg) scale(1.9);
      transform: rotateX(-45deg) rotateZ(45deg) scale(1.9);
    }
  }

  @media screen and (max-width: 767px) {
    .subscribe {
      background: none;
      padding: 0;
    }

    .phone-screen {
      display: none;
    }
  }
  @media screen and (max-width: 576px) {
    .subscribe {
      background: none;
    }
    .form-control {
      max-width: 100%;
    }
    .flash-deal {
      align-items: center;
      max-width: 560px;
      margin: 0 auto;
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
      padding-right: 54px !important
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
