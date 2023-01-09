import Vue from 'vue'
import App from './App.vue'
import router from './router'
import "@/libs/wallet"

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import "./assets/font/font.css";
import Loading from './components/Loading/Loading'
Vue.use(Loading)
import DeleteDialog from './components/DeleteDialog.vue'
Vue.component('DeleteDialog',DeleteDialog)

import IntoCollection from './components/IntoCollection.vue'
Vue.component('IntoCollection',IntoCollection)

Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
