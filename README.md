
## 介绍

一诞是一款基于腾讯云的人脸识别、五官定位的圣诞主题小程序。开始做它的初衷是为了简化用户操作，与其他手动添加帽子的小程序形成差别，所见即所得。
但是在开发的适合遇到了一些问题，没有完美的方案来根据五官定位API返回的坐标点来准确的给人物戴上帽子。
最后无奈之下就加入了圣诞贺卡的功能，弱化了生成头像的功能。
小程序全部功能使用云开发，大大减少了一个人的工作量。

## 贺卡功能介绍

贺卡是我在初中、小学的时候，圣诞最常送的礼物。小程序的转发恰好是赠送贺卡的最好入口，再加上一些抖音的模式。每个用户转发赠送的贺卡内容都会上传（这里忘记征求用户同意），在主页就可以使用摇一摇的方式来查看下一条贺卡内容，并且可以点赞。

## 五官定位戴帽子

五官定位使用的是腾讯云的API，它可以返回五官的坐标，[了解更多](https://cloud.tencent.com/document/product/867/17585)。这里使用云函数可以快速的拿到返回参数，将坐标点绘制在画布上。

#### 安装依赖

``` bash
    npm i --save image-node-sdk
```

#### 云函数调用五官定位API

``` javascript
// 云函数入口文件
const cloud = require('wx-server-sdk')
const {ImageClient} = require('image-node-sdk');
let AppId = ''; // 腾讯云 AppId
let SecretId = ''; // 腾讯云 SecretId
let SecretKey = ''; // 腾讯云 SecretKey
const imgClient = new ImageClient({
  AppId,
  SecretId,
  SecretKey
});
cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const url = event.url;
  const result = await imgClient.faceShape({
    data: {
      appid: AppId,
      mode: 1,
      url,
    },
  });
  return JSON.parse(result.body);
}
```
![五官定位模型](https://blogimg-1252809090.cos.ap-chengdu.myqcloud.com/Christmas/Christmas_data.jpg)

接下来就是根据坐标来准确戴帽子了，但是我能力有限，没有一套比较好的方案，只有在正脸情况下能够准确戴上帽子。帽子也是根据坐标点画出来的，非提前画好的图。如果你有好的想法欢迎联系我（WeChat：tysb7_)

![](https://blogimg-1252809090.cos.ap-chengdu.myqcloud.com/Christmas/Christmas_qrcode.jpg)

## 总结

这款小程序初衷是为了学习使用腾讯云人脸识别API，定位是为了蹭热度。但是时间、推广和能力的原因没能打造成一个爆款。不过在从中收获了许多东西，源码已经上传至GitHub，欢迎大家一起来维护。

GitHub: [本文项目仓库](https://github.com/tysb7/Christmas)

WeChat: tysb7_

blog: [www.tysb7.cn](https://www.tysb7.cn/)

Email: <terry@qiaokr.com>

SSl: [环洋诚信™](https://www.trustocean.com/)
