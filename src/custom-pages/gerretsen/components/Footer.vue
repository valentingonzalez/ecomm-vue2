<template>
  <footer v-if="businessInfo">

    <MailingList></MailingList>

    <section class="business-info">
      <div class="container">
        <div class="row">
          <div class="col-12 col-sm-6 col-md-6">
            <div class="row">
              <div class="col-12 col-md-6">
                <FooterLogo />
              </div>
              <div class="col-12 col-md-6">
                <FooterLocation />
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-md-6">
            <div class="row">
              <div class="col-12 col-md-6">
                <FooterAboutInfo />

                <div class="d-none d-md-block social-media-wrapper">
                  <h5 class="connect-with-us info-text"><strong>Connect with us</strong></h5>
                  <a v-if="$store.state.settings.footer.facebookPage" :href="$store.state.settings.footer.facebookPage" target="_blank" aria-label="Facebook">
                    <img width="35px" height="35px" class="fb-logo" src="/images/fb-rounded-image.png" alt="Facebook">
                  </a>
                  <a v-if="$store.state.settings.footer.instagramPage" :href="$store.state.settings.footer.instagramPage" target="_blank" class="ml-1" aria-label="Instagram">
                    <img width="30px" height="30px" class="fb-logo" src="/images/ig-rounded-image.png" alt="Instagram">
                  </a>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <FooterResources />

                <div class="d-block d-md-none social-media-wrapper">
                  <h5 class="connect-with-us info-text"><strong>Connect with us</strong></h5>
                  <a v-if="$store.state.settings.footer.facebookPage" :href="$store.state.settings.footer.facebookPage" target="_blank" aria-label="Facebook">
                    <img width="35px" height="35px" class="fb-logo" src="/images/fb-rounded-image.png" alt="Facebook">
                  </a>
                  <a v-if="$store.state.settings.footer.instagramPage" :href="$store.state.settings.footer.instagramPage" target="_blank" class="ml-1" aria-label="Instagram">
                    <img width="30px" height="30px" class="fb-logo" src="/images/ig-rounded-image.png" alt="Instagram">
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center">
          <p class="m-0">Copyright &copy; {{ currentYear() }} {{ $store.state.settings.businessName }}. All rights reserved.</p>
        </div>
      </div>
    </section>

    <About />

    <FamilyOfCompanies />

  </footer>
</template>

<script>
import MailingList from './MailingList';
import FooterLogo from './FooterLogo';
import FooterLocation from "./FooterLocation";
import FooterAboutInfo from "./FooterAboutInfo";
import FooterResources from './FooterResources';
import FamilyOfCompanies from "./FamilyOfCompanies";
import About from './About';

export default {
  name: "Footer",
  components: {
    MailingList,
    FooterLogo,
    FooterLocation,
    FooterAboutInfo,
    FooterResources,
    FamilyOfCompanies,
    About,
  },
  computed: {
    businessInfo() {
      return this.$store.state.businessInfo;
    },
  },
  mounted() {
  },
  methods: {
    currentYear() {
      return (new Date).getFullYear();
    }
  }
};
</script>

<style lang="scss" scoped>
footer {
  margin-top: 60px;
}

.business-info {
  padding: 60px 40px 30px 40px;
  text-align: left;
  background-color: #E2E2E2;

  p {
    color: #0a5560;
  }
}

.info-wrapper {
  padding-bottom: 24px;

  .info-text {
    margin-bottom: 0;
    padding-bottom: 24px;
    font-size: 20px;
    font-weight: bold;
  }

  ul {
    padding-left: 0;
    margin-bottom: 0;
    li {
      padding-bottom: 10px;
    }
    li:last-child {
      padding-bottom: 0;
    }
  }
}

.connect-with-us {
  margin-bottom: 12px;
}

.social-media-wrapper {
  margin-bottom: 30px;
}

</style>
