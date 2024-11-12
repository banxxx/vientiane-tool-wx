<template>
	<view class="page-classify">
		<!-- 顶部自定义导航 -->
		<tn-nav-bar :isBack="false" :bottomShadow="false" backgroundColor="none">
			<view class="custom-nav tn-flex tn-flex-col-center tn-flex-row-left">
				<view class="custom-nav__back">
					<text class="tn-text-bold tn-text-xl tn-color-black">分类</text>
				</view>
			</view>
		</tn-nav-bar>
		<view class="tn-classify__wrap" :style="{ paddingTop: vuex_custom_bar_height + 'px' }">

			<!-- 搜索框 -->
			<view class="tn-classify__search--wrap" style="padding-bottom: 20rpx;">
				<view class="tn-color-gray--dark"
					style="margin: 20rpx 30rpx 0rpx 30rpx;border-radius: 100rpx;padding-left: 6rpx;background-color: rgba(248, 247, 248, 0.9);"
					@click="tn('/pageA/search/search')">
					<!-- <tn-notice-bar :list="searlist" mode="vertical" leftIconName="search"
						:duration="6000"></tn-notice-bar> -->
				</view>
			</view>

			<!-- 分类列表和内容 -->
			<view class="tn-classify__container">
				<view style="background-color: transparent;"
					class="tn-classify__container__wrap tn-flex tn-flex-nowrap tn-flex-row-around">
					<!-- 左边容器 -->
					<scroll-view class="tn-classify__left-box left-width" :scroll-top="leftScrollViewTop" scroll-y
						scroll-with-animation :style="{ height: scrollViewHeight + 'px' }">
						<view v-for="(item, index) in tabbar" :key="index" :id="`tabbar_item_${index}`"
							class="tn-classify__tabbar__item tn-flex tn-flex-col-center tn-flex-row-center"
							:class="[tabbarItemClass(index)]" @tap.stop="clickClassifyNav(index)">
							<view class="tn-classify__tabbar__item__title">{{ item }}</view>
						</view>
					</scroll-view>

					<!-- 右边容器 -->
					<scroll-view class="tn-classify__right-box" scroll-y :scroll-top="rightScrollViewTop"
						:style="{ height: scrollViewHeight + 'px' }">
						<template v-if="classifyContent.subClassify && classifyContent.subClassify.length > 0">
							<view class="tn-classify__content">

								<!-- 分类内容子栏目 -->
								<view v-for="(item, index) in classifyContent.subClassify" :key="index"
									class="tn-classify__content__sub-classify">
									<!-- <view
										class="tn-classify__content__sub-classify--title tn-text-lg tn-padding-top-sm">
										{{ classifyContent.subClassify[0].title }}
									</view> -->

									<view
										class="tn-classify__content__sub-classify__content tn-flex tn-flex-wrap tn-flex-col-center tn-flex-row-left">
										<view v-for="(sub_item, sub_index) in item.classify" :key="sub_index"
											class="tn-classify__content__sub-classify__content__item tn-flex tn-flex-wrap tn-flex-row-center">
											<view class="tn-classify__content__sub-classify__content__image tn-flex tn-flex-col-center tn-flex-row-center"
												@click="toClick(sub_index)">
												<view class="cls-img">
													<image class="svg-image" :src="sub_item.icon">
													</image>
												</view>
												<!-- 标题，有需要可以显示出来 -->
												<view
													class="tn-classify__content__sub-classify__content__title tn-margin-top-xs tn-margin-bottom-sm">
													{{ sub_item.title }}
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>

						</template>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import listData from '@/libs/navigation/navigation.js'

