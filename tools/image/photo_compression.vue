<template>
    <view class="page-classify">
        <!-- 顶部自定义导航 -->
        <tn-nav-bar fixed customBack :bottomShadow="false" backgroundColor="#94bbe9">
            <view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
                <text class='icon tn-icon-left-arrow'></text>
            </view>
            <view class="tn-flex tn-flex-col-center tn-flex-row-center ">
            </view>
        </tn-nav-bar>

        <view class="menu">
            <view :class="['image-selector', { 'border-none': !hasBorder }]" @click="selectPhoto()">
                <view class="image-a" v-if="beforeCompressPath != ''">
                    <image v-if="beforeCompressPath" :src="beforeCompressPath" />
                </view>
                <view class="image-b" v-else>
                    <image v-if="beforeCompressPath" :src="beforeCompressPath" mode="aspectFill"
                        class="selected-image" />
                    <text v-else class="placeholder-text">+ 选择照片</text>
                </view>
            </view>
            <view v-show="beforeCompressPath != ''">大小: {{ beforeSize }}</view>
            <!-- <view class="action" @click="compress()">
                <text>压缩</text>
            </view> -->

            <button type="button" class="button" @click="compress()">
                <span class="fold"></span>

                <view class="points_wrapper">
                    <i class="point"></i>
                    <i class="point"></i>
                    <i class="point"></i>
                    <i class="point"></i>
                    <i class="point"></i>
                    <i class="point"></i>
                    <i class="point"></i>
                    <i class="point"></i>
                    <i class="point"></i>
                    <i class="point"></i>
                </view>

                <span class="inner">
                    <image class="icon" src="https://cloud.banxx.cn/image/soo.svg" mode="aspectFit"
                        style="filter: brightness(0) invert(1);"></image>
                    压缩
                </span>
            </button>


            <view :class="['image-selector', { 'border-none': true }]" v-show="afterCompressPath != ''">
                <image :src="afterCompressPath" />
            </view>
            <view class="afterCompressClass" v-if="afterCompressPath"> <!-- 仅在 afterCompressPath 有值时显示 -->
                <view>大小: {{ afterSize }}</view>
                <!-- <view class="action" @click="download()">
                    <text>下载</text>
                </view> -->

                <button type="button" class="button" @click="download()">
                    <span class="fold"></span>

                    <view class="points_wrapper">
                        <i class="point"></i>
                        <i class="point"></i>
                        <i class="point"></i>
                        <i class="point"></i>
                        <i class="point"></i>
                        <i class="point"></i>
                        <i class="point"></i>
                        <i class="point"></i>
                        <i class="point"></i>
                        <i class="point"></i>
                    </view>

                    <span class="inner">
                        <image class="icon" src="https://cloud.banxx.cn/image/download.svg" mode="aspectFit"
                            style="filter: brightness(0) invert(1);"></image>
                        下载
                    </span>
                </button>

            </view>
        </view>

    </view>
</template>

<script>
import { API_ENDPOINTS } from '../../static/js/api'; // 引入 API 配置

