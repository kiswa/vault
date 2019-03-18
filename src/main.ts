import Vue from 'vue';
import axios from 'axios';

import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

const api = axios.create({ baseURL: 'http://localhost:3128' });

Vue.prototype.$http = api;
Vue.prototype.$eventBus = new Vue();

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');

