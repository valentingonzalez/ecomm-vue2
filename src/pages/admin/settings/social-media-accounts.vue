<template>
  <div v-if="$ezHasNoPermission('manage_social_media')">
    <no-permission-truevalue page="Social Media Accounts"></no-permission-truevalue>
  </div>
  <div class="bg-white  h-100" v-else>
    <div class="settings-header">
      <div class="settings-header-info">
        <h1>Social Media Accounts</h1>
        <b-toast id="update-toast" variant="success" title="Updated" auto-hide-delay="2000" is-status>
          Successfully updated link!
        </b-toast>
      </div>
    </div>
    <div class="settings-body">
      <h5 class="mb-1">Integrate your social media with EZ-Commerce.</h5>
      <p class="text-muted">Paste the link for social media accounts, so your customers can connect.</p>

      <form id="socialInputs">
        <div class="d-flex align-items-center align-items-sm-end mb-4">
          <div class="social-img mr-3">
            <img src="/images/social-facebook.png" height="50" alt="Facebook" />
          </div>
          <div class="form-group mb-0" :class="{ 'form-group--error': !$v.facebook.validateUrl, 'valid': facebook != '' && $v.facebook.validateUrl }">
            <label class="mb-1" for="facebook">Facebook</label>
            <input v-model.trim="$v.facebook.$model" type="text" id="facebook" name="facebook" placeholder="Facebook" class="form-control" @blur="saveData" @keydown="startInteracting">
            <div class="invalid-feedback" style="display:block !important;" v-if="!$v.facebook.validateUrl">Please, insert a valid facebook url</div>
          </div>
        </div>
        <div class="d-flex align-items-center align-items-sm-end mb-4">
          <div class="social-img mr-3">
            <img src="/images/social-instagram.png"  height="50" alt="Instagram" />
          </div>
          <div class="form-group mb-0" :class="{ 'form-group--error': !$v.instagram.validateUrl, 'valid': instagram != '' && $v.instagram.validateUrl }">
            <label class="mb-1" for="instagram">Instagram</label>
            <input type="text" v-model.trim="$v.instagram.$model" id="instagram" name="instagram" placeholder="Instagram" class="form-control" @blur="saveData" @keydown="startInteracting" />
            <div class="invalid-feedback" style="display:block !important;" v-if="!$v.instagram.validateUrl">Please, insert a valid instagram url</div>
          </div>
        </div>
        <div class="d-flex align-items-center align-items-sm-end mb-4">
          <div class="social-img mr-3">
            <img src="/images/social-twitter.png"  height="50" alt="Twitter" />
          </div>
          <div class="form-group mb-0" :class="{ 'form-group--error': !$v.twitter.validateUrl, 'valid': twitter != '' && $v.twitter.validateUrl }">
            <label class="mb-1" for="twitter">Twitter</label>
            <input type="text" v-model.trim="$v.twitter.$model" id="twitter" name="twitter" placeholder="Twitter" class="form-control" @blur="saveData" @keydown="startInteracting" />
            <div class="invalid-feedback" style="display:block !important;" v-if="!$v.twitter.validateUrl">Please, insert a valid twitter url</div>
          </div>
        </div>
        <div class="d-flex align-items-center align-items-sm-end mb-4">
          <div class="social-img mr-3">
            <img src="/images/social-youtube.png"  height="50" alt="Youtube" />
          </div>
          <div class="form-group mb-0" :class="{ 'form-group--error': !$v.youtube.validateUrl, 'valid': youtube != '' && $v.youtube.validateUrl }">
            <label class="mb-1" for="youtube">YouTube</label>
            <input type="text" v-model.trim="$v.youtube.$model" id="youtube" name="youtube" placeholder="YouTube" class="form-control" @blur="saveData" @keydown="startInteracting" />
            <div class="invalid-feedback" style="display:block !important;" v-if="!$v.youtube.validateUrl">Please, insert a valid youtube url</div>
          </div>
        </div>
        <div class="d-flex align-items-center align-items-sm-end mb-4">
          <div class="social-img mr-3">
            <img src="/images/pinterest.png" height="50" alt="Pinterest" />
          </div>
          <div class="form-group mb-0" :class="{ 'form-group--error': !$v.pinterest.validateUrl, 'valid': pinterest != '' && $v.pinterest.validateUrl }">
            <label class="mb-1" for="pinterest">Pinterest</label>
            <input type="text" v-model.trim="$v.pinterest.$model" id="pinterest" name="pinterest" placeholder="Pinterest" class="form-control" @blur="saveData" @keydown="startInteracting" />
            <div class="invalid-feedback" style="display: block !important;" v-if="!$v.pinterest.validateUrl">Please insert valid Pinterest url</div>
          </div>
        </div>
        <div class="d-flex align-items-center align-items-sm-end mb-4">
          <div class="social-img mr-3">
            <img src="/images/linkedin.png" height="50" alt="Linkedin" />
          </div>
          <div class="form-group mb-0" :class="{ 'form-group--error': !$v.linkedin.validateUrl, 'valid': linkedin != '' && $v.linkedin.validateUrl }">
            <label class="mb-1" for="linkedin">LinkedIn</label>
            <input type="text" v-model.trim="$v.linkedin.$model" id="linkedin" name="linkedin" placeholder="LinkedIn" class="form-control" @blur="saveData" @keydown="startInteracting"/>
            <div class="invalid-feedback" style="display: block !important;" v-if="!$v.linkedin.validateUrl">Please insert valid LinkedIn url</div>
          </div>
        </div>
        <div class="d-flex align-items-center align-items-sm-end mb-4">
          <div class="social-img mr-3">
            <img src="/images/tiktok.png" height="50" alt="Tiktok" />
          </div>
          <div class="form-group mb-0" :class="{ 'form-group--error': !$v.tiktok.validateUrl, 'valid': tiktok != '' && $v.tiktok.validateUrl }">
            <label class="mb-1" for="tiktok">Tiktok</label>
            <input type="text" v-model.trim="$v.tiktok.$model" id="tiktok" name="tiktok" placeholder="Tiktok" class="form-control" @blur="saveData" @keydown="startInteracting"/>
            <div class="invalid-feedback" style="display: block !important;" v-if="!$v.tiktok.validateUrl">Please insert valid Tiktok url</div>
          </div>
        </div>
      </form>
      <div class="pt-3">
        <h5 class="mb-1">Product Share Options</h5>
        <p class="text-muted">Select the sharing options available to your customers for sharing your products.</p>
        <ShareOptions />
      </div>
    </div>
  </div>
