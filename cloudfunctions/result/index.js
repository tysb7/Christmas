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
