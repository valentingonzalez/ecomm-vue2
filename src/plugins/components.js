import Vue from 'vue';
import DefaultLayout from '@/layouts/default.vue';
import AdminLayout from '@/layouts/admin.vue';
import BlankLayout from '@/layouts/blank';
import MainHeader from '@/components/main-header.vue';
import MainNav from '@/components/main-nav.vue';
import Footer from '@/components/main-footer.vue';
import CookieBanner from '@/components/cookie-banner.vue';
import ProductItem from '@/components/product-item.vue';
import RentalItem from '@/components/rental-item.vue';
import MediaItem from '@/components/media-item.vue';
import TestimonialItem from '@/components/testimonial-item.vue';
import CountDown from '@/components/countdown.vue';
import ChangeQuantity from '@/components/change-quantity.vue';
import ProductChangeQuantity from '@/components/product-change-quantity.vue';
import CouponsSection from '@/components/sections/coupons-section.vue';
import DepartmentsSection from '@/components/sections/departments-section.vue';
import FavouriteProductsSection from '@/components/sections/favourite-products-section.vue';
import SimilarProductsSection from '@/components/sections/similar-products-section.vue';
import PopularProductsSection from '@/components/sections/popular-products-section.vue';
import PrincipleSection from '@/components/sections/principles-section.vue';
import BannerSection from '@/components/sections/banner-section.vue';
import SearchFilters from '@/components/search/filters.vue';
import SearchResults from '@/components/search/results.vue';
import HtmlEditor from '@/components/html-editor.vue';

import AuthWithEmail from '@/components/auth/email.vue';
import AuthWithPhone from '@/components/auth/phone.vue';
import VideoLightbox from '@/components/video-lightbox.vue';
import DepartmentSlider from '@/components/departments/department-slider.vue';
import DepartmentCategory from '@/components/departments/department-category.vue';
import CartItem from '@/components/cart/cart-item.vue';
import CartTotals from '@/components/cart/cart-totals.vue';
import CartMember from '@/components/cart/cart-member.vue';
import CartPayment from '@/components/cart/cart-payment.vue';
import RewardMembers from '@/components/cart/reward-members.vue';
import RedeemPromo from '@/components/cart/redeem-promo.vue';
import DepartmentSelector from '@/components/departments/department-selector.vue';

import StoreLocationModal from '@/components/modals/store-location.vue';
import PromoModal from '@/components/modals/promo.vue';
import DepartmentAlias from '@/components/modals/department-alias.vue';
import DepartmentSettings from '@/components/modals/department-settings.vue';

import BrandAlias from '@/components/modals/brand-alias.vue';
import BrandImage from '@/components/modals/brand-image.vue';

import ImageAltModal from '@/components/modals/product-editor-image-alt.vue';

import WizardModal from '@/components/modals/wizard-modal.vue';

import NewUpdateModal from '@/components/modals/new-update.vue';

import AdminProductItem from '@/components/admin/admin-product-item.vue';
import AdminFeaturedItem from '@/components/admin/admin-featured-item.vue';
import AdminCarouselSection from '@/components/admin/sections/carousel-section.vue';
import AdminDepartmentsSection from '@/components/admin/sections/departments-section.vue';
import AdminSubscribeSection from '@/components/admin/sections/subscribe-section.vue';
import AdminCarouselCard from '@/components/admin/admin-carousel-card.vue';
import AdminFormCustomFields from '@/components/admin/admin-form-custom-fields.vue';
import CustomInputFields from '@/components/custom-input-fields.vue';

import ClassicHtmlEditor from '@/components/widgets/classic-html-editor.vue';

import IsSaved from '@/components/is-saved.vue';

import Logger from '@/components/debug/logger';

import Wizard from '@/components/wizard/wizard';

import FreeUpgradeModal from '@/components/modals/free-upgrade-modal.vue';
import CheckoutNav from '@/components/cart/checkout-nav.vue';

import lazyLoadComponent from '@/plugins/lazy-load-component';

import SkeletonBox from '@/components/SkeletonBox.vue';
import Carousel from '@/components/widgets/carousel.vue';
import WidgetHeader from '@/components/widgets/widget-header.vue';
import TextareaAutosize from 'vue-textarea-autosize';

Vue.use(TextareaAutosize);