</template>

<script>
  
  import HomepageService from '@/api-services/homepage.service';
  import AdminService from '@/api-services/admin.service';
  import NoPermissionTruevalue from "./no-permission-truevalue";
  import ShareOptions from "@/components/admin/social-media/share-options.vue";

  const validateUrl = param => {
    return value => {
      if (value == '')
        return true;
      var pattern = new RegExp('^(https?:\\/\\/)?'+
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
        '((\\d{1,3}\\.){3}\\d{1,3}))'+
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
        '(\\?[;&a-z\\d%_.~+=-]*)?'+
        '(\\#[-a-z\\d_]*|@[-a-z\\d_]*)?$','i');
      if(pattern.test(value)) {
        return value.includes(`${param}.com`);
      }
      return false;
    };
  };
  export default {
    name: 'SocialMediaAccounts',
    components: {
      NoPermissionTruevalue,
      ShareOptions
    },
    data() {
      return {
        facebook: '',
        twitter: '',
        instagram: '',
        youtube: '',
        pinterest: '',
        linkedin: '',
        tiktok: '',
        saving: false,
        interaction: false
      };
    },
    validations: {
      facebook: {
        validateUrl: validateUrl('facebook')
      },
      instagram: {
        validateUrl: validateUrl('instagram')
      },
      youtube: {
        validateUrl: validateUrl('youtube')
      },
      twitter: {
        validateUrl: validateUrl('twitter')
      },
      pinterest: {
        validateUrl: validateUrl('pinterest')
      },
      linkedin: {
        validateUrl: validateUrl('linkedin')
      },
      tiktok: {
        validateUrl: validateUrl('tiktok')
      }
    },
    async mounted() {
      if(this.$ezHasNoPermission('manage_social_media')) return;

      let resp = await HomepageService.getBusinessDetails();
      let data = resp.data.data;
      this.facebook = data.facebook_link != 'https://' && data.facebook_link ? data.facebook_link : '';
      this.twitter = data.twitter_link != 'https://' && data.twitter_link ? data.twitter_link : '';
      this.instagram = data.instagram_link != 'https://' && data.instagram_link ? data.instagram_link : '';
      this.youtube = data.youtube_link != 'https://' && data.youtube_link ? data.youtube_link : '';
      this.pinterest = data.pinterest_link != 'http://' && data.pinterest_link ? data.pinterest_link : '';
      this.linkedin = data.linkedin_link != 'http://' && data.linkedin_link ? data.linkedin_link : '';
      this.tiktok = data.tiktok_link != 'http://' && data.tiktok_link ? data.tiktok_link : '';
    },
    methods: {
      async saveData(evt) {
        if(this.$v[evt.target.id].validateUrl) {
          await AdminService.updateSocialLink({type: evt.target.id, url: evt.target.value});
          this.$bvToast.show('update-toast');
        }
      },
      checkDefaultText(evt) {
        let defaultText = evt.target.getAttribute('data-default');
        let val = evt.target.value;
        if(val.length <= defaultText.length) {
          evt.target.value = defaultText;
        }
      },
      startInteracting(evt) {
        let avoidKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Escape', 'Alt', 'Meta', 'Control', 'Shift', 'Tab', 'CapsLock', 'Enter'];
        if(!avoidKeys.find(e => e == evt.key)) { 
          this.interaction = true;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  #socialInputs {
    input[type=text] {
      width: 100%;
    }
    .social-img {
      width: 100px;
      display: flex;
      justify-content: center;
      + .form-group {
        width: 350px;
      }
    }
  }
  .valid input {
    border-color: var(--primary);
  }
  .form-group--error input {
    border-color: red;
  }

  @media (max-width: 500px) {
    #socialInputs {
      .social-img {
        width: 40px;
        display: none;
        img {
          width: 100%;
        }
      }
      .social-img + .form-group {
        flex: 1;
      }
    }
  }
</style>
