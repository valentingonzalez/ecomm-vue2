<template>
  <div v-show="is_cookie_set" class="row m-0 alert alert-info alert-dismissible privacy_policy fade show top-bg-1" role="alert">
    <button @click="closeCookieBanner" type="button" class="btn close-btn" data-dismiss="alert" aria-label="Close"></button>
    <div class="col-md-10">
      <b>This Site Utilizes Cookies To Enhance The User Experience</b>
      <p>By clicking Accept, you agree to this website storing cookies on your browser in order to enhance the website experience and for analytical purposes. To learn more about our privacy policy and use of cookies, please read our
        <a href="/privacy-policy" target="_blank"> privacy policy.</a>
      </p>
    </div>
    <div class="col-md-2 text-center">
      <button type="button" class="btn btn_cookies mr-10" @click="saveCookies" data-dismiss="alert" aria-label="Close" >
        Accept Cookies
      </button>
      <a href="/privacy-policy" target="_blank" class="cookies_mor_info privacyPolciy ml-10">More Information</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cookieBanner',
  data() {
    return {
      is_cookie_set: this.getCookie('poweredby') == '' ? true : false
    };
  },
  methods: {
    saveCookies() {
      var cname = 'poweredby';
      var cvalue = 'ezadtv';
      var exdays = 180;

      const d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      let expires = `expires=${d.toUTCString()}`;
      document.cookie = `${cname}=${cvalue};${expires};path=/`;

      this.saveLocalStorage(exdays);
      this.is_cookie_set = false;
    },
    getCookie(cname) {
      let name = `${cname}=`;
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if(c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return this.getLocalStorage();
    },

    // fallback localstorage in case cookies are getting wiped by plugin/app
    saveLocalStorage(exdays) {
      const expiration = Date.now() + (exdays * 86400 * 1000);
      window.localStorage.setItem('cookieBannerHide', "" + expiration);
    },
    getLocalStorage() {
      // this is set to the expiration timestamp
      const hide = window.localStorage.getItem('cookieBannerHide');
      if ( hide ) {
        const now = Date.now();
        if ( parseInt(hide) <= now ) {
          window.localStorage.removeItem('cookieBannerHide');
          return '';
        } else {
          return 'ezadtv';
        }
      }
      return '';
    },

    closeCookieBanner() {
      this.is_cookie_set = false;
    }
  }
};
</script>

<style scoped>
.privacy_policy {
  background-color: var(--primary);
  color: var(--white);
  border: none;
  border-radius: 0;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: +9999999;
  padding: 25px 46px 20px 10px;
}
.privacy_policy.top-bg-1::before,
.privacy_policy.top-bg-2::before {
  display: none;
}
.privacy_policy button.close-btn {
  background: transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  padding: 0;
  width: 12px;
  height: 12px;
  border: 0;
  border-radius: 0;
  position: absolute;
  top: 20px;
  right: 25px;
  filter: invert(1);
}
.privacy_policy strong{
  color: #ffffff;
  font-size: 18px;
  line-height: 20px;
}
.privacy_policy p{
  margin: 0;
  margin-top: 7px;
  font-size: 16px;
  line-height: 20px;
}
.privacy_policy a{
  color: #fff;
  font-weight: bold;
  border-bottom: 2px solid #fff;
  padding-bottom: 3px;
  text-decoration: none;
}
button.btn.btn_cookies {
  background-color: #fff;
  color: #000;
  border-radius: 20px;
  font-weight: 500;
  font-size: 16px;
  line-height: 18px;
  padding: 8px 13px 7px;
}
a.cookies_mor_info {
  color: #fff;
  margin-top: 18px;
  font-weight: 500;
  font-size: 16px;
  line-height: 18px;
  text-transform: capitalize;
  text-decoration: none;
  border-bottom: 2px solid #fff;
  display: inline-block;
}
.mr-10{
    margin-right: 10px;
}
.ml-10{
    margin-right: 10px;
}
</style>