export default {
	name: 'PageMyself',
	data() {
		return {
			searlist: [],
			// 侧边栏分类数据
			tabbar: [],
			// 分类里面的内容信息
			classifyContent: {
				// 子栏目
				subClassifyTabbar: [],
				// 显示子栏目分类选项
				showSubClassifyTabbar: false,
				// 每个子栏目下的内容
				subClassify: [{
					title: '',
					classify: [{
						icon: '',
						title: '',
						url: '',
						uid: '',
					}]
				}]
			},
			// 分类菜单item的信息
			tabbarItemInfo: [],
			// scrollView的top值
			scrollViewBasicTop: 0,
			// scrollView的高度
			scrollViewHeight: 0,
			// 左边scrollView的滚动高度
			leftScrollViewTop: 0,
			// 右边scrollView的滚动高度
			rightScrollViewTop: 0,
			// 当前选中的tabbar序号
			currentTabbarIndex: 0
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.getScrollViewInfo()
			this.getTabbarItemRect()
		})
	},
	onLoad() {

	},
	created() {
		this.getTabTitle();
	},
	computed: {
		tabbarItemClass() {
			return index => {
				if (index === this.currentTabbarIndex) {
					return 'tn-classify__tabbar__item--active'
				} else {
					let clazz = 'tn-bg-gray--light'
					if (this.currentTabbarIndex > 0 && index === this.currentTabbarIndex - 1) {
						clazz += ' tn-classify__tabbar__item--active--prev'
					}
					if (this.currentTabbarIndex < this.tabbar.length && index === this.currentTabbarIndex + 1) {
						clazz += ' tn-classify__tabbar__item--active--next'
					}
					return clazz
				}
			}
		}
	},
	methods: {
		getTabTitle() {
			// 使用 map 方法提取 name 字段
			const namesArray = listData.data.map(item => item.title);
			this.tabbar = namesArray
			this.classifyContent.subClassify[0] = JSON.parse(JSON.stringify(listData.data[0]));
			console.log("listData.data--->:", listData.data);
		},
		// 获取scrollView的高度信息
		getScrollViewInfo() {
			// 获取搜索栏的bottom信息，然后用整个屏幕的可用高度减去bottom的值即可获取scrollView的高度(防止双重滚动)
			this._tGetRect('.tn-classify__search--wrap').then((rect) => {
				// 如果获取失败重新获取
				if (!rect) {
					setTimeout(() => {
						this.getScrollViewInfo()
					}, 10)
					return
				}
				// 获取当前屏幕的可用高度
				const systemInfo = uni.getSystemInfoSync()
				this.scrollViewBasicTop = systemInfo.statusBarHeight + rect.bottom + uni.upx2px(10)
				this.scrollViewHeight = systemInfo.safeArea.height + systemInfo.statusBarHeight - rect.bottom -
					uni.upx2px(10) - 49
			})
		},
		// 获取分类菜单每个item的信息
		getTabbarItemRect() {
			let view = uni.createSelectorQuery().in(this)
			for (let i = 0; i < this.tabbar.length; i++) {
				view.select('#tabbar_item_' + i).boundingClientRect()
			}
			view.exec(res => {
				if (!res.length) {
					setTimeout(() => {
						this.getTabbarItemRect()
					}, 10)
					return
				}

				// 将每个分类item的相关信息
				res.map((item) => {
					this.tabbarItemInfo.push({
						top: item.top,
						height: item.height
					})
				})
			})
		},
		// 点击了分类导航
		clickClassifyNav(index) {
			if (this.currentTabbarIndex === index) {
				return
			}
			this.currentTabbarIndex = index

			this.handleLeftScrollView(index)
			this.switchClassifyContent()
		},
		// 点击分类后，处理scrollView滚动到居中位置
		handleLeftScrollView(index) {
			const tabbarItemTop = this.tabbarItemInfo[index].top - this.scrollViewBasicTop
			if (tabbarItemTop > this.scrollViewHeight / 2) {
				this.leftScrollViewTop = tabbarItemTop - (this.scrollViewHeight / 2) + this.tabbarItemInfo[index]
					.height
			} else {
				this.leftScrollViewTop = 0
			}
		},
		// 切换对应分类的数据
		switchClassifyContent() {
			this.rightScrollViewTop = 1
			this.$nextTick(() => {
				this.rightScrollViewTop = 0
			})
			// 使用深拷贝来避免直接修改原始数据
			const newClassify = JSON.parse(JSON.stringify(listData.data[this.currentTabbarIndex].classify));
			// 使用 Vue.set 确保数据响应性
			this.$set(this.classifyContent.subClassify[0], 'title', this.tabbar[this.currentTabbarIndex]);
			this.$set(this.classifyContent.subClassify[0], 'classify', newClassify);
		},
		// 跳转到相应的页面
		toClick(sub_index) {
			console.log("sub_index--->", sub_index);
			// 获取要跳转的 URL
			const url = this.classifyContent.subClassify[0].classify[sub_index].url;

			// 检查 URL 是否有效
			if (url) {
				// 使用 uni.navigateTo 进行页面跳转
				uni.navigateTo({
					url: url
				});
			} else {
				console.warn("无效的 URL:", url);
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.page-classify {
	max-height: 100vh;
	// background-image: url('https://bcdn.banxx.cn/svg/b9.png');
	background-size: cover;
}

/* 自定义导航栏内容 start */
.custom-nav {
	height: 100%;

	&__back {
		margin: auto 30rpx;
		margin-right: 10rpx;
		flex-basis: 5%;
		width: 100rpx;
		position: absolute;
	}
}

.left-width {
	flex-basis: 28%;
	color: #7f7f7f;
}

/* 自定义导航栏内容 end */
.tn-classify {

	/* 搜索栏 start */
	&__search {
		&--wrap {}

		&__box {
			flex: 1;
			text-align: center;
			padding: 20rpx 30rpx;
			margin: 0 30rpx;
			border-radius: 60rpx;
			font-size: 30rpx;
		}

		&__icon {
			padding-right: 10rpx;
		}

		&__text {
			padding-right: 10rpx;
		}
	}

	/* 搜索栏 end */

	/* 分类列表和内容 strat */
	&__container {}

	&__left-box {}

	&__right-box {
		background-color: #FFFFFF;
	}

	/* 分类列表和内容 end */

	/* 侧边导航 start */
	&__tabbar {
		&__item {
			height: 110rpx;

			&:first-child {
				border-top-right-radius: 0rpx;
			}

			&:last-child {
				border-bottom-right-radius: 0rpx;
			}

			&--active {
				background-color: #FFFFFF;
				position: relative;
				font-weight: bold;
				background: linear-gradient(100deg, rgba(148, 187, 233, 1) 0%, rgba(148, 187, 233, 1) 47%, rgba(202, 179, 214, 1) 63%, rgba(238, 174, 202, 1) 100%);
				-webkit-background-clip: text;
				/* 背景裁剪到文本 */
				-webkit-text-fill-color: transparent;
				/* 使文本颜色透明 */

				&::before {
					content: '';
					position: absolute;
					width: 15rpx;
					height: 40rpx;
					top: 50%;
					left: 0;
					background: linear-gradient(126deg, rgba(238, 174, 202, 1) 0%, rgba(182, 220, 206, 1) 52%, rgba(148, 187, 233, 1) 100%);
					border-radius: 12rpx;
					transform: translateY(-50%) translateX(-50%);
				}

				&--prev {
					border-bottom-right-radius: 26rpx;
				}

				&--next {
					border-top-right-radius: 26rpx;
				}
			}
		}
	}

	/* 侧边导航 end */

	/* 分类内容 start */
	&__content {
		margin: 18rpx;

		/* 推荐商品 start */
		&__recomm {
			margin-bottom: 40rpx;

			&__swiper {}
		}

		/* 推荐商品 end */

		/* 子栏目 start */
		&__sub-classify {
			margin-bottom: 20rpx;
			padding-bottom: 40rpx;
			color: #acacac;

			&__content {

				&__item {
					width: 50%;
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;
				}

				&__image {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: space-between;
					border-radius: 20rpx;
					margin: 20rpx 10rpx;
					width: 80%;
					height: 270rpx;
					overflow: hidden;
					position: relative;
					border: 2rpx solid #656565;

					.cls-img {
						width: 100%;
						height: 0;
						padding-bottom: 100%;
						position: relative;
						display: flex;
						align-items: center;
						justify-content: center;
						// border: 1rpx solid #aa0000;

						.svg-image {
							margin-top: 100%;
							width: 80px;
							height: 80px;
							object-fit: cover;
						}
					}

					&__title {
						flex: 1;
						width: 100%;
						text-align: center;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}
			}
		}

		/* 子栏目 end */
	}

	/* 分类内容 end */
}
</style>