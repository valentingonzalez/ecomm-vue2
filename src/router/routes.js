import { requireAuth } from '@/plugins/requireAuth';
import { requireGuest } from '@/plugins/requireGuest';
import { requireClient } from '@/plugins/requireClient';

const isBenjaminMoore = String(window.__EZ_IS_BENJAMINMOORE).toLowerCase() == 'true' || String(process.env.VUE_APP_IS_BENJAMINMOORE).toLowerCase() == 'true' || false;

function loadPage(page) {
  return () => import(/* webpackChunkName: "page-[request]" */ `@/pages/${page}.vue`);
}

// async function checkBusiness(to, from, next) {
//   console.log(JSON.stringify(store.state.customPages));

// }
let routes = [
  {
    path: '/',
    name: 'index',
    alias: '/home',
    components: {
      default: loadPage('index'),
      catalog: loadPage('index-catalog'),
    },
    meta: {
      layout: 'default'
    }
  },
  {
    path: "/all-products-iframe/:widgetId",
    name: "all-products-iframe",
    components: {
      default: loadPage("all-products-iframe"),
      catalog: loadPage("all-products-iframe")
    }
  },
  {
    path: '/register',
    name: 'register',
    components: {
      default: loadPage('auth/register'),
      catalog: loadPage('auth/register')
    },
    meta: {
      layout: 'default'
    },
    beforeEnter: requireGuest,
  },
  {
    path: '/login',
    name: 'login',
    components: {
      default: loadPage('auth/login'),
      catalog: loadPage('auth/login')
    },
    meta: {
      layout: 'default'
    },
    beforeEnter: requireGuest,
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    components: {
      default: loadPage('auth/reset-password'),
      catalog: loadPage('auth/reset-password')
    },
    meta: {
      layout: 'default'
    },
    props: true,
    beforeEnter(to, from, next) {
      if(from.path === '/login' || from.path === '/cart') {
        next();
      } else {
        next('/login');
      }
    }
  },
  {
    path: '/magic-link-redirect',
    name: 'magic-link-redirect',
    components: {
      default: loadPage('auth/magic-link-redirect'),
      catalog: loadPage('auth/magic-link-redirect')
    },
    meta: {
      layout: 'default'
    },
    props: true
  },
  {
    path: '/cart',
    name: 'cart',
    components: {
      default: loadPage('cart'),
      catalog: loadPage('cart')
    },
    meta: {
      layout: 'default'
    }
  },
  {
    path: '/p/:slug',
    alias: '/products/:slug',
    name: 'products-slug',
    components: {
      default: loadPage('products/single'),
      catalog: loadPage('products/single')
    },
    meta: {
      layout: 'default',
      type: 'product'
    }
  },
  {
    path: '/p/:id/:title',
    alias: '/products/:id/:title',
    name: 'products-id',
    components: {
      default: loadPage('products/single'),
      catalog: loadPage('products/single')
    },
    meta: {
      layout: 'default',
      type: 'product'
    }
  },
  {
    path: '/departments',
    name: 'departments',
    components: {
      default: loadPage('departments/index'),
      catalog: loadPage('departments/index')
    },
    meta: {
      layout: 'default'
    }
  },
  {
    path: '/departments/:id',
    name: 'departments-id',
    components: {
      default: loadPage('departments/single'),
      catalog: loadPage('departments/single')
    },
    meta: {
      layout: 'default'
    }
  },
  {
    path: '/department/:id/:title',
    alias: '/d/:id/:title',
    name: 'department-products',
    components: {
      default: loadPage('department-products'),
      catalog: loadPage('department-products')
    },
    meta: {
      type: 'department',
      layout: 'default'
    }
  },
  {
    path: '/department/:slug',
    alias: '/d/:slug',
    name: 'department-products-slug',
    components: {
      default: loadPage('department-products'),
      catalog: loadPage('department-products')
    },
    meta: {
      layout: 'default'
    }
  },
  {
    path: '/search/:dummy?',
    name: 'search',
    components: {
      default: loadPage('search'),
      catalog: loadPage('search')
    },
    meta: {
      layout: 'default'
    },
    props: route => ({
      keyword: route.query.keyword,
      deptId: route.query.deptId,
      deptName: route.query.deptName
    })
  },
  {
    path: '/search/:id/:title',
    name: 'search_with_product',
    components: {
      default: loadPage('search'),
      catalog: loadPage('search')
    },
    meta: {
      layout: 'default'
    },
    props: route => ({
      keyword: route.query.keyword,
      deptId: route.query.deptId,
      deptName: route.query.deptName
    })
  },
  {
    path: '/brands',
    name: 'brands',
    components: {
      default: loadPage('brands/index'),
      catalog: loadPage('brands/index')
    },
    meta: {
      layout: 'default',
      type: 'brands'
    },
    props: route => ({
      keyword: route.query.keyword
    })
  },
  {
    path: '/brands/page/:page',
    name: 'brands_page',
    components: {
      default: loadPage('brands/index'),
      catalog: loadPage('brands/index')
    },
    meta: {
      layout: 'default',
      type: 'brand'
    },
    props: route => ({
      keyword: route.query.keyword
    })
  },
  {
    // for slug, :title is missing and :id has the slug.
    path: '/b/:id/:title?',
    alias: '/brands/:id/:title?',
    name: 'brands-id',
    components: {
      default: loadPage('brands/single'),
      catalog: loadPage('brands/single')
    },
    meta: {
      layout: 'default',
      type: 'brand'
    }
  },
  {
    path: '/rentals/rental-form',
    name: 'rental-form',
    components: {
      default: loadPage('rental-form'),
      catalog: loadPage('rental-form')
    },
    meta: {
      layout: 'default'
    }
  },
  {
    path: '/rentals',
    name: 'rentals',
    components: {
      default: loadPage('rentals'),
      catalog: loadPage('rentals')
    },
    meta: {
      layout: 'default',
      type: 'rentals'
    },
    props: route => ({
      deptId: route.query.deptId,
      subDeptId: route.query.subDeptId
    })
  },
  {
    // Page name was changed to /store-info
    path: '/about-us',
    name: 'about-us',
    redirect: '/store-info',
  },
  {
    path: '/privacy-policy',
    name: 'privacy-policy',
    components: {
      default: loadPage('privacy-policy'),
      catalog: loadPage('privacy-policy')
    },
    meta: {
      layout: 'default'
    }
  },
  {
    path: '/policy_california',
    name: 'policy_california',
    components: {
      default: loadPage('policy_california'),
      catalog: loadPage('policy_california')
    },
    meta: {
      layout: 'default'
    }
  },
  {
    path: '/store-info',
    name: 'store-info',
    components: {
      default: loadPage('about-us'),
      catalog: loadPage('about-us')
    },
    meta: {
      layout: 'default'
    }
  },
  {
    path: '/settings',
    name: 'settings-index',
    redirect: '/settings/account',
    beforeEnter: requireClient,
    components: {
      default: loadPage('settings/index'),
      catalog: loadPage('settings/index')
    },
    meta: {
      layout: 'default'
    },
    children: [
      {
        path: '/orders',
        name: 'settings-orders',
        components: {
          default: loadPage('settings/orders'),
          catalog: loadPage('settings/orders')
        },
        meta: { layout: 'default' }
      },
      {
        path: '/savedcarts',
        name: 'settings-savedcarts',
        components: {
          default: loadPage('settings/savedcarts'),
          catalog: loadPage('settings/savedcarts')
        },
        meta: { layout: 'default' }
      },
      {
        path: '/recurring-orders',
        name: 'settings-recurring-orders',
        components: {
          default: loadPage('settings/recurring-orders'),
          catalog: loadPage('settings/recurring-orders')
        },
        meta: { layout: 'default' }
      },
      {
        path: '/account',
        name: 'settings-account',
        components: {
          default: loadPage('settings/account'),
          catalog: loadPage('settings/account')
        },
        meta: { layout: 'default' }
      },
      {
        path: '/payment',
        name: 'settings-payment',
        components: {
          default: loadPage('settings/account'),
          catalog: loadPage('settings/account')
        },
        meta: { layout: 'default' }
      }
    ]
  },
  {
    path: '/terms',
    name: 'terms',
    components: {
      default: loadPage('terms'),
      catalog: loadPage('terms')
    },
    meta: {
      layout: 'default'
    }
  },
  {
    path: '/product/shared/preview/:productId',
    name: 'IframeProductPreview',
    components: {
      default: loadPage('products/iframe-preview'),
      catalog: loadPage('products/iframe-preview')
    },
    meta: {
      layout: 'default'
    }
  },
  {
    path: '/admin',
    name: 'admin',
    redirect: 'admin/orders',
    meta: { layout: 'admin', permission: 'admin' },
    beforeEnter: requireAuth,
    props: true
  },
  {
    path: '/admin/stats',
    name: 'admin-stats',
    components: {
      default: loadPage('admin/stats'),
      catalog: loadPage('admin/stats')
    },
    meta: { layout: 'admin', permission: 'admin' },
    beforeEnter: requireAuth
  },
  {
    path: '/admin/tutorials',
    name: 'admin-tutorials',
    components: {
      default: loadPage('admin/tutorials'),
      catalog: loadPage('admin/tutorials')
    },
    meta: { layout: 'admin', permission: 'admin' },
    beforeEnter: requireAuth
  },
  {
    path: '/admin/settings',
    name: 'admin-settings',
    redirect: 'admin/settings/about-us',
    components: {
      default: loadPage('admin/settings'),
      catalog: loadPage('admin/settings')
    },
    meta: { layout: 'admin', permission: 'admin' },
    beforeEnter: requireAuth,
    children: [
      {
        path: 'about-us',
        name: 'admin-settings-about-us',
        components: {
          default: loadPage('admin/settings/about-us'),
          catalog: loadPage('admin/settings/about-us')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: 'locations',
        name: 'admin-settings-locations',
        components: {
          default: loadPage('admin/settings/locations'),
          catalog: loadPage('admin/settings/locations')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: 'report/:type?',
        name: 'admin-consultation-report',
        components: {
          default: loadPage('admin/settings/consultation-report'),
          catalog: loadPage('admin/settings/consultation-report')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: 'invoices',
        name: 'invoices',
        components: {
          default: loadPage('admin/settings/invoices'),
          catalog: loadPage('admin/settings/invoices')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: 'fulfillment-options',
        name: 'fulfillment-options',
        components: {
          default: loadPage('admin/settings/fulfillment-options'),
          catalog: loadPage('admin/settings/fulfillment-options')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: 'special-order-items',
        name: 'special-order-items',
        components: {
          default: loadPage('admin/settings/special-order-items'),
          catalog: loadPage('admin/settings/special-order-items')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: 'promo-codes',
        name: 'promo-codes',
        components: {
          default: loadPage('admin/settings/promo-codes'),
          catalog: loadPage('admin/settings/promo-codes')
        },
        meta: {
          layout: 'admin',
          permission: 'admin'
        },
        beforeEnter: requireAuth
      },      
      {
        path: 'product-editor/:random?',
        name: 'product-editor',
        components: {
          default: loadPage('admin/settings/product-editor'),
          catalog: loadPage('admin/settings/product-editor')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: 'rental-products',
        name: 'rental-products',
        components: {
          default: loadPage('admin/settings/rental-products/categories'),
          catalog: loadPage('admin/settings/rental-products/categories')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: 'rental-products/list/:category_id/:category_title?',
        name: 'rental-products-list',
        components: {
          default: loadPage('admin/settings/rental-products/products'),
          catalog: loadPage('admin/settings/rental-products/products')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: 'brands-settings',
        name: 'brands-settings',
        components: {
          default: loadPage('admin/settings/brands-settings'),
          catalog: loadPage('admin/settings/brands-settings')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: 'social-media-accounts',
        name: 'social-media-accounts',
        components: {
          default: loadPage('admin/settings/social-media-accounts'),
          catalog: loadPage('admin/settings/social-media-accounts')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: 'analytics-conversion-pixel',
        name: 'analytics-conversion-pixel',
        components: {
          default: loadPage('admin/settings/analytics-conversion-pixel'),
          catalog: loadPage('admin/settings/analytics-conversion-pixel')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: 'bank',
        name: 'admin-settings-bank',
        components: {
          default: loadPage('admin/settings/bank'),
          catalog: loadPage('admin/settings/bank')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: 'ar-accounts',
        name: 'admin-settings-ar-accounts',
        components: {
          default: loadPage('admin/settings/ar-accounts'),
          catalog: loadPage('admin/settings/ar-accounts')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: 'sub-accounts',
        name: 'admin-settings-sub-accounts',
        components: {
          default: loadPage('admin/settings/sub-accounts/index'),
          catalog: loadPage('admin/settings/sub-accounts/index')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth,
        children: [
          {
            path: '',
            name: 'admin-settings-sub-accounts-list',
            components: {
              default: loadPage('admin/settings/sub-accounts/list'),
              catalog: loadPage('admin/settings/sub-accounts/list')
            },
            meta: { layout: 'admin', permission: 'admin' },
          },
          {
            path: 'new',
            name: 'admin-settings-sub-accounts-new',
            components: {
              default: loadPage('admin/settings/sub-accounts/edit'),
              catalog: loadPage('admin/settings/sub-accounts/edit')
            },
            meta: { layout: 'admin', permission: 'admin' },
          },
          {
            path: 'edit/:slug',
            name: 'admin-settings-sub-accounts-edit',
            components: {
              default: loadPage('admin/settings/sub-accounts/edit'),
              catalog: loadPage('admin/settings/sub-accounts/edit')
            },
            meta: { layout: 'admin', permission: 'admin' },
          }
        ]
      },
      {
        path: 'discrepancy-report',
        name: 'admin-settings-discrepancy-report',
        components: {
          default: loadPage('admin/settings/discrepancy-report/index'),
          catalog: loadPage('admin/settings/discrepancy-report/index')
        },
        meta: { layout: 'admin', permission: 'admin' }
      },
      {
        path: 'department-mapping',
        name: 'admin-settings-department-mapping',
        components: {
          default: loadPage('admin/settings/department-mapping'),
          catalog: loadPage('admin/settings/department-mapping')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: 'transactional-emails',
        name: 'admin-settings-transactional-emails',
        components: {
          default: loadPage('admin/settings/transactional-emails'),
          catalog: loadPage('admin/settings/transactional-emails')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: 'header-and-footer',
        name: 'admin-settings-header-and-footer',
        components: {
          default: loadPage('admin/settings/header-and-footer'),
          catalog: loadPage('admin/settings/header-and-footer')
        },
        meta: {
          layout: 'admin',
          permission: 'admin'
        },
        beforeEnter: requireAuth
      },
      {
        path: 'pages',
        name: 'admin-settings-pages',
        components: {
          default: loadPage('admin/settings/pages/list'),
          catalog: loadPage('admin/settings/pages/list')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: 'pages/new',
        name: 'new-page',
        components: {
          default: loadPage('admin/settings/pages/single'),
          catalog: loadPage('admin/settings/pages/single')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: 'pages/edit/:id',
        name: 'edit-page',
        components: {
          default: loadPage('admin/settings/pages/single'),
          catalog: loadPage('admin/settings/pages/single')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: 'widgets',
        name: 'admin-settings-widgets',
        components: {
          default: loadPage('admin/settings/widgets/list'),
          catalog: loadPage('admin/settings/widgets/list')
        },
        meta: {
          layout: 'admin',
          permission: 'admin'
        },
        beforeEnter: requireAuth,
      },
      {
        path: 'product-suggesters',
        name: 'admin-settings-product-suggesters',
        components: {
          default: loadPage('admin/settings/product-suggesters/index'),
          catalog: loadPage('admin/settings/product-suggesters/index')
        },
        meta: { layout: 'admin' }
      },
      {
        path: 'top-banner',
        name: 'admin-settings-banner',
        components: {
          default: loadPage('admin/settings/top-banner'),
          catalog: loadPage('admin/settings/top-banner')
        },
        meta: { layout: 'admin' }
      },
      {
        path: 'ai-widgets-builder',
        name: 'admin-ai-widgets-builder',
        components: {
          default: loadPage('admin/settings/ai-widgets-builder'),
          catalog: loadPage('admin/settings/ai-widgets-builder')
        },
        meta: { layout: 'admin' }
      },
      {
        path: 'marketing',
        name: 'admin-marketing',
        components: {
          default: loadPage('admin/settings/marketing'),
          catalog: loadPage('admin/settings/marketing')
        },
        meta: { layout: 'admin' }
      },
      {
        path: 'dynamic-forms',
        name: 'admin-settings-dynamic-forms',
        components: {
          default: loadPage('admin/settings/dynamic-forms'),
          catalog: loadPage('admin/settings/dynamic-forms')
        },
        meta: { layout: 'admin' }
      },
      {
        path: 'search-synonyms',
        name: 'admin-settings-search-synonyms',
        components: {
          default: loadPage('admin/settings/search-synonyms'),
          catalog: loadPage('admin/settings/search-synonyms')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: '/admin/settings/special-fees',
        name: 'special-fees',
        components: {
          default: loadPage('admin/settings/special-fees'),
          catalog: loadPage('admin/settings/special-fees')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: '/admin/settings/google-merchant-center',
        name: 'google-merchant',
        components: {
          default: loadPage('admin/wizard/section/google-merchant-center/index'),
          catalog: loadPage('admin/wizard/section/google-merchant-center/index')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },      
    ]
  },

  {
    path: '/admin/orders',
    name: 'admin-orders',
    components: {
      default: loadPage('admin/orders/index'),
      catalog: loadPage('admin/orders/index')
    },
    meta: {
      layout: 'admin'
    },
    beforeEnter: requireAuth,
    redirect: '/admin/orders/list',
    children: [
      {
        path: '/admin/orders/list/:type?',
        name: 'admin-orders-list',
        components: {
          default: loadPage('admin/orders/orders'),
          catalog: loadPage('admin/orders/orders')
        },
        meta: { layout: 'admin', permission: 'admin' },
      },
      {
        path: '/admin/orders/reconciliation',
        name: 'admin-orders-reconciliation',
        components: {
          default: loadPage('admin/orders/reconciliation'),
          catalog: loadPage('admin/orders/reconciliation')
        },
        meta: { layout: 'admin', permission: 'admin' },
      },
      {
        path: '/admin/orders/shipping-labels',
        name: 'admin-orders-shipping-labels',
        components: {
          default: loadPage('admin/orders/shipping-labels'),
          catalog: loadPage('admin/orders/shipping-labels')
        },
        meta: { layout: 'admin', permission: 'admin' },
      },
      {
        path: '/admin/orders/rentals',
        name: 'admin-orders-rentals',
        components: {
          default: loadPage('admin/orders/rentals'),
          catalog: loadPage('admin/orders/rentals')
        },
        meta: { layout: 'admin', permission: 'admin' },
      },
      {
        path: '/admin/orders/recurring',
        name: 'admin-orders-recurring',
        components: {
          default: loadPage('admin/orders/recurring-orders'),
          catalog: loadPage('admin/orders/recurring-orders')
        },
        meta: { layout: 'admin', permission: 'admin' },
      }
    ]
  },
  {
    path: '/admin/prepare-order',
    name: 'admin-prepare-order',
    components: {
      default: loadPage('admin/prepare-order'),
      catalog: loadPage('admin/prepare-order')
    },
    meta: {
      layout: 'admin',
      hideFooter: true
    },
    beforeEnter: requireAuth
  },
  {
    path: '/admin/order-details/:id',
    name: 'order-details',
    components: {
      default: loadPage('admin/order-details'),
      catalog: loadPage('admin/order-details')
    },
    meta: {
      layout: 'admin'
    },
    beforeEnter: requireAuth
  },
  {
    path: '/admin/emails',
    name: 'admin-emails',
    components: {
      default: loadPage('admin/emails'),
      catalog: loadPage('admin/emails')
    },
    meta: {
      layout: 'admin'
    },
    beforeEnter: requireAuth
  },
  {
    path: '/admin/featured',
    name: 'admin-featured',
    components: {
      default: loadPage('admin/featured'),
      catalog: loadPage('admin/featured')
    },
    meta: {
      layout: 'admin'
    }
  },
  {
    path: '/admin/release-updates',
    name: 'release-updates',
    components: {
      default: loadPage('admin/release-updates'),
      catalog: loadPage('admin/release-updates')
    },
    meta: {
      layout: 'admin'
    },
    beforeEnter: requireAuth
  },
  {
    path: '/admin/page-editor/:type/:id?',
    name: 'pageeditor',
    params: true,
    components: {
      default: loadPage('admin/page-editor'),
      catalog: loadPage('admin/page-editor')
    },
    meta: {
      layout: 'froala'
    },
    beforeEnter: requireAuth
  },
  {
    path: '/admin/wizard',
    name: 'admin-wizard',
    redirect: '/admin/wizard/intro',
    components: {
      default: loadPage('admin/wizard/index'),
      catalog: loadPage('admin/wizard/index')
    },
    meta: { layout: 'admin', permission: 'admin' },
    beforeEnter: requireAuth,
    children: [
      {
        path: '/admin/wizard/intro',
        name: 'admin-wizard-intro',
        components: {
          default: loadPage('admin/wizard/intro'),
          catalog: loadPage('admin/wizard/intro')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: '/admin/wizard/setup',
        name: 'admin-wizard-setup',
        components: {
          default: loadPage('admin/wizard/setup'),
          catalog: loadPage('admin/wizard/setup')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: '/admin/wizard/section',
        name: 'admin-wizard-section',
        components: {
          default: loadPage('admin/wizard/section'),
          catalog: loadPage('admin/wizard/section')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: '/wizard-unsubscribe',
        name: 'wizard-unsubscribe',
        components: {
          default: loadPage('wizard-unsubscribe'),
          catalog: loadPage('wizard-unsubscribe')
        },
        meta: { layout: 'default' }
      },
    ],
  },
  {
    path: '/landing-page-auto-update-opt-out',
    name: 'landing-page-auto-update-opt-out',
    components: {
      default: loadPage('landing-page-auto-update-opt-out'),
      catalog: loadPage('landing-page-auto-update-opt-out')
    },
    meta: { layout: 'default' },
  },
  {
    path: '/local-ad',
    name: 'localAd',
    params: true,
    components: {
      default: loadPage('local-ad'),
      catalog: loadPage('local-ad')
    },
    meta: {
      layout: 'default'
    }
  },
  {
    path: '/promotions',
    name: 'PromotionsPage',
    components: {
      default: loadPage('promotions/index'),
      catalog: loadPage('promotions/index')
    },
    meta: {
      layout: 'default'
    }
  },
  {
    path: '/promotions/single/:slug',
    name: 'PromotionsSinglePage',
    components: {
      default: loadPage('promotions/single'),
      catalog: loadPage('promotions/single')
    },
    meta: {
      layout: 'default'
    }
  },
  {
    path: '/admin/brand-integrator',
    name: 'admin-brand-integrator',
    params: true,
    components: {
      default: loadPage('admin/brand-integrator/index'),
      catalog: loadPage('admin/brand-integrator/index')
    },
    meta: { layout: 'admin', permission: 'admin' },
    beforeEnter: requireAuth,
    children: [
      {
        path: '/admin/brand-integrator/generate',
        name: 'admin-brand-integrator-generate',
        components: {
          default: loadPage('admin/brand-integrator/generate'),
          catalog: loadPage('admin/brand-integrator/generate')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      },
      {
        path: '/admin/brand-integrator/report',
        name: 'admin-brand-integrator-report',
        components: {
          default: loadPage('admin/brand-integrator/report'),
          catalog: loadPage('admin/brand-integrator/report')
        },
        meta: { layout: 'admin', permission: 'admin' },
        beforeEnter: requireAuth
      }
    ]
  },
  {
    path: '/admin/promo-codes-analytics',
    name: 'promo-codes-analytics',
    components: {
      default: loadPage('admin/settings/promo-codes-analytics'),
      catalog: loadPage('admin/settings/promo-codes-analytics')
    },
    meta: {
      layout: 'admin',
      permission: 'admin'
    },
    beforeEnter: requireAuth
  },
  {
    path: '*',
    redirect: '/'
  }
];

if(isBenjaminMoore) {
  routes = [...routes, {
    path: '/colors',
    name: 'ColorsPage',
    components: {
      default: () => import(/* webpackChunkName: "page-[request]" */ `@/custom-pages/benjaminmoore/colors.vue`),
      catalog: () => import(/* webpackChunkName: "page-[request]" */ `@/custom-pages/benjaminmoore/colors.vue`)
    }
  }, {
    path: '/colors/family/:color',
    name: 'ColorFamilyPage',
    components: {
      default: () => import(/* webpackChunkName: "page-[request]" */ `@/custom-pages/benjaminmoore/color-family.vue`),
      catalog: () => import(/* webpackChunkName: "page-[request]" */ `@/custom-pages/benjaminmoore/color-family.vue`)
    }
  }, {
    path: '/colors/collection/:color',
    name: 'ColorCollectionPage',
    components: {
      default: () => import(/* webpackChunkName: "page-[request]" */ `@/custom-pages/benjaminmoore/color-collection.vue`),
      catalog: () => import(/* webpackChunkName: "page-[request]" */ `@/custom-pages/benjaminmoore/color-collection.vue`)
    }
  }, {
    path: '/paint-products/:category?',
    name: 'PaintProductsPage',
    components: {
      default: () => import(/* webpackChunkName: "page-[request]" */ `@/custom-pages/benjaminmoore/paint-products.vue`),
      catalog: () => import(/* webpackChunkName: "page-[request]" */ `@/custom-pages/benjaminmoore/paint-products.vue`)
    }
  }];
}
export { routes };