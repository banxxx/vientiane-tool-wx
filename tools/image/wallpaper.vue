<template>
    <view class="wallpaper">

        <!-- 顶部自定义导航 -->
        <tn-nav-bar fixed customBack :bottomShadow="false" backgroundColor="#94bbe9">
            <view slot="back" class='tn-custom-nav-bar__back' @click="goBack()">
                <text class='icon tn-icon-left-arrow'></text>
            </view>
            <view class="tn-flex tn-flex-col-center tn-flex-row-center ">
            </view>
        </tn-nav-bar>

        <view class="" style="padding: 30rpx 20rpx;">
            <tn-waterfall ref="waterfall" v-model="list" @finish="handleWaterFallFinish">
                <template v-slot:left="{ leftList }">
                    <view v-for="(item, index) in leftList" :key="item.id" class="product__item" @click="">
                        <view class="item__image">
                            <tn-lazy-load :threshold="6000" height="100%" :image="item.mainImage" :index="item.id"
                                imgMode="widthFix"></tn-lazy-load>
                        </view>
                    </view>
                </template>
                <template v-slot:right="{ rightList }">
                    <view v-for="(item, index) in rightList" :key="item.id" class="product__item" @click="">
                        <view class="item__image">
                            <tn-lazy-load :threshold="6000" height="100%" :image="item.mainImage" :index="item.id"
                                imgMode="widthFix"></tn-lazy-load>
                        </view>
                    </view>
                </template>
            </tn-waterfall>
        </view>

        <tn-load-more :status="loadStatus"></tn-load-more>
    </view>
</template>

<script>
import { API_ENDPOINTS } from '../../static/js/api'; // 引入 API 配置

export default {
    data() {
        return {
            loadStatus: 'loadmore',
            list: []
        };
    },
    mounted() {
    },
    onLoad() {
        this.loadWallpaper()
    },
    methods: {
        // 返回上一个页面
        goBack() {
            uni.navigateBack({
                delta: 1 // 返回上一个页面
            });
        },
        loadWallpaper() {
            this.loadStatus = 'loading'
            const postData = {
                key: '0'
            }
            uni.request({
                url: API_ENDPOINTS.loadWallpaper,
                method: "POST",
                data: postData,
                success: (res) => {
                    console.log("res.data->>", res.data);
                    this.list.push(...res.data.data)
                    console.log("this.list->>", this.list)
                }
            });
        },
        // 瀑布流加载完毕事件
        handleWaterFallFinish() {
            this.loadStatus = 'loadmore'
        },
    }
};
</script>

<style lang="scss" scoped>
/* 胶囊*/
.tn-custom-nav-bar__back {
    width: 60%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.15);
    border-radius: 1000rpx;
    border: 1rpx solid rgba(255, 255, 255, 0.5);
    color: #FFFFFF;
    font-size: 18px;

    .icon {
        display: block;
        flex: 1;
        margin: auto;
        text-align: center;
    }

}

/* 瀑布流*/
.product__item {
		background-color: #FFFFFF;
		overflow: hidden;
		margin: 0 10rpx;
		margin-bottom: 20rpx;
		// box-shadow: 0rpx 0rpx 30rpx 0rpx rgba(0, 0, 0, 0.07);

		.item {

			/* 图片 start */
			&__image {
				width: 100%;
				height: auto;
				background-color: #FFFFFF;
				border: 1rpx solid #F8F7F8;
				border-radius: 10rpx;
				overflow: hidden;
			}

			/* 图片 end */

			/* 内容 start */
			&__data {
				padding: 14rpx 0rpx;
			}

			/* 标题 start */
			&__title-container {
				text-align: justify;
				line-height: 38rpx;
				vertical-align: middle;
			}

			&__store-type {
				height: 28rpx;
				font-size: 20rpx;
				position: relative;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				padding: 4rpx;
				border-radius: 6rpx;
				white-space: nowrap;
				text-align: center;
				top: -2rpx;
				margin-right: 6rpx;
			}

			&__title {
				font-size: 30rpx;
			}

			/* 标题 end */

			/* 标签 start */
			&__tags-container {
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				align-items: center;
				justify-content: flex-start;
			}

			&__tag {
				margin: 10rpx;
				color: #7C8191;
				background-color: #F3F2F7;
				padding: 4rpx 14rpx 6rpx;
				border-radius: 10rpx;
				font-size: 20rpx;

				&:first-child {
					margin-left: 0rpx !important;
				}
			}

			/* 标签 end */
			/* 内容 end */
		}
	}
</style>