Vue.component('DefaultLayout', DefaultLayout);
Vue.component('AdminLayout', AdminLayout);
Vue.component('BlankLayout', BlankLayout);
Vue.component('MainHeader', MainHeader);
Vue.component('MainNav', MainNav);
Vue.component('MainFooter', Footer);
Vue.component('CookieBanner', CookieBanner);

Vue.component('coupons-section', CouponsSection);
Vue.component('departments-section', DepartmentsSection);
Vue.component('favourite-products-section', FavouriteProductsSection);
Vue.component('similar-products-section', SimilarProductsSection);
Vue.component('popular-products-section', PopularProductsSection);
Vue.component('principles-section', PrincipleSection);
Vue.component('banner-section', BannerSection);

Vue.component('search-filters', SearchFilters);
Vue.component('search-results', SearchResults);
Vue.component('rental-item', RentalItem);
Vue.component('ProductItem', ProductItem);
Vue.component('media-item', MediaItem);
Vue.component('TestimonialItem', TestimonialItem);
Vue.component('change-quantity', ChangeQuantity);
Vue.component('product-change-quantity', ProductChangeQuantity);
Vue.component('HtmlEditor', HtmlEditor);

Vue.component('auth-with-email', AuthWithEmail);
Vue.component('auth-with-phone', AuthWithPhone);
Vue.component('video-lightbox', VideoLightbox);
Vue.component('department-slider', DepartmentSlider);
Vue.component('department-category', DepartmentCategory);
Vue.component('cart-member', CartMember);
Vue.component('cart-item', CartItem);
Vue.component('cart-totals', CartTotals);
Vue.component('cart-payment', CartPayment);
Vue.component('reward-members', RewardMembers);
Vue.component('redeem-promo', RedeemPromo);
Vue.component('department-selector', DepartmentSelector);

Vue.component('store-location-modal', StoreLocationModal);
Vue.component('promo-modal', PromoModal);
Vue.component('department-alias', DepartmentAlias);
Vue.component('department-settings', DepartmentSettings);

Vue.component('brand-alias', BrandAlias);
Vue.component('brand-image', BrandImage);

Vue.component('alt-images', ImageAltModal);

Vue.component('WizardModal', WizardModal);

Vue.component('new-update', NewUpdateModal);

Vue.component('admin-product-item', AdminProductItem);
Vue.component('admin-featured-item', AdminFeaturedItem);
Vue.component('admin-carousel-section', AdminCarouselSection);
Vue.component('admin-departments-section', AdminDepartmentsSection);
Vue.component('admin-subscribe-section', AdminSubscribeSection);
Vue.component('admin-carousel-card', AdminCarouselCard);
Vue.component('admin-form-custom-fields', AdminFormCustomFields);
Vue.component('custom-input-fields', CustomInputFields);


const defaultOptions = {
  loading: SkeletonBox,
  loadingData: {
    props: {
      width: `100%`,
      height: `20em`,
    },
  },
};
const lazyLoad = (componentFactory) =>
lazyLoadComponent({ componentFactory, ...defaultOptions });

Vue.component('ProductSwiper', lazyLoad(() => import('@/components/widgets/product-swiper.vue')));
Vue.component('BomSwiper', lazyLoad(() => import('@/components/widgets/bom-swiper.vue')));
Vue.component('HtmlWrapper', lazyLoad(() => import('@/components/widgets/html-wrapper.vue')));
Vue.component('FeaturedProductsSwiper', lazyLoad(() => import('@/components/widgets/featured-products-swiper.vue')));
Vue.component('ImageSwiper', lazyLoad(() => import('@/components/widgets/image-swiper.vue')));
Vue.component('Testimonials', lazyLoad(() => import('@/components/widgets/testimonials.vue')));
Vue.component('Subscription', lazyLoad(() => import('@/components/widgets/subscription.vue')));
Vue.component('ClassicHtmlEditor', ClassicHtmlEditor);
Vue.component('ShopByDepartment', lazyLoad(() => import('@/components/widgets/shop-by-department.vue')));
Vue.component('RecentViewedSwiper', lazyLoad(() => import('@/components/widgets/recent-viewed-swiper.vue')));
Vue.component('Carousel', Carousel);
Vue.component('WidgetHeader', WidgetHeader);

Vue.component('is-saved', IsSaved);

Vue.component('countdown', CountDown);
Vue.component('Logger', Logger);

Vue.component('Wizard', Wizard);

Vue.component('FreeUpgradeModal', FreeUpgradeModal);
Vue.component('checkout-nav', CheckoutNav);
