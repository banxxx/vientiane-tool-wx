<template>
	<view class="page-myself">
		<view class="top-box">
			<view class="top-backgroup">
				<image :src="vuex_user.avatarUrl" mode='widthFix' class='backgroud-image'>
				</image>
			</view>
			<view class="cl-login" @click="login()">
				<!-- 头像框 -->
				<view class="cl-large-circle">
					<view class="login-image"></view>
				</view>
				<!-- 昵称 -->
				<view class="nick-name">{{vuex_user.nickname}}</view>
			</view>
		</view>
		<view class="bottom_box">
			<!-- 兑换 -->
			<view class="cl-CDKEY">
				<image src="https://bcdn.banxx.cn/svg/coupon.svg"></image>
				<text>兑换</text>
			</view>
			<!-- 反馈 -->
			<view class="cl-feedback">
				<image src="https://bcdn.banxx.cn/svg/wirte.svg"></image>
				<text>反馈</text>
			</view>
		</view>
		<view>
			<!-- 提示窗示例 -->
			<u-notify message="Hi uView" ref="uNotify"></u-notify>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'PageMyself',
		computed: {},
		data() {
			return {
				show: true
			}
		},
		onLoad() {

		},
		methods: {
			login() {
				console.log("process.env.UNI_PLATFORM:", process.env.UNI_PLATFORM);
				if (process.env.UNI_PLATFORM === 'mp-weixin') {
					// 调用微信登录接口
					uni.login({
						provider: 'weixin', // 指定使用微信的登录
						success: (res) => {
							if (res.errMsg === 'login:ok') {
								console.log('登录成功，获取的 code: ', res.code);
								// 这里可以将 code 发送到您的服务器进行后续处理
								this.getUserInfo(res.code);
							} else {
								console.error('登录失败: ', res.errMsg);
							}
						},
						fail: (err) => {
							console.error('uni.login 调用失败: ', err);
						}
					});
				} else if (process.env.UNI_PLATFORM === 'mp-toutiao') {
					// 调用抖音登录接口
				} else if (process.env.UNI_PLATFORM === 'mp-qq') {
					// 调用QQ登录接口
				} else {
					console.log("当前平台不支持登录");
					this.$refs.uNotify.show({
						top: 10,
						type: 'error',
						color: '#909399',
						bgColor: '#ffffff',
						message: '当前平台不支持登录',
						duration: 1000 * 2,
						fontSize: 16,
						safeAreaInsetTop: true
					})
				}
			},
			getUserInfo(code) {
				console.log("code:", code);
				// 这里您可以使用 code 调用服务器的接口
				// uni.request({
				// 	url: 'https://yourserver.com/api/login', // 替换为您的服务器地址
				// 	method: 'POST',
				// 	data: {
				// 		code: code // 将获取到的 code 发送给服务器
				// 	},
				// 	success: (response) => {
				// 		console.log('用户信息: ', response.data);
				// 		// 处理登录成功后的逻辑，如保存用户信息等
				// 	},
				// 	fail: (error) => {
				// 		console.error('请求失败: ', error);
				// 	}
				// });
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-myself {
		max-height: 100vh;
	}

	/* 自定义导航栏内容 start */
	.custom-nav {
		height: 100%;

		&__back {
			margin: auto 30rpx;
			font-size: 40rpx;
			margin-right: 10rpx;
			flex-basis: 5%;
			width: 100rpx;
			position: absolute;
		}
	}

	/* 自定义导航栏内容 end */

	.top-box {}

	/* 顶部背景图 start */
	.top-backgroup {
		height: 350rpx;
		z-index: -1;

		.backgroud-image {
			width: 100%;
			height: 450rpx;
			z-index: -1;
		}
	}

	.cl-login {
		z-index: 2;
		display: flex;
		margin-left: 50rpx;

		.cl-large-circle {
			width: 150rpx;
			height: 150rpx;
			border-radius: 50%;
			display: grid;
			place-items: center;
			z-index: 5;
		}

		.login-image {
			width: 140rpx;
			height: 140rpx;
			border-radius: 50%;
			background-image: url('https://bcdn.banxx.cn/svg/b9.png');
			background-size: cover;
			overflow: hidden;
			z-index: 10;
		}

		.nick-name {
			font-size: 40rpx;
			text-align: center;
			line-height: 150rpx;
			margin-left: 20rpx;
		}
	}

	.bottom_box {
		padding: 20rpx;
		gap: 30px;
		margin-top: 200rpx;
		display: grid;
		// 设置居中
		place-items: center;

		.cl-CDKEY {
			width: 90%;
			height: 100rpx;
			border: 2rpx solid #606060;
			border-radius: 30rpx;
			display: flex;
			align-items: center;
		}

		.cl-feedback {
			width: 90%;
			height: 100rpx;
			border: 2rpx solid #606060;
			border-radius: 30rpx;
			display: flex;
			align-items: center;
		}

		image {
			width: 50rpx;
			height: 50rpx;
			margin-left: 20rpx;
		}

		text {
			color: #909399;
			margin-left: 20rpx;
		}
	}
</style>