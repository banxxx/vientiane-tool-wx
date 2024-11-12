import App from './App'

// #ifndef VUE3
import Vue from 'vue';
import './uni.promisify.adaptor';
import store from './store';

Vue.config.productionTip = false
App.mpType = 'app'


import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

// 引入全局TuniaoUI
import TuniaoUI from 'tuniao-ui'
Vue.use(TuniaoUI)

// 引入TuniaoUI提供的vuex简写方法
let vuexStore = require('@/store/$t.mixin.js')
Vue.mixin(vuexStore)

const app = new Vue({
	...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue';
import store from './store';
export function createApp() {
	const app = createSSRApp(App);
	app.use(store);
	return {
		app
	}
}
// #endif