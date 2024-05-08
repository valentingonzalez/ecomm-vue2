<template>
  <div class="upgrade-banner" v-if="typeof $store.state.businessDetails.show_free_upgrade != 'undefined'">
    <!-- <b>You are currently on the Basic Plan! Upgrade to EZ-Commerce Plus to showcase all of your POS inventory!</b> -->
    <!-- <button v-b-modal.upgrade-modal type="button">I’m Interested</button> -->
    <div class="container">
      <div class="d-flex align-items-center justify-content-between">
        <template v-if="$store.state.businessDetails.show_free_upgrade">      
          <div class="d-flex justify-content-between align-items-center w-100">
            <div class="d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 24 24"><title>megaphone</title><g fill="#f1ea19"><path d="M10.467,16.004H5.07l2.613,6.43c.392,.973,1.331,1.565,2.322,1.565,.31,0,.624-.058,.929-.18,1.275-.516,1.896-1.973,1.384-3.252l-1.852-4.563Z"></path><path d="M18.383,.081c-.371-.156-.804-.07-1.089,.215-.038,.037-3.763,3.708-7.294,3.708H5C2.243,4.004,0,6.247,0,9.004s2.243,5,5,5h5c3.531,0,7.256,3.671,7.294,3.708,.19,.19,.446,.292,.706,.292,.129,0,.26-.025,.383-.077,.374-.154,.617-.519,.617-.923V1.004c0-.404-.243-.769-.617-.923Z" fill="#f1ea19"></path><path d="M21,6.004v6c1.657,0,3-1.343,3-3s-1.343-3-3-3Z"></path></g></svg>
              <div class="ml-3 d-flex flex-column">
                <b>Take advantage of our online ordering options and get more sales! For the next 3 months, get a FREE upgrade to "Buy Online & Pickup in Store."</b>
                <b class="blink-yellow">Start your 3 months free trial now!</b>
              </div>
            </div>
            <button @click="show" class="bg-yellow btn px-4" type="button">Upgrade</button>
          </div>
        </template>
        <template v-else-if="$store.state.currentStore && $store.state.currentStore.id > 0">
          <div class="d-flex justify-content-between align-items-center w-100">
            <div class="d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 24 24" fill="none">
              <path d="M1.24302 18.9532L10.152 2.11122C10.33 1.77488 10.5963 1.49342 10.9222 1.29711C11.2482 1.1008 11.6215 0.99707 12.002 0.99707C12.3825 0.99707 12.7559 1.1008 13.0818 1.29711C13.4078 1.49342 13.6741 1.77488 13.852 2.11122L22.761 18.9532C22.9282 19.271 23.0103 19.6268 22.9991 19.9857C22.988 20.3447 22.8841 20.6947 22.6975 21.0015C22.5109 21.3084 22.2479 21.5616 21.9343 21.7367C21.6207 21.9117 21.2672 22.0025 20.908 22.0002H3.09202C2.73323 22.0018 2.38014 21.9105 2.06709 21.7352C1.75404 21.5599 1.49169 21.3065 1.30555 20.9998C1.11942 20.693 1.01583 20.3434 1.00488 19.9847C0.993918 19.6261 1.07596 19.2707 1.24302 18.9532Z" fill="#DC2626"/>
              <path d="M12 8V13" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M12 18C12.5523 18 13 17.5523 13 17C13 16.4477 12.5523 16 12 16C11.4477 16 11 16.4477 11 17C11 17.5523 11.4477 18 12 18Z" fill="white"/>
              </svg>
              <div class="ml-3 d-flex flex-column">
                <b>Changes will be reflected on your site within the next 24 hours, and you will receive a confirmation email once the upgrade is in effect.</b>
                <p class="m-0 text-white">Schedule a training session with an EZ-AD Onboarding Specialist now to get the most out of your new plan</p>
              </div>
            </div>
            <a class="btn btn-primary" :href="`https://ezadtv.com/schedule/334?business_id=${$store.state.currentStore.id}&type=training`" target="_blank">Schedule a Training Session!</a>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'UpgradeBanner',
  data () {
    return {
    };
  },
  methods: {
    show(){
      this.$emit('showUpgradeModal', 1);
    }
  }
};
</script>

<style lang="scss" scoped>
  .upgrade-banner {
      padding: 10px 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #000;
      line-height: 1.3;
      font-size: 1rem;

      b {
        margin-right: 16px;
        color: white;
      }

      button {
          background: #0db561;
          box-shadow: 0 2px 2px 0 rgba(0,0,0,0.05);
          border-radius: 3px;
          color: white;
          border: none;
          font-weight: bold;
          padding: 4px 8px;
          white-space: nowrap;
      }
  }

  @media (max-width: 575px) {
      .upgrade-banner {
          flex-direction: column;
          text-align: center;
          padding: 8px;
          font-size: 0.8125rem;

          b {
              margin-bottom: 8px;
              margin-right: 0;
          }
      }
  }
  .bg-yellow{
    background: #f1ea19 !important;
    color: #000 !important;
    &:hover,&:focus,&:active,&:active:focus{
      background-color: #f1ea19 !important;      
      color: #000 !important;
    }
  }
  .blink-yellow {
      color: #f1ea19 !important;
  }
</style>
