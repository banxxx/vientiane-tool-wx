// store/index.js

import Vue from 'vue';
import Vuex from 'vuex';

// 注册 Vuex
Vue.use(Vuex);

// 创建 Vuex Store
const store = new Vuex.Store({
	state: {
		count: 0,
		user: {
			avatarUrl: 'https://bcdn.banxx.cn/svg/bbblurry.svg',
			nickname: '游客'
		}
	},
	mutations: {
		increment(state) {
			state.count++;
		},
		SET_USER_INFO(state, userInfo) {
			state.user.avatarUrl = userInfo.avatarUrl || state.user.avatarUrl;
			state.user.nickname = userInfo.nickname || state.user.nickname;
		}
	},
	actions: {
		increment({
			commit
		}) {
			commit('increment');
		},
		setUserInfo({
			commit
		}, userInfo) {
			commit('SET_USER_INFO', userInfo);
		}
	},
	getters: {
		getUser(state) {
			return state.user;
		}
	}
});

export default store;