export default {
    components: {
    },
    data() {
        return {
            showPrivacy: false,
            beforeCompressPath: '',
            afterCompressPath: '',
            paths: [],
            beforeSize: 0,
            afterSize: 0,
            hasBorder: true,
            params: {
                maxSize: 600,
                fileType: 'png',
                quality: 0.5,
                minSize: -1
            }
        };
    },
    computed: {
    },
    methods: {
        // 返回上一个页面
        goBack() {
            uni.navigateBack({
                delta: 1 // 返回上一个页面
            });
        },
        // 选择照片
        selectPhoto() {
            uni.chooseMedia({
                count: 1,
                mediaType: ['image'],
                sizeType: ['original'],
                sourceType: ['album'],
                success: (res) => {
                    this.paths = res.tempFiles;

                    // 检查文件类型
                    const filePath = this.paths[0].path;
                    const fileExtension = this.paths[0].tempFilePath.split('.').pop().toLowerCase(); // 获取文件后缀名
                    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif']; // 允许的文件后缀名

                    if (!allowedExtensions.includes(fileExtension)) {
                        uni.showToast({
                            title: '只允许选择 JPG、JPEG、PNG 或 GIF 格式的图片',
                            icon: 'none'
                        });
                        return; // 退出方法
                    }

                    // 检查文件大小
                    const sizeInBytes = this.paths[0].size; // 获取文件大小（字节）
                    if (sizeInBytes > 5 * 1024 * 1024) { // 5MB
                        uni.showToast({
                            title: '文件大小不能超过 5MB',
                            icon: 'none'
                        });
                        return; // 退出方法
                    }

                    this.beforeCompressPath = this.paths[0].tempFilePath;
                    this.hasBorder = false; // 选择图片后去掉边框
                    console.log(res.tempFiles);

                    // 转换为 KB 或 MB
                    let sizeInKB = sizeInBytes / 1024; // 转换为 KB
                    let sizeInMB = sizeInKB / 1024; // 转换为 MB

                    let displaySize;
                    if (sizeInKB >= 1024) {
                        displaySize = sizeInMB.toFixed(2) + ' MB'; // 大于 1024 KB，显示为 MB
                    } else {
                        displaySize = sizeInKB.toFixed(2) + ' KB'; // 否则显示为 KB
                    }
                    this.beforeSize = displaySize;
                }
            });
        },
        // 单张压缩
        compress() {
            if (this.beforeCompressPath === '') {
                uni.showToast({
                    title: '请选择图片',
                    icon: 'none'
                });
                return;
            }
            uni.showLoading({
                title: '压缩中',
                mask: true
            });

            // 获取要压缩的图片路径
            const imagePath = this.paths[0].tempFilePath;

            // 发送请求到指定的 API 地址
            uni.uploadFile({
                url: API_ENDPOINTS.compressImage, // API 地址
                filePath: imagePath, // 要上传的文件路径
                name: 'file', // 服务器端接收文件的字段名
                header: {
                    "Content-Type": "multipart/form-data"
                },
                formData: {
                },
                success: (res) => {
                    uni.hideLoading();
                    if (res.statusCode === 200) {
                        // 请求成功，处理返回的数据
                        const data = JSON.parse(res.data); // 解析返回的 JSON 数据
                        const { url, size } = data.data; // 解构获取 url 和 size

                        // 将返回的 URL 赋值给 afterCompressPath
                        this.afterCompressPath = url;

                        // 转换为 KB 或 MB
                        let sizeInKB = size / 1024; // 转换为 KB
                        let sizeInMB = sizeInKB / 1024; // 转换为 MB

                        let displaySize;
                        if (sizeInKB >= 1024) {
                            displaySize = sizeInMB.toFixed(2) + ' MB'; // 大于 1024 KB，显示为 MB
                        } else {
                            displaySize = sizeInKB.toFixed(2) + ' KB'; // 否则显示为 KB
                        }

                        // 将转换后的大小赋值给 afterSize
                        this.afterSize = displaySize;

                        uni.showToast({
                            title: "压缩成功",
                            icon: "success"
                        });
                    } else {
                        uni.showToast({
                            title: "压缩失败",
                            icon: "none"
                        });
                    }
                },
                fail: (err) => {
                    uni.hideLoading();
                    console.error('请求失败:', err);
                    uni.showToast({
                        title: "请求失败",
                        icon: "none"
                    });
                }
            });
        },
        getBase64ImageSize(base64String) {
            // 获取 Base64 字符串的长度
            const base64Length = base64String.length;

            // 计算 padding
            const padding = (base64String.endsWith('==') ? 2 : (base64String.endsWith('=') ? 1 : 0));

            // 计算字节数
            const byteSize = (base64Length * 3 / 4) - padding;

            // 转换为 KB 或 MB
            const sizeInKB = byteSize / 1024;
            const sizeInMB = sizeInKB / 1024;

            return {
                byteSize: byteSize,
                sizeInKB: sizeInKB.toFixed(2), // 保留两位小数
                sizeInMB: sizeInMB.toFixed(2)  // 保留两位小数
            };
        },
        download() {
            console.log("1111111")
            if (this.afterCompressPath) {
                // 使用 downloadFile 方法下载文件
                uni.downloadFile({
                    url: this.afterCompressPath, // 网络文件地址
                    success: (downloadRes) => {
                        if (downloadRes.statusCode === 200) {
                            // 下载成功，保存文件
                            uni.saveImageToPhotosAlbum({
                                filePath: downloadRes.tempFilePath, // 使用下载的临时文件路径
                                success: (saveRes) => {
                                    uni.showToast({
                                        title: '图片已保存',
                                        icon: 'success'
                                    });
                                },
                                fail: (err) => {
                                    console.error('保存文件失败:', err);
                                    uni.showToast({
                                        title: '保存文件失败',
                                        icon: 'none'
                                    });
                                }
                            });
                        } else {
                            uni.showToast({
                                title: '下载失败',
                                icon: 'none'
                            });
                        }
                    },
                    fail: (err) => {
                        console.error('下载失败:', err);
                        uni.showToast({
                            title: '下载失败',
                            icon: 'none'
                        });
                    }
                });
            } else {
                uni.showToast({
                    title: '没有可下载的图片',
                    icon: 'none'
                });
            }
        },
        handleAgreePrivacyAuthorization() {
            // 用户同意隐私协议事件回调
            // 用户点击了同意，之后所有已声明过的隐私接口和组件都可以调用了
            // wx.getUserProfile()
            // wx.chooseMedia()
            // wx.getClipboardData()
            // wx.startRecord()
        },
        handleOpenPrivacyContract() {
            // 打开隐私协议页面
            wx.openPrivacyContract({
                success: () => { }, // 打开成功
                fail: () => { }, // 打开失败
                complete: () => { }
            })
        }
    }
};
</script>

