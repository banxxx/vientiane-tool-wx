<template>
	<view class="page-home">
		<view class="head_box">
			<image src='https://bcdn.banxx.cn/svg/bbblurry-home.svg' mode='widthFix' class='backgroud-image'></image>
		</view>
		<view class="bottom_box">
			<!-- 头部box -->
			<view class="top_one">
				<view class="wallpaper" @click="toClick()">
					<image class="overlay-image" src="../../static/png/day-w.png" />
					<image class="w-img" src="https://bing.img.run/1366x768.php" />
				</view>
				<view class="wallpaper2" style="z-index: 100;color: aliceblue;">每日壁纸</view>
			</view>
			<!-- 收藏box -->
			<view class="collect_box">
				<image class="cl-star" src="../../static/png/star.png"></image>
				<view class="btn-border">
					<text>+ 将工具收藏在首页显示</text>
				</view>
			</view>
			<!-- 热门box -->
			<view class="hot-box">
				<image class="cl-hot" src="../../static/png/hot.png"></image>
				<view>
					<u-grid :border="false" col="4">
						<u-grid-item v-for="(listItem, listIndex) in list" :key="listIndex">
							<view class="cl-grid">
								<u-icon :customStyle="{ paddingTop: 20 + 'rpx' }" :name="listItem.name"
									:size="22"></u-icon>
								<text class="grid-text">{{ listItem.title }}</text>
							</view>
						</u-grid-item>
					</u-grid>
					<u-toast ref="uToast" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'PageHome',
	data() {
		return {
			list: [{
				name: 'photo',
				title: '图片'
			},
			{
				name: 'lock',
				title: '锁头'
			},
			{
				name: 'star',
				title: '星星'
			},
			{
				name: 'hourglass',
				title: '沙漏'
			},
			{
				name: 'home',
				title: '首页'
			},
			{
				name: 'star',
				title: '音量'
			},
			]
		}
	},
	onLoad() { },
	methods: {
		click(name) {
			this.$refs.uToast.success(`点击了第${name}个`)
		},
		toClick() {
			uni.navigateTo({
				url: "/tools/image/wallpaper"
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.page-home {
	display: grid;
	height: 100vh;
	grid-template-rows: 100px 1fr;
}

.head_box {
	height: 450rpx;
	z-index: -1;

	.backgroud-image {
		width: 100%;
		height: 450rpx;
		z-index: -1;
	}
}

// 底部盒子
.bottom_box {
	display: flex;
	background-color: #fff;
	border-radius: 30px 30px 0 0;
	flex-direction: column;
	box-shadow: 14px 14px 39px #cccccc,
		-4px -34px 39px #ffffff;
}

// 头部盒子
.top_one {
	margin-top: 5%;
	width: 100%;
	height: 20%;
	display: flex;
	flex-direction: row;
}

.wallpaper {
	background-color: #c5ebad;
	border-radius: 15px;
	width: 50vw;
	height: 30vw;
	margin-left: 5%;
	// border: 4rpx solid #790606;
	position: relative; /* 使子元素绝对定位 */
	overflow: hidden; /* 隐藏溢出部分 */
}

.w-img {
	position: absolute; /* 绝对定位 */
	top: 0;
	left: 0;
	width: 100%; /* 填充整个容器 */
	height: 100%; /* 填充整个容器 */
	object-fit: cover; /* 保持纵横比并覆盖整个容器 */
}

.overlay-image {
	position: relative; /* 使其在 w-img 之上 */
	z-index: 10; /* 确保在 w-img 之上 */
	width: 100px; /* 根据需要设置宽度 */
	height: 40px; /* 根据需要设置高度 */
}

.wallpaper2 {
	background-color: #c5ebad;
	border-radius: 15px;
	width: 30vw;
	height: 30vw;
	margin-left: 6%;
}

// 我的收藏box
.collect_box {
	width: 100%;
	height: 30%;
	display: grid;
}

// 我的收藏文字
.cl-star {
	width: 150rpx;
	height: 50rpx;
}

// 收藏框box
.btn-border {
	width: 90%;
	height: 150px;
	display: grid;
	// 水平居中
	margin: 0 auto;
	border: 4rpx solid #acacac;
	border-style: dashed;
	border-radius: 30rpx 30rpx 30rpx 30rpx;
	place-items: center;
	color: #acacac;
}

// 热门box
.hot-box {}

// 热门文字
.cl-hot {
	width: 150rpx;
	height: 50rpx;
}

.grid-text {
	font-size: 14px;
	color: #909399;
	padding: 10rpx 0 20rpx 0rpx;
	/* #ifndef APP-PLUS */
	box-sizing: border-box;
	/* #endif */
}

.cl-grid {
	width: 150rpx;
	height: 150rpx;
	display: grid;
	// 设置居中
	place-items: center;
	gap: 30rpx;
	margin: 5px 0;
	border-radius: 15rpx;
	border: 2rpx solid #acacac;
}
</style>