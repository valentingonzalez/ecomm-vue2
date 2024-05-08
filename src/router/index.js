import Vue from 'vue';
import Router from 'vue-router';
import { routes } from './routes';

import BreadcrumbMonitor from './breadcrumb.middleware';
import {handleFakeGASession} from "@/plugins/analytics";

Vue.use(Router);

if ( window.__EZ_SVELTE ) {
  const adminOnly = function(to, from, next) {
    window.location.href = to.fullPath;
    return false;
  };

  // only allow admin routes. just modify the top level ones, should be good enough.
  routes.forEach(r => {
    if ( !r.path.startsWith('/admin') && r.path !== '*' && r.path !== '/login' && !r.beforeEnter ) {
      r.beforeEnter = adminOnly;
    }
  });
}

const router = new Router({
  mode: window.__EZ_SVELTE ? 'hash' : 'history',
  routes: routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});

// interceptor for auth system
router.beforeEach(async (to, from, next) => {
  BreadcrumbMonitor.capture(from, to);
  handleFakeGASession();
  return next();
});

export default router;
