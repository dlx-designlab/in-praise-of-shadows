/* eslint-disable global-require */
import Vue from 'vue';
import DatGui from '@cyrilf/vue-dat-gui';
import VueI18n from 'vue-i18n';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(DatGui);
Vue.use(VueI18n);

const messages = {
  en: require('./translations/en.json'),
  jp: require('./translations/jp.json'),
};

const i18n = new VueI18n({
  locale: 'en',
  messages,
});

new Vue({
  i18n,
  render: (h) => h(App),
}).$mount('#app');
