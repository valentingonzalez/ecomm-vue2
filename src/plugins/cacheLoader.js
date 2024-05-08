import store from '@/store';

let homepageWidgets = localStorage.getItem('homepage');

store.commit('setHomepageSection', JSON.parse(homepageWidgets));
store.dispatch('setPreferences');
