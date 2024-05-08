import Vue from 'vue';
import 'vue-awesome/icons';
import AuthController from '@/controllers/auth.controller';
import BootstrapVue from 'bootstrap-vue';
import VueSelect, {CoolSelect} from 'vue-cool-select';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import VueClazyLoad from 'vue-clazy-load';
import vPagination from 'vue-plain-pagination';
import VueIcon from 'vue-awesome/components/Icon';
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead';
import VueYoutube from 'vue-youtube';
import VueAutosuggest from 'vue-autosuggest';
import ProductZoomer from 'vue-product-zoomer';
import * as VueGoogleMaps from 'vue2-google-maps';
import Vuelidate from 'vuelidate';
import VueTimeago from 'vue-timeago';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import vueDebounce from 'vue-debounce';
import AsyncComputed from 'vue-async-computed';
import VueGeolocationApi from 'vue-geolocation-api';
import CKEditor from '@ckeditor/ckeditor5-vue';
import VShowSlide from 'v-show-slide';
import VueSignaturePad from 'vue-signature-pad';
import VuePagination from '@/components/pagination';
import linkify from 'vue-linkify';

Vue.directive('linkified', linkify);
Vue.component('cool-input', CoolSelect);
Vue.component('v-pagination', vPagination);
Vue.component('VueIcon', VueIcon);
Vue.component('vue-bootstrap-typeahead', VueBootstrapTypeahead);
Vue.component('VuePagination', VuePagination);
Vue.use(vueDebounce);
Vue.use(VueAwesomeSwiper);
Vue.use(BootstrapVue);
Vue.use(VueYoutube);
Vue.use(VueAutosuggest);
Vue.use(ProductZoomer);
Vue.use(CKEditor);
Vue.use(VShowSlide);
Vue.use(Vuelidate);
Vue.use(VueTimeago, {
  name: 'Timeago', // Component name, `Timeago` by default
  locale: 'en'
});
Vue.use(VueSweetalert2);
Vue.use (VueSelect, {
  theme: 'bootstrap',
});
Vue.use (VueClazyLoad);
Vue.use(VueGeolocationApi);
Vue.use(VueGoogleMaps, {
  load: {
    key: window.__EZ_GMAPS_KEY,
  }
});
Vue.use(AsyncComputed);

Vue.filter('productPrice', (price) => {
  if (!price) return;
  return (Math.round(+(price) * 100) / 100).toFixed(2);
});

Vue.use(VueSignaturePad);

AuthController.initStoreAuth();