<style lang="scss" scoped>
/* 添加样式 */
/* 禁用滚动条 */
.page-classify {
    overflow: hidden;
    /* 禁用滚动条 */
    height: 100vh;
    /* 设置高度为视口高度 */
}

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

.menu {
    margin-top: 100px;
    // border: 1rpx solid #aa0000;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.image-selector {
    margin-top: 50px;
    width: 200px;
    height: 200px;
    display: flex;
    border: 2px dashed #acacac;
    /* 默认边框 */
    border-radius: 30rpx;
    justify-content: center;
    align-items: center;
    position: relative;
    /* 使子元素绝对定位相对于此元素 */

    image {
        width: 100%;
        /* 占满父元素 */
        height: 100%;
        /* 占满父元素 */
        position: absolute;
        /* 绝对定位 */
        top: 0;
        /* 顶部对齐 */
        left: 0;
        /* 左侧对齐 */
    }
}

.afterCompressClass {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.imageSelectorClass {
    width: 200px;
    height: 200px;
    display: flex;
    // border: 2px dashed #acacac;
    // border: 1rpx solid #aa0000;
    /* 默认边框 */
    border-radius: 30rpx;
    justify-content: center;
    align-items: center;
    position: relative;
    /* 使子元素绝对定位相对于此元素 */

    image {
        width: 100%;
        /* 占满父元素 */
        height: 100%;
        /* 占满父元素 */
        position: absolute;
        /* 绝对定位 */
        top: 0;
        /* 顶部对齐 */
        left: 0;
        /* 左侧对齐 */
    }
}

.border-none {
    border: none;
    /* 去掉所有边框 */
}

// .action {
//     border: 4rpx solid #acacac;
//     border-radius: 25rpx;
//     width: 200px;
//     /* 设置宽度 */
//     height: 50px;
//     margin-top: 30px;
//     display: flex;
//     justify-content: center;
//     align-items: center;
// }

/* From Uiverse.io by ilkhoeri */
.button {
    --h-button: 48px;
    --w-button: 200px;
    --round: 0.75rem;
    margin-top: 30px;
    cursor: pointer;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: all 0.25s ease;
    background: radial-gradient(65.28% 65.28% at 50% 100%,
            rgba(223, 113, 255, 0.8) 0%,
            rgba(223, 113, 255, 0) 100%),
        linear-gradient(0deg, #7a5af8, #7a5af8);
    border-radius: var(--round);
    border: none;
    outline: none;
    padding: 12px 50px;
}

.button::before,
.button::after {
    content: "";
    position: absolute;
    inset: var(--space);
    transition: all 0.5s ease-in-out;
    border-radius: calc(var(--round) - var(--space));
    z-index: 0;
}

.button::before {
    --space: 1px;
    background: linear-gradient(177.95deg,
            rgba(255, 255, 255, 0.19) 0%,
            rgba(255, 255, 255, 0) 100%);
}

.button::after {
    --space: 2px;
    background: radial-gradient(65.28% 65.28% at 50% 100%,
            rgba(223, 113, 255, 0.8) 0%,
            rgba(223, 113, 255, 0) 100%),
        linear-gradient(0deg, #7a5af8, #7a5af8);
}

.button:active {
    transform: scale(0.95);
}

.fold {
    z-index: 1;
    position: absolute;
    top: 0;
    right: 0;
    height: 1rem;
    width: 1rem;
    display: inline-block;
    transition: all 0.5s ease-in-out;
    background: radial-gradient(100% 75% at 55%,
            rgba(223, 113, 255, 0.8) 0%,
            rgba(223, 113, 255, 0) 100%);
    box-shadow: 0 0 3px black;
    border-bottom-left-radius: 0.5rem;
    border-top-right-radius: var(--round);
}

.fold::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 150%;
    height: 150%;
    transform: rotate(45deg) translateX(0%) translateY(-18px);
    background-color: #e8e8e8;
    pointer-events: none;
}

.button:hover .fold {
    margin-top: -1rem;
    margin-right: -1rem;
}

.points_wrapper {
    overflow: hidden;
    width: 100%;
    height: 100%;
    pointer-events: none;
    position: absolute;
    z-index: 1;
}

.points_wrapper .point {
    bottom: -10px;
    position: absolute;
    animation: floating-points infinite ease-in-out;
    pointer-events: none;
    width: 2px;
    height: 2px;
    background-color: #fff;
    border-radius: 9999px;
}

@keyframes floating-points {
    0% {
        transform: translateY(0);
    }

    85% {
        opacity: 0;
    }

    100% {
        transform: translateY(-55px);
        opacity: 0;
    }
}

.points_wrapper .point:nth-child(1) {
    left: 10%;
    opacity: 1;
    animation-duration: 2.35s;
    animation-delay: 0.2s;
}

.points_wrapper .point:nth-child(2) {
    left: 30%;
    opacity: 0.7;
    animation-duration: 2.5s;
    animation-delay: 0.5s;
}

.points_wrapper .point:nth-child(3) {
    left: 25%;
    opacity: 0.8;
    animation-duration: 2.2s;
    animation-delay: 0.1s;
}

.points_wrapper .point:nth-child(4) {
    left: 44%;
    opacity: 0.6;
    animation-duration: 2.05s;
}

.points_wrapper .point:nth-child(5) {
    left: 50%;
    opacity: 1;
    animation-duration: 1.9s;
}

.points_wrapper .point:nth-child(6) {
    left: 75%;
    opacity: 0.5;
    animation-duration: 1.5s;
    animation-delay: 1.5s;
}

.points_wrapper .point:nth-child(7) {
    left: 88%;
    opacity: 0.9;
    animation-duration: 2.2s;
    animation-delay: 0.2s;
}

.points_wrapper .point:nth-child(8) {
    left: 58%;
    opacity: 0.8;
    animation-duration: 2.25s;
    animation-delay: 0.2s;
}

.points_wrapper .point:nth-child(9) {
    left: 98%;
    opacity: 0.6;
    animation-duration: 2.6s;
    animation-delay: 0.1s;
}

.points_wrapper .point:nth-child(10) {
    left: 65%;
    opacity: 1;
    animation-duration: 2.5s;
    animation-delay: 0.2s;
}

.inner {
    z-index: 2;
    gap: 6px;
    position: relative;
    width: 100%;
    color: white;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    transition: color 0.2s ease-in-out;
}

.inner image.icon {
    width: 18px;
    height: 18px;
    transition: fill 0.1s linear;
}

.button:focus image.icon {
    fill: white;
}

.button:hover image.icon {
    fill: transparent;
    animation:
        dasharray 1s linear forwards,
        filled 0.1s linear forwards 0.95s;
}

@keyframes dasharray {
    from {
        stroke-dasharray: 0 0 0 0;
    }

    to {
        stroke-dasharray: 68 68 0 0;
    }
}

@keyframes filled {
    to {
        fill: white;
    }
}
</style>
