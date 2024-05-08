<!-- FRANCO: leaving this here as a template for future email triggered views -->

<template>
  <div v-if="showPage" class="row d-flex justify-content-center mt-4">
    <div class="d-flex flex-column align-items-center card container pt-3">
      <span class="status">Thank you!</span>
      <div class="message">
        <p>We are confirming your decision to opt-out of periodic updates to your Local Ecommerce site's Landing page.</p>
        <p>If this choice was made in error and you wish to receive automatic updates, you can Opt In back by {{ activeUser && activeUser.is_admin ? 'clicking the button below' : 'following these instructions'}}.</p>
        <div class="d-flex justify-content-center mt-4 mb-4" v-if="activeUser && activeUser.is_admin">
          <div v-if="!showAfterOptInText">
            <button class="btn btn-primary" @click="setAutomaticUpdateStatus(true, emailHash)">Opt In</button>
          </div> 
          <div v-else>
            <p style="color: green;"><b>You have opted back in!</b></p>
          </div> 
        </div>
        <div style="margin-bottom: 10px;" v-if="activeUser && activeUser.is_admin">
          You can {{showAfterOptInText ? 'Opt Out' : 'also Opt In' }} inside your admin panel by following these instructions.
        </div>
        <p>These are at your disposal in the email we sent you. You can handle this setting up until <b>July 25, 2023</b>.</p>
        <ol>
          <li>Login to your account by clicking on the button below.</li>
          <li>Locate and click on the 'Admin' button, situated in the top-right corner of your screen.</li>
          <li>Navigate to the 'Website Settings' tab.</li>
          <li>Find and select 'Landing Page' from the menu on the left.</li>
          <li>Turn On the option "Enable Automatic Landing Page Updates'".</li>
        </ol>
        <div class="d-flex justify-content-center mt-4 mb-4" v-if="!activeUser.is_admin"> 
          <button class="btn btn-primary" @click="$router.push({ name: 'login' })">Log In</button>
        </div>
        <p class="text-center">Have questions? Feel free to contact <a href="mailto:support@ezadtv.com">support@ezadtv.com</a> or call us at 888-580-5593.</p>
      </div>
    </div>
  </div>
</template>

<script>
  import EmailApiService from '@/api-services/email.service';
  import HomePageApiService from '@/api-services/homepage.service';

  export default {
    name: 'LandingPageAutoUpdateOptOut',
    data() {
      return {
        showPage: false,
        showAfterOptInText: false,
        emailHash: null
      };
    },
    computed: {
      activeUser() {
        return this.$store.state.activeUser;
      }
    },
    async mounted() {
      if(this.$route.query.opt_out = 'true' && this.$route.query.hash) {
        let checkHashResult = await this.checkHash(this.$route.query.hash);
        if(checkHashResult == true) {
          this.showPage = true;
          this.emailHash = this.$route.query.hash;
        }
      }
    },
    methods: {
      async checkHash(hash) {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await EmailApiService.checkHash(hash);
            if (res.data.bool == true) {
              await this.setAutomaticUpdateStatus(false, hash);
              resolve(true);
            } else {
              resolve(false);
            }
          } catch (error) {
            reject(error);
          }
        });
      },
      async setAutomaticUpdateStatus(status, hash) {
        await EmailApiService.setLandingPageAutomaticUpdateStatus({status: status, hash: hash}).then(async res => {
          if(res.data.bool.status) {
            if(status == true) {
              this.showAfterOptInText = true;
            }
            let getBusinessDetailsRes = await HomePageApiService.getBusinessDetails();
            this.$store.commit('setBusinessDetails', getBusinessDetailsRes.data.data);
          }
        });
      }
    }
  };
</script>

<style scoped lang="scss">
.status {
  font-weight: bold;
  font-size: 16px;
  padding: 5px 10px;
  margin-bottom: 10px;
}

.message {
  margin-bottom: 20px;
}

.message p {
  margin-bottom: 10px;
}

.message ol {
  text-align: left;
  margin-left: 20px;
  margin-bottom: 10px;
}

.message ol li {
  margin-bottom: 5px;
}
</style